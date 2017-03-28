/* exported Meeting */

var Person = require('./Person');
var app = require('../main');
var bookshelf = app.get('bookshelf');
var _ = require('lodash');

var Meeting = module.exports = bookshelf.Model.extend({
    tableName: 'meetings',
    participants: function () {
        return this.belongsToMany(Person);
    },
    get: function(options) {
        var limit = options.limit;
        var dateRange = options.dateRange;
        var date = options.date;
        var surname = options.surname;
        var institute = options.institute;
        return this.query(function (qb) {
                    qb.orderBy('updated_at', 'desc');
                    if (limit)
                        qb.limit(limit);
                    if (dateRange)
                        qb.whereBetween('date', [dateRange.startDate, dateRange.endDate]);
                    if (date)
                        qb.where('date', '=', date);
                    if (surname)
                        qb.join('meetings_people', 'meetings.id', '=', 'meetings_people.meeting_id')
                                .join('people', 'people.id', '=', 'meetings_people.person_id')
                                .where('people.surname', 'ILIKE', '%' + surname + '%');
                    if (institute)
                        qb.join('meetings_people', 'meetings.id', '=', 'meetings_people.meeting_id')
                                .join('people', 'people.id', '=', 'meetings_people.person_id')
                                .where('people.institute', 'ILIKE', '%' + institute + '%');
                })
                .fetchAll({
                    withRelated: ['participants']
                })
                .then(function (meetings) {
                    meetings = _.map(meetings.toJSON(), function (m) {
                        m.date = formatDate(m.date);
                        return m;
                    });
                    return meetings;
                });
    }
});



function formatDate(date) {
    var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}