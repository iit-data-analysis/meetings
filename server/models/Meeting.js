/* exported Meeting */

var Person = require('./Person');
var app = require('../main');
var bookshelf = app.get('bookshelf');

var Meeting = module.exports = bookshelf.Model.extend({
    tableName: 'meetings',
    participants: function () {
        return this.belongsToMany(Person);
    }
});