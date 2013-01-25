Web Audio Components Service
============

[![Build Status](https://travis-ci.org/web-audio-components/web-audio-components-service.png)](https://travis-ci.org/web-audio-components/web-audio-components-service)

The API supporting the Web Audio Components project.

Currently hosted at [web-audio-components-api.jit.su](http://web-audio-components-api.jit.su)

## API

`GET /components`

Returns an array of all audio components

`GET /components?q=query`

Returns an array of components that match query

`GET /components/:user/:project`

Returns the component that matches the user/project name

`GET /components/:user/:project/script.js`

Returns the corresponding component's script

`GET /components/:user/:project/build.js`

Returns the corresponding component's built script

## Development

Install dependencies via `npm install` and run mongodb via `mongod`. Start up the server with `node .`, and go to `localhost:8000` to view the service. By default, the development environment uses mock data, but can be changed to use the components service by changing `USE_MOCKS` to true in the config.

Run tests with `npm test`.
