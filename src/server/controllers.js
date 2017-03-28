var app = require('./main');
var knex = app.get('knex');
var _ = require('lodash');

module.exports = {
    getMeetings: function (req, res) {
        var limit = req.query.limit;
        var surname = req.query.surname;
        var institute = req.query.institute;
        var date = req.query.date;
        var dateRange = req.query.daterange ? JSON.parse(req.query.daterange) : null;
        var options = {
            limit: limit,
            surname: surname,
            institute: institute,
            date: date,
            dateRange: dateRange
        };
        new Meeting()
                .get(options)
                .then(function (meetings) {
                    res.send(meetings);
                }).catch(function (error) {
            console.log(error.stack);
            res.send('Error getting Meetings');
        });
    },
    getPeople: function (req, res) {
        var q = req.query.q || '';
        knex('people')
                .select()
                .where('surname', 'ILIKE', '%' + q + '%')
                .orWhere('institute', 'ILIKE', '%' + q + '%')
                .then(function (people) {
                    res.send(people);
                }).catch(function (error) {
            console.log(error.stack);
            res.send('Error getting People');
        });
    },
    getUsers: function (req, res) {
        new User().fetchAll().then(function (users) {
            res.send(users);
        }).catch(function (error) {
            console.log(error.stack);
            res.send('Error getting Users');
        });
    },
    getInstitutes: function (req, res) {
        var q = req.query.q || '';
        knex('people')
                .distinct('institute')
                .where('institute', 'ILIKE', '%' + q + '%')
                .map(function (row) {
                    return row.institute;
                })
                .then(function (people) {
                    res.send(people);
                }).catch(function (error) {
            console.log(error.stack);
            res.send('Error getting Institute');
        });
    },
    getPlatforms: function (req, res) {
        var q = req.query.q || '';
        knex('meetings')
                .distinct()
                .select('platform')
                .where('platform', 'ILIKE', '%' + q + '%')
                .then(function (platforms) {
                    platforms = _.map(platforms, 'platform');
                    res.send(platforms);
                }).catch(function (error) {
            console.log(error.stack);
            res.send('Error getting Platforms');
        });
    },
    createMeeting: function (req, res) {
        var meetingFields = ['location', 'date', 'topics', 'platform'];
        var data = _.pick(req.body, meetingFields);
        var participants = req.body.participants;
        new Meeting(data).save()
                .then(function (meeting) {
                    var participantsIds = _.map(participants, 'id');
                    return meeting.participants().attach(participantsIds);
                })
                .then(function (meeting) {
                    res.send(meeting);
                })
                .catch(function (error) {
                    console.log(error.stack);
                    res.send('Error creating Meeting');
                });
    },
    updateMeeting: function (req, res) {
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
    },
    createPerson: function (req, res) {
        var meetingFields = ['surname', 'institute'];
        var data = _.pick(req.body, meetingFields);
        new Person(data).save().then(function (person) {
            res.send(person);
        }).catch(function (error) {
            console.log(error.stack);
            res.send('Error creating Person');
        });
    },
    deleteMeeting: function (req, res) {
        var meetingId = req.params.id;
        new Meeting({id: meetingId})
                .destroy()
                .then(function () {
                    res.send();
                });
    }
};