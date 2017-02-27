# fallback-port
> get an available port and preventing eaddrinuse error.

[![Build Status](https://travis-ci.org/hugohua/fallback-port.svg?branch=master)](https://travis-ci.org/hugohua/fallback-port)
[![codecov](https://codecov.io/gh/hugohua/fallback-port/branch/master/graph/badge.svg)](https://codecov.io/gh/hugohua/fallback-port)
[![npm version](https://badge.fury.io/js/fallback-port.svg)](https://badge.fury.io/js/fallback-port)

If multiple applications running same port then you will get the below error `(Error: listen EADDRINUSE)`.

This module will give you an available port and kill other processes.

This module covered **Mac OSX** and **Windows**.

## Install

```
$ npm install fallback-port
```

## API

### getPid

Finding the PID from default port.

return pid number or null.

### getPort

Tries return a random available port if the requested port is taken

### kill

Find and kill process locking port.

## Example

```js

var port = 8080;

var fallbackPort = new FallbackPort(8080);

//return pid number or null
var pid = fallbackPort.getPid();

//return available port
var otherPort = fallbackPort.getPort();

if(otherPort != port){
    console.log( `${port} is taken` )
}

//kill process
fallbackPort.kill();


```




