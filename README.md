# Borked MIDI/SocketIO interactions
This repos is intended to demostrate the crashes I am experiencing when running socket.io alongside the npm midi module.

## Setup

* Clone the repo
* `npm i`
* plug in a midi device
  (this file will attempt to connect to device on port 0. If you need to point it to a different device, edit line 36 in `server.js`)
* `node server.js`
* navigate your browser to `localhost:3312`
* bang on the midi keyboard for a while

Bus Error 10 and Segfault 11 errors occur intermittently:
* After a few dozen to a few minutes worth of midi notes
* When the browser is refreshed

Things that seem to make this behaviour worse, that may be related, and may just be my confusion:
* placing socket.io and midi in separate node modules, rather than accessing them from `server.js`

