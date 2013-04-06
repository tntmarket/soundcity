Sound City
==========

A html5 music player

Requirements
------------

- play music from local filesystem without upload
- save local songs to server
- cache server songs on local filesystem
- remember music from local filesystem without uploading every session

Depends On
----------

- angularjs
- jquery
   - twitter bootstrap
   - jplayer 
      - snappy light skin

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
