importScripts('/app/lib/jdataview.js');

var BATCHSIZE = 100;

self.addEventListener('message', function(msgEvent) {
   var loaded = 0;
   var metadataBatch = [];

   [].forEach.call(msgEvent.data, function(file) {
      var reader = new FileReaderSync();
      var last128Bytes = reader.readAsArrayBuffer(file.slice(-128));
      var mp3Data = new jDataView(last128Bytes);

      if (mp3Data.getString(3) == 'TAG') {
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
