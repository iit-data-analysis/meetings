'use strict';

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('people', function(table) {
            table.increments();
            table.text('surname');
            table.text('institute');
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'));
        }),
        knex.schema.createTable('meetings_people', function(table) {
            table.increments();
            table.biginteger('meeting_id').unsigned().index().references('id').inTable('meetings');
            table.biginteger('person_id').unsigned().index().references('id').inTable('people');
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('people'),
        knex.schema.dropTableIfExists('meetings_people')
    ]);
};