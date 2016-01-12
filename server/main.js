var path = require('path');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var cookieParser = require('cookie-parser');
var knexConfig = require('../knexfile');
var knex = require('knex')(knexConfig.development);
var bookshelf = require('bookshelf')(knex);
var bodyParser = require('body-parser');
var _ = require('lodash');
var BPromise = require('bluebird');
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;
var session = require('express-session');


var config = {};

config.ldap = require("./ldap.json");

var app = module.exports = express();

var globalConfig = {
    minify: process.env.MINIFY == 'yes' ? true : false,
    environment: process.env.ENVIRONMENT || 'local'
};

var rootPath = path.dirname(__dirname);
var port = Number(process.env.PORT || 9999);

passport.use(new LdapStrategy(config.ldap,
        function (profile, done) {
            return done(null, profile);
        }
));

app.use(session({
    secret: 'frecht',
    cookie: {
        maxAge: 60 * 1000 * 60 //1 hour
//        maxAge: 20 * 1000 //10 seconds, debug
    },
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    if ('HEAD' === req.method || 'OPTIONS' === req.method)
        return next();
    // break session hash / force express to spit out a new cookie once per second at most
    req.session._garbage = Date();
    req.session.touch();
    next();
});
app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

app.set('views', path.join(rootPath, 'server'));
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('bookshelf', bookshelf);
var models = require('require-directory')(module, './models');

for (var modelName in models) {
    global[modelName] = models[modelName];
    app.set(modelName, models[modelName]);
}

if (globalConfig.environment == 'local') {
    app.use(require('connect-livereload')());
}

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

var isLoggedIn = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send(401, {error: 'Unauthorized'});
    }
};

app.get('/test', isLoggedIn, function (req, res) {
    res.send('hello');
});

app.use(function (req, res, next) {
    var config = configFromReq(req);
    var parsedUrl = url.parse(req.url);
    var splittedPath = parsedUrl.pathname.split(path.sep);

    if (splittedPath[1]) {
        var fileExtension = getFileExtension(parsedUrl.pathname);
        if (fileExtension == 'js' || fileExtension == 'css') {
            addPathPrefix(splittedPath, getMinPrefix(config));
        }
    }

    parsedUrl.pathname = splittedPath.join(path.sep);
    req.url = url.format(parsedUrl);

    req.config = config;
    next();
});

//app.use('/', express.static(path.join(rootPath, 'dist/app')));
app.use(express.static('dist/app'));

app.get('/', function (req, res) {
    renderIndex(req.config, res);
});

app.use('/api/login', function (req, res, next) {
    return new User()
            .query({where: {username: req.body.username}})
            .fetch()
            .then(function (user) {
                if (!user)
                    return res.status(500).json({err: 'user not allowed'});
                else
                    next();
            });
});

app.post('/api/login',
        passport.authenticate('ldapauth', {failWithError: true}),
        function (req, res, next) {
            // handle success
            return res.json({
                status: "ok",
                id: req.user.id,
                username: req.user.sn,
                session: req.user
            });
        },
        function (err, req, res, next) {
            console.log(err);
            // handle error
            return res.status(500).json(err);
        });

app.post('/api/logout', isLoggedIn, function (req, res) {
    req.logout();
    res.send();
});


app.get('/api/users', isLoggedIn, function (req, res) {
    new User().fetchAll().then(function (users) {
        res.send(users);
    }).catch(function (error) {
        console.log(error.stack);
        res.send('Error getting Users');
    });
});

app.get('/api/meetings', isLoggedIn, function (req, res) {
    new Meeting().query(function (qb) {
        qb.orderBy('updated_at', 'desc');
        if (req.query.limit)
            qb.limit(req.query.limit);
    })
            .fetchAll({
                withRelated: ['participants']
            }).then(function (meetings) {
        res.send(meetings);
    }).catch(function (error) {
        console.log(error.stack);
        res.send('Error getting Meetings');
    });
});

app.get('/api/people', isLoggedIn, function (req, res) {
    var q = req.query.q || '';
    knex('people')
            .select()
            .where('surname', 'like', '%' + q + '%')
            .orWhere('institute', 'like', '%' + q + '%')
            .then(function (people) {
                res.send(people);
            }).catch(function (error) {
        console.log(error.stack);
        res.send('Error getting People');
    });
});

app.get('/api/platforms', isLoggedIn, function (req, res) {
    var q = req.query.q || '';
    knex('meetings')
            .distinct()
            .select('platform')
            .where('platform', 'like', '%' + q + '%')
            .then(function (platforms) {
                platforms = _.map(platforms, 'platform');
                res.send(platforms);
            }).catch(function (error) {
        console.log(error.stack);
        res.send('Error getting Platforms');
    });
});

app.post('/api/meetings', isLoggedIn, function (req, res) {
    var meetingFields = ['location', 'date', 'topics', 'platform'];
    var data = _.pick(req.body, meetingFields);
    var participants = req.body.participants;
    new Meeting(data).save()
            .then(function (meeting) {
                var meetingParticipants = [];
                if (participants)
                    meetingParticipants = _.map(participants, function (p) {
                        return {person_id: p.id, meeting_id: meeting.id};
                    });
                return BPromise.all([meeting, knex('meetings_people').insert(meetingParticipants)]);
            })
            .spread(function (meeting) {
                res.send(meeting);
            })
            .catch(function (error) {
                console.log(error.stack);
                res.send('Error creating Meeting');
            });
});

app.put('/api/meetings/:id', isLoggedIn, function (req, res) {
    var meetingFields = ['location', 'date', 'topics', 'platform'];
    var meetingId = req.params.id;
    var data = _.pick(req.body, meetingFields);
    var participants = req.body.participants;
    new Meeting({id: meetingId})
            .save(data)
            .then(function (meeting) {
                return meeting.participants().detach()
                        .then(function (m) {
                            var participantsIds = _.map(participants, 'id');
                            return meeting.participants().attach(participantsIds);
                        });
            })
            .then(function (meeting) {
                res.send(meeting);
            })
            .catch(function (error) {
                console.log(error.stack);
                res.send('Error creating Meeting');
            });
});

app.post('/api/people', isLoggedIn, function (req, res) {
    var meetingFields = ['surname', 'institute'];
    var data = _.pick(req.body, meetingFields);
    new Person(data).save().then(function (person) {
        res.send(person);
    }).catch(function (error) {
        console.log(error.stack);
        res.send('Error creating Person');
    });
});

app.delete('/api/meetings/:id', isLoggedIn, function (req, res) {
    var meetingId = req.params.id;
    new Meeting({id: meetingId})
            .destroy()
            .then(function () {
                res.send();
            });
});

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

function renderIndex(config, res) {
    res.render(getMinPrefix(config) + 'views/index');
}

function configFromReq(req) {
    var config = {};
    config.minify = req.cookies.minify == 'true' ? true : false;
    return config;
}

function getMinPrefix(conf) {
    return conf.minify || globalConfig.minify ? '' : '';
}

function addPathPrefix(filePath, prefix) {
    filePath.splice(1, 0, prefix);
}

function getFileExtension(filePath) {
    return filePath.split('.').pop();
}
