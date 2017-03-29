#!/usr/bin/env bash

docker-compose down

git reset --hard
git pull
chmod u+x deploy.sh
./bower.sh install
./npm.sh install
./knex.sh migrate:latest

docker-compose up -d
