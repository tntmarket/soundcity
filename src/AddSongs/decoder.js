var ENCODING = ['ISO-8859-1','UTF-16','UTF-16BE','UTF-8'];

function decode(s, encoding) {
   switch(encoding) {
      case 0:
         return s;
      case 1:
         return decodeUTF16(s);
      case 2:
         return decodeUTF16noBOM(s);
      case 3:
         return decodeUTF8(s);
   }
}

function decodeUTF8(s) {
   return decodeURIComponent(escape(s));
}

function decodeUTF16(s) {
   return s.substring(2);
}

function decodeUTF16noBOM(s) {
   return s;
}

function Uint24(byteArray) {
   return byteArray[0] << 18 |
      byteArray[1] << 8 |
      byteArray[2];
}

function unsync(syncSafeInt) {
   return syncSafeInt[0] << 21 |
      syncSafeInt[1] << 14 |
      syncSafeInt[2] << 7  |
      syncSafeInt[3];
}
