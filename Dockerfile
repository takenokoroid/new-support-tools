FROM node:18-alpine

WORKDIR /usr/src/app/next

COPY /support-tools/package*.json ./
RUN set -eux; \
    apk add --no-cache --virtual build-dependencies wget unzip gnupg; \
    apk add --no-cache git bash openjdk11-jre curl musl-locales musl-locales-lang;
RUN npm install -g npm@8.19.3

RUN yarn install

RUN yarn upgrade --network-timeout 600000