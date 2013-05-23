function MainCtrl($rootScope, $scope) {
   $rootScope.SONGS = [];

   $rootScope.SETSONG = function(song) {
      if(!song.file) {
         throw 'SETSONG assumes a valid song param';
      }

      $rootScope.PLAYING = song;

      if($rootScope.PLAYING) {
         $rootScope.STOP();
         URL.revokeObjectURL($rootScope.PLAYING.url);
      }

      song.url = URL.createObjectURL(song.file);
      $scope.PLAYER.jPlayer('setMedia', {
         mp3: song.url
      });

   };

   $rootScope.PLAY = function() {
      $scope.PLAYER.jPlayer('play');
   };

   $rootScope.STOP = function() {
      $scope.PLAYER.jPlayer('stop');
   };

   $scope.InitJPlayer = function() {
      $(document).ready(function(){
         $scope.PLAYER = $("#jplayer").jPlayer({
            volume: '0.5',
            swfPath: 'lib/jplayer/jplayer.swf',
            cssSelectorAncestor: '.player-container',
            supplied: 'mp3',
            currentTime: '.jp-current-time'
         });

         $('.jp-progress-container').hover(function(){
            var current_time = $(this).find('.jp-current-time');
            current_time.stop().show().animate({opacity: 1}, 300);
         }, function(){
            var current_time = $(this).find('.jp-current-time');
            current_time.stop().animate({opacity: 0}, 150, function(){ 
               jQuery(this).hide();
            });
         });
      });
   };
}

function AddSongsCtrl($rootScope, $scope, $filter, $location) {

   if(!$rootScope.AddSongs) {
      $rootScope.AddSongs = {
         loadedSongs: -1,
         totalSongs: -1
      };
   }

   $scope.fileExtension = function(filename) {
      if( filename.indexOf('.') > -1 ) {
         return filename.split('.').pop();
      } else {
         return '';
      }
   };

   $scope.isMp3 = function(file) {
      var size = file.size || file.fileSize || 4096;
      return (size > 4095) && ($scope.fileExtension(file.name) === 'mp3');
   };


   $scope.handleFileUpload = function(files) {
      var mp3s = $filter('filter')(files, $scope.isMp3);
      var metadataProcessor = new Worker('/AddSongs/metadataProcessor.js');
      $rootScope.AddSongs = {
         loadedSongs: 0,
         totalSongs: mp3s.length
      };
      metadataProcessor.onmessage = function(msgEvent) {
         $scope.$apply(function() {
            $rootScope.SONGS = $rootScope.SONGS.concat(msgEvent.data.metadata);
            if(msgEvent.data.finished) {
               metadataProcessor.terminate();
               $scope.reset();
            } else {
               $rootScope.AddSongs.loadedSongs = msgEvent.data.loaded;
            }
         });
      };
      metadataProcessor.postMessage(mp3s);
   };

   $scope.reset = function() {
      $rootScope.AddSongs = {
         loadedSongs: -1,
         totalSongs: -1
      };
   };

   $scope.loadBarStyle = function() {
      return {
         width: $scope.loadProgress() + '%'
      };
   };

   $scope.busy = function() {
      return $rootScope.AddSongs.loadedSongs < $rootScope.AddSongs.totalSongs;
   };

   $scope.loadProgress = function() {
      return (100 * $rootScope.AddSongs.loadedSongs / 
              $rootScope.AddSongs.totalSongs); 
   };
}

function PlaylistCtrl($rootScope, $scope, $location) {
   $scope.playSong = function(song) {
      $rootScope.SETSONG(song);
      $rootScope.PLAY();
   };
}

function SongCtrl($scope, $routeParams) {
   $scope.id = $routeParams.id;
}

function ArtistCtrl($scope, $routeParams) {
   $scope.id = $routeParams.id;
}

function AlbumCtrl($scope, $routeParams) {
   $scope.id = $routeParams.id;
}

function MyMusicCtrl($scope) {
}
