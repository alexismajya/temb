# tembea

[![CircleCI](https://circleci.com/gh/andela/tembea.svg?style=svg&circle-token=8267eb79081c4cac379f0df251c3dd08fa3019ab)](https://circleci.com/gh/andela/tembea)
[![Maintainability](https://api.codeclimate.com/v1/badges/050387a083f8164029db/maintainability)](https://codeclimate.com/repos/5c3ccfdfcd4db661ce001ea3/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/050387a083f8164029db/test_coverage)](https://codeclimate.com/repos/5c3ccfdfcd4db661ce001ea3/test_coverage)

Trip management at it's best for Andela.

## Description

**Tembea** is the our solution for making trip request, scheduling, reporting and analytics very easy at Andela.

## Table of Contents

- [tembea](#tembea)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Documentation](#documentation)
  - [Setup](#setup)
    - [Dependencies](#dependencies)
    - [Getting Started](#getting-started)
      - [Database and ORM](#database-and-orm)
      - [Setup Slack Integration](#setup-slack-integration)
    - [More about environmental variables](#more-about-environmental-variables)
    - [Run the Service Using Docker](#run-the-service-using-docker)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Docker for Local development](#docker-for-local-development)

## Documentation

`/api/v1/slack` : our slack integration is our MVP   
`/api/v1/docs` | `/api/v2/docs` : Swagger API documantation

## Setup

### Dependencies

- [NodeJS](https://github.com/nodejs/node) - A JavaScript runtime environment
- [Express](https://github.com/expressjs/express) - A web application framework for NodeJS
- [PostgreSQL](https://github.com/postgres/postgres) - A relational database management system that extends SQL
- [Redis](https://github.com/antirez/redis) - A in-memory data structure store, used as a database, cache and message broker.

- [Sequelize](https://github.com/sequelize/sequelize) - A promise-based ORM for NodeJS
- [Google Map API](https://github.com/googlemaps/google-maps-services-js) - Node.js client library for Google Maps API Web Services
- [Andela Auth Service](http://api-staging.andela.com/login?redirect_url=https://github.com) - Andela Authentication service
- [AIS](http://api-staging.andela.com/api/v1) - Andela AIS API
- [Mailgun](https://github.com/mailgun/mailgun-js) - Powerful Transactional Email APIs that enable you to send, receive, and track emails, built with developers in mind
- [Twilio](https://github.com/twilio/twilio-node) - Twilio allows software developers to programmatically make and receive phone calls, send and receive text messages, and perform other communication functions using its web service APIs 
### Getting Started

Follow these steps to set up the project in development mode

- Install [Nodejs](https://nodejs.org/en/download/)
- Install and setup [PostgreSQL](https://www.postgresql.org/)
- Clone the repository by running the command

  ```[bash]
  git clone https://github.com/andela/tembea.git
  ```

- Run `cd tembea` to enter the application's directory
- Install the application's dependencies by running the command
  ```
  yarn install
  ```
- Create the `.env` or `.env.development` file by running `cp .env.sample .env` or `cp .env .env.development`
- Populate the env file created above by using instructions provided in this README and actual .env.sample file.
- Setup the database and migrations (**_see [database setup](#database-and-orm, 'setting up database')_**)
- Start the application by running
  ```
  yarn run start:dev
  ```
  The application should now be running at `http://127.0.0.1:5000`

#### Database and ORM

- Create a database in `PostgreSQL` and name it `tembea`
- Set the following environment variables in `.env` (to be created in the `env` directory):

  - `DATABASE_USERNAME` - this is the database username
  - `DATABASE_PASSWORD` - this is the database password. Ignore if you don't have a database password
  - `DATABASE_NAME` - set this to `tembea`

- Run database migrations
  ```
  yarn run db:migrate
  ```
- Check the database and confirm that the `users` table has been created

#### Setup Slack Integration
- Create your slack workspace  goto `https://slack.com` > Your Workspaces > Create Workspace
- Create Slack App go to `https://api.slack.com` > Your Apps > Create New App provides app name eg: `tembea` then select workspace created above
- Go to basic information and notes the followings:
  - Client ID -> SLACK_CLIENT_ID
  - Client Secret -> SLACK_CLIENT_SECRET
  - Signing Secrent -> SLACK_SIGNING_SECRET
- Go to Incomming Webhooks > activate Incomming webhooks > turn it on
- You need live url to interact with slack API servers you can use ngrok or pagekite etc..   
download ngrok and start it.
```shell
$ mv ngrok /usr/local/bin
``` 
start ngrok and copy https url

```shell
$ ngrok http 5000
```
- head back to `https://api.slack.com` and select your app then > Interactive Components > enable it   
Then adds Request URL   
eg: `https://ee01aae4.ngrok.io/api/v1/slack/actions`   
- Go to Slash Command > Create New Command   
   - command : adds `/tembea`
   - Request URL: adds `eg:` `https://ee01aae4.ngrok.io/api/v1/slack/command`
   - adds optional description eg: `Launches tembea`
- Go to OAuth & Permissions   
   - Redirect URLs > add new URL   
eg: `https://ee01aae4.ngrok.io/slackauth`
   - OAuth Tokens & Redirect URLs > Install App to Your Workspace. > select channel tembea will be posting in
   - then note the following env variables   
   OAuth Access Token -> SLACK_BOT_ACCESS_TOKEN

- Go to Bot Users > click add bot user


### More about environmental variables

After setting up your `.env` from the template provided in the `env/.env.sample` file;
to use these environment variables anywhere in the app, simply:

```[js]
process.env.MY_ENV_VARIABLE
```

### Run the Service Using Docker

> NOTE: Make sure no service is running on port 5000 and ensure there is a `.env` file with all the necessary environment variables.

To run the application just type: `make start`

this would run your application inside a container which you can easily access using `localhost:5000`.

To stop the application, you can just hit `^c`.

To delete the containers: `make stop`

> WARNING: Running below command will make you loose all your data including data in the database!

To cleanup all the containers + volumes: `make clean`

> NOTE: The below commands should be run when the application is running inside container

To migrate database: `make migrate`

To seed database: `make seed`

To rollback migrations: `make rollback`

To get inside the container: `make ssh`

HINT: To use docker, ensure that your .env file does not contain `DATABASE_URL` as it conflicts with the value in `docker-compose.yml`

## Testing

[Jest](https://jestjs.io) is used as the testing framework for both the unit tests and integration tests.
To execute all tests, run the command

```
  yarn test or make test
```

## Deployment

TODO - add deployment commands

## Docker for Local development
