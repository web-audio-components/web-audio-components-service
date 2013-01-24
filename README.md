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

`GET /components/:owner/:repo`

Returns the component that matches the owner/repo name

`GET /components/:owner/:repo/script.js`

Returns the corresponding component's script

`GET /components/:owner/:repo/build.js`

Returns the corresponding component's built script

## Todo

* Add mock component that requires dependencies
* Twitter posts on new package, like component(1)
* Remove components that are no longer in the registry from the DB
