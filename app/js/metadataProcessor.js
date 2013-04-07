importScripts('/app/lib/jdataview.js');

var BATCHSIZE = 1;

self.addEventListener('message', function(msgEvent) {
   var loaded = 0;
   var metadataBatch = [];

   [].forEach.call(msgEvent.data, function(file) {
      var reader = new FileReaderSync();
      var mp3Data = new jDataView(reader.readAsArrayBuffer(file));

      if (mp3Data.getString(3, mp3Data.byteLength - 128) == 'TAG') {
         metadataBatch.push({
            name: mp3Data.getString(30, mp3Data.tell()),
            artist: mp3Data.getString(30, mp3Data.tell()),
            album: mp3Data.getString(30, mp3Data.tell()),
            year: mp3Data.getString(4, mp3Data.tell()),
            file: file
         });

         if(metadataBatch.length === BATCHSIZE) {
            loaded += BATCHSIZE;
            postMessage({
               metadata: metadataBatch,
               loaded: loaded 
            });
            metadataBatch = [];
         }
      }
   });

   loaded += metadataBatch.length;
   postMessage({
      metadata: metadataBatch,
      finished: true 
   });
});
