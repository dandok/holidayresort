FROM node:14-alpine AS compilation


WORKDIR /tmp/compilation

COPY . .

RUN yarn

RUN yarn tsc

FROM node:14-alpine AS build

WORKDIR /tmp/build

COPY . .

RUN yarn --production

FROM node:14-alpine AS production

ENV NODE_ENV production

WORKDIR /app

COPY --from=compilation /tmp/compilation/dist dist
COPY --from=build /tmp/build/node_modules node_modules

COPY bin bin
COPY public public

COPY views views
COPY package.json package.json
EXPOSE 3000

CMD ["yarn" ,"start"]
