#!/usr/bin/env bash

git reset --hard
git pull
chmod u+x deploy.sh
bash bower.sh install
bash npm.sh install
bash knex.sh migrate:latest

docker-compose down
docker-compose up -d
