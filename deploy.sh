#!/bin/sh

git pull && npm install && bower install && grunt build-dist && PORT=9999 forever start dist/server/main.js