FROM node:10-alpine

LABEL application="tembea-backend"

ENV TERM=xterm-256color NODE_ENV=$NODE_ENV

RUN mkdir -p /usr/app
WORKDIR /usr/app

RUN yarn add typescript -global
COPY package.json yarn.lock /usr/app/

RUN yarn install
