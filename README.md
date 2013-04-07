Sound City
==========

A web music player. Currently only supporting chrome.

Requirements
------------

- play music from local filesystem without uploading to server
- save metadata of local music to avoid uploading every session
   - cookies, localStorage, localDatabase or filesystem API?
- sync local songs to server
- sync server songs to local filesystem

Depends On
----------

### Libraries
- angularjs
- jquery
   - twitter bootstrap
   - jplayer 
      - snappy light skin
- jdataview

### Browser features
- directory upload
- createFileURL
- html5 audio or flash

How to Run
----------
in root directory:
    
    ./scripts/webserver.js

Then navigate to http://localhost:8000/app/index.html

How to Test 
-----------

###Unit tests:
in root directory:

    cd soundcity
    ./scripts/test.sh

###End to end tests:
in root directory:

    ./scripts/e2e-test.sh
