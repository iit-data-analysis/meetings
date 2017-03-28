'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('meetings', function(table) {
            table.increments();
            table.text('platform');
            table.text('topics');
            table.text('location');
            table.date('date')
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'));
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('meetings')
    ]);
};