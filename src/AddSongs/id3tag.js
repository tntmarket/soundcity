var ID2ATTR = {
   TT2: 'name',
   TP1: 'artist',
   TAL: 'album',
   TCO: 'genre',
   TYE: 'year',
   TRK: 'track',
   TLE: 'time',

   TIT2: 'name',
   TPE1: 'artist',
   TPE2: 'artist',
   TALB: 'album',
   TCON: 'genre',
   TYER: 'year',
   TDRC: 'year',
   TRCK: 'track',
   TLEN: 'time'
};

var defaultAttributes = ['name','artist','album'];
var maxFramesToLook = 30;
function isPadding(frameId) {
   return frameId.charCodeAt(0) === 0;
}

function EndOfTag() {}
EndOfTag.prototype = new Error();

function HasNoTags() {}
HasNoTags.prototype = new Error();

//keeps track of which attributes have been found
function toMap(attributes) {
   var map = {};
   for( var i = 0 ; i < attributes.length ; i++ ) {
      map[attributes[i]] = true;
   }
   return map;
}

function getMetadata(file, attributes) {
   var tag = new ID3Tag(file);
   var unfoundAttributes = toMap(attributes || defaultAttributes);
   var metadata = {
      file: file
   };

   try {
      for( var i = 0 ; i < maxFramesToLook && 
                       Object.keys(unfoundAttributes).length ; i++ ) {

         var frameId = tag.frameHeader();
         if(isPadding(frameId)) {
            break;
         }

         var attributeName = ID2ATTR[frameId];

         if(attributeName) {
            metadata[attributeName] = tag.frameContent();
            delete unfoundAttributes[attributeName];
         } else {
            tag.skip();
         }
      }
   } catch (e) {
      if(e instanceof EndOfTag) {
         return metadata;
      } else {
         throw e;
      }
   }

   return metadata;
}






function ID3Tag(file) {
   this.file = file;
   this.currentOffset = 0;

   var header = this.chunk(10);

   if(header.getString(3) !== 'ID3') {
      throw new HasNoTags();
   }

   this.version = header.getBytes(2, header.tell())[0],
   this.flags = header.getBytes(1, header.tell())[0],
   this.size = unsync(header.getBytes(4, header.tell()));
   this.frameHeader = this['frameHeaderV'+this.version];
}

ID3Tag.prototype = {

   frameHeader: function() {
      throw 'WTF? call header before frameHeader pls'; 
   },
   frameHeaderV2: function() {
      var header = this.chunk(6);

      var id = header.getString(3),
      size = Uint24(header.getBytes(3, header.tell()));

      this.id = id;
      this.frameSize = size;

      return id;
   },

   frameHeaderV3: function() {
      var header = this.chunk(10);

      var id = header.getString(4),
      size = unsync(header.getBytes(4, header.tell())), 
      flags = header.getBytes(2, header.tell());

      this.id = id;
      this.frameSize = size;
      this.flags = flags;

      return id;
   },
   
   frameHeaderV4: function() {
      return this.frameHeaderV3();
   },

   frameContent: function() {
      var content = this.chunk(this.frameSize);

      var encoding = content.getBytes(1, content.tell())[0];

      contentString = decode(
         content.getString(this.frameSize - 1, content.tell()),
         encoding
      );

      this.frameSize = -1;

      return contentString;
   },

   reader: new FileReaderSync(),

   chunk: function(size) {
      var endOffset = this.currentOffset + size;

      if(endOffset > this.size) {
         throw new EndOfTag();
      }

      var chunk = new jDataView(
         this.reader.readAsArrayBuffer(
            this.file.slice( this.currentOffset, endOffset)),
            0,
            size,
            true
      );
      this.currentOffset = endOffset;

      return chunk;
   },

   skip: function() {
      if(this.frameSize < 0) {
         throw 'WTF? you can only skip frameContent'; 
      }
      this.currentOffset += this.frameSize;
   }
};
