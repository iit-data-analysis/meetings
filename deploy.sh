#!/bin/sh

git pull && grunt build-dist && PORT=9999 forever start dist/server/main.js