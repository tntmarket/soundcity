importScripts('/lib/jdataview.js');
importScripts('decoder.js');
importScripts('id3tag.js');

var BATCHSIZE = 50;

self.addEventListener('message', function(msgEvent) {
   var loaded = 0;
   var metadataBatch = [];

   [].forEach.call(msgEvent.data, function(file) {
      var tags = getMetadata(file);

      if(tags) {
         metadataBatch.push(tags);
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

   postMessage({
      metadata: metadataBatch,
      finished: true 
   });
});
