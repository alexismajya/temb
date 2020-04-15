FROM node:10-alpine

LABEL application="tembea-backend"

ENV TERM=xterm-256color

RUN mkdir -p /usr/app
WORKDIR /usr/app

RUN yarn add typescript -global
COPY package.json yarn.lock .sequelizerc .eslintrc.json tsconfig.json tsconfig.build.json tslint.json jest.config.js /usr/app/
RUN yarn install

COPY src /usr/app/src
COPY integrations /usr/app/integrations
COPY docker/tests/entrypoint.sh /usr/app
