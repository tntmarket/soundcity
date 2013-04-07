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
            swfPath: '/app/lib/jplayer/jplayer.swf',
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
      var metadataProcessor = new Worker('/app/js/metadataProcessor.js');
      $scope.totalSongs = mp3s.length;
      $scope.loadedSongs = 0;
      metadataProcessor.onmessage = function(msgEvent) {
         $scope.$apply(function() {
            $rootScope.SONGS = $rootScope.SONGS.concat(msgEvent.data.metadata);
            if(msgEvent.data.finished) {
               metadataProcessor.terminate();
               $scope.resetBar();
               $location.path('/playing');
            } else {
               $scope.loadedSongs = msgEvent.data.loaded;
               $scope.loadBarStyle.width = $scope.loadProgress() + '%';
            }
         });
      };
      metadataProcessor.postMessage(mp3s);
   };

   $scope.resetBar = function() {
      $scope.loadBarStyle = {
         width: '0%'
      },
      $scope.loadedSongs = -1;
      $scope.totalSongs = -1;
   };

   $scope.busy = function() {
      return $scope.loadedSongs < $scope.totalSongs;
   };

   if(!$scope.loadedSongs) {
      $scope.resetBar();
   }

   $scope.loadProgress = function() {
      return (100 * $scope.loadedSongs / $scope.totalSongs); 
   };
}

function PlayingCtrl($rootScope, $scope, $location) {
   $scope.playSong = function(song) {
      $rootScope.SETSONG(song);
      $rootScope.PLAY();
   };
}

var reader = new FileReader();
function readFile(file) {
   reader.readAsArrayBuffer(file);
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
