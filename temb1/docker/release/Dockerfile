# Use the node 10 alpine image from dockerhub
FROM node:10-alpine

# Tag the image
LABEL application="tembea-backend"

# set variables to use
ENV TERM=xterm-256color NODE_ENV=$NODE_ENV

# Create the usr/app directory incase it doesn't exist
# and set it as the working directory
RUN mkdir -p /usr/src
WORKDIR /usr/

# Run these commands and copy files into the usr/app directory
COPY .sequelizerc.build /usr/src/.sequelizerc
COPY package.json yarn.lock tsconfig.json tsconfig.build.json copyStaticAssets.ts /usr/
COPY src /usr/src

# Install dependancies 
RUN yarn add typescript -global
RUN yarn install


RUN yarn build

# remove all other irrelevant files 
