function parseFile(file, callback){
   if(localStorage[file.name]) {
      return callback(JSON.parse(localStorage[file.name]));
   }
   ID3v2.parseFile(file,function(tags){
      //to not overflow localstorage
      localStorage[file.name] = JSON.stringify({
         Title: tags.Title,
         Artist: tags.Artist,
         Album: tags.Album,
         Genre: tags.Genre
      });
      callback(tags);
   });
}

function runSearch(query){
   console.log(query);
   var regex = new RegExp(query.trim().replace(/\s+/g, '.*'), 'ig');
   for(var i = $('songtable').getElementsByTagName('tr'), 
       l = i.length; l--;){
      if(regex.test(i[l].innerHTML)){
         i[l].className = 'visible';
      }else{
         i[l].className = 'hidden';
      }
   }
}

function canPlay(type){
   var a = document.createElement('audio');
   return !!(a.canPlayType && a.canPlayType(type).replace(/no/, ''));
}

function $(id){
   return document.getElementById(id);
}

function getSongs(files){
   $("mask").style.display = 'none';
   $("startup").style.display = 'none';
   var queue = [];
   var mp3 = canPlay('audio/mpeg;'), 
       ogg = canPlay('audio/ogg; codecs="vorbis"');

   for(var i = 0; i < files.length; i++){
      var file = files[i];

      var path = file.webkitRelativePath || file.mozFullPath || file.name;
      if (path.indexOf('.AppleDouble') != -1) {
         // Meta-data folder on Apple file systems, skip
         continue;
      }         
      var size = file.size || file.fileSize || 4096;
      if(size < 4095) { 
         // Most probably not a real MP3
         console.log(path);
         continue;
      }

      if(file.name.indexOf('mp3') != -1){ //only does mp3 for now
         if(mp3){
            queue.push(file);
         }
      }
      if(file.name.indexOf('ogg') != -1 ||
         file.name.indexOf('oga') != -1){
         if(ogg){
            queue.push(file);
         }
      }
   }

   var process = function(){
      if(queue.length){

         var f = queue.shift();
         parseFile(f,function(tags){
            console.log(tags);
            var tr = document.createElement('tr');
            var t2 = guessSong(f.webkitRelativePath || f.mozFullPath ||
                               f.name); 
            //it should be innerText/contentText but its annoying.
            var td = document.createElement('td');
            td.innerHTML = tags.Title || t2.Title;
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = tags.Artist || t2.Artist;
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = tags.Album || t2.Album;
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = tags.Genre || "";
            tr.appendChild(td);
            tr.onclick = function(){
               var pl = document.createElement('tr');
               var st = document.createElement('td');
               st.innerHTML = tags.Title || t2.Title;
               pl.appendChild(st);
               $("playtable").appendChild(pl);
               pl.file = f;
               pl.className = 'visible';
               pl.onclick = function(e){
                  if(e && e.button == 1){
                     pl.parentNode.removeChild(pl);
                  }else{
                     var url;
                     if(window.createObjectURL){
                        url = window.createObjectURL(f);
                     }else if(window.createBlobURL){
                        url = window.createBlobURL(f);
                     }else if(window.URL && window.URL.createObjectURL){
                        url = window.URL.createObjectURL(f);
                     }else if(window.webkitURL && 
                              window.webkitURL.createObjectURL){
                        url = window.webkitURL.createObjectURL(f);
                     }

                     $("player").src = url;
                     $("player").play();
                     for(var i = document.querySelectorAll('.playing'),
                         l = i.length; l--;){
                            i[l].className = '';
                         }
                         pl.className += ' playing';
                         currentSong = pl;
                  }
               };
               if($("playtable").childNodes.length == 1) pl.onclick();
            };
            $('songtable').appendChild(tr);
            process();
         });
         var lq = queue.length;
         setTimeout(function(){
            if(queue.length == lq){
               process();
            }
         },300);
      }
   };
   process();

   console.log(files);
}

var currentSong = 0;

function nextSong(){
   try{
      currentSong.nextSibling.onclick(); 
   }catch(e){
      currentSong = document.querySelector("#playtable tr");
      currentSong.onclick();
   }
}

function shuffle(){
   var pt = document.getElementById('playtable');
   //fisher yates shuffle. hopefully.
   for(var i = document.querySelectorAll("#playtable tr"), l = i.length;  l--;){
      var j = Math.floor(Math.random() * l);
      var jel = i[j], iel = i[l];
      var jref = jel.nextSibling, iref = iel.nextSibling;
      pt.insertBefore(jel, iref);
      pt.insertBefore(iel, jref);
   }
}

function empty(){
   var pt = document.getElementById('playtable');
   pt.innerHTML = '';
}

onload = function(){
   // with no dependencies, it should be
   //fine to use this instead of ondomcontentloaded
   var a = document.createElement('audio');
   if(!a.canPlayType) $("support").innerHTML += 
         "Your browser does not support HTML5 Audio<br>";
   if(!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').
        replace(/no/, ''))) 
   $("support").innerHTML += 
      "Your browser does not support Ogg Vorbis Playback<br>";
   if(!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))) 
   $("support").innerHTML += "Your browser does not support MP3 Playback<br>";
   var f = document.createElement('input');
   f.type = 'file';
   if(!('multiple' in f)) $("support").innerHTML += 
         "Your browser does not support selecting multiple files<br>";
   if(!('webkitdirectory' in f)) $("support").innerHTML += 
         "Your browser probably does not support selecting directories<br>";
   if(window.createObjectURL){
   }else if(window.createBlobURL){
   }else if(window.URL && window.URL.createObjectURL){
   }else if(window.webkitURL && window.webkitURL.createObjectURL){
   }else{
      $("support").innerHTML +=
         "Your browser probably does not support Object URLs<br>";
   }

   document.querySelector('#search input').onkeydown = function(e){
      if(e.keyCode == 13){
         for(var i = document.querySelectorAll('#songtable tr.visible'),
             l = i.length; l--;){
            i[l].onclick();
         }
      }
   };
};
