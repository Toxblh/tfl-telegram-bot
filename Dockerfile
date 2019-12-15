FROM node:lts-alpine

WORKDIR /server

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD yarn start
