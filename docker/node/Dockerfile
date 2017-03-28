FROM node:4-alpine

RUN apk add --no-cache bash git openssh

RUN npm install -g bower
RUN npm install -g grunt-cli

WORKDIR /usr/src/app

EXPOSE 1337
EXPOSE 9999