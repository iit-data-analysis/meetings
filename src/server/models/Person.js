/* exported Person */

var Meeting = require('./Meeting');
var app = require('../main');
var bookshelf = app.get('bookshelf');

var Person = module.exports = bookshelf.Model.extend({
    tableName: 'people',
    meetings: function () {
        return this.belongsToMany(Meeting);
    }
});