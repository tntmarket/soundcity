function MainCtrl($rootScope, $scope) {
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

function PlayingCtrl($rootScope, $scope, $filter) {
   $scope.fileExtension = function(filename) {
      if( filename.indexOf('.') > -1 ) {
         return filename.split('.').pop();
      } else {
         return '';
      }
   };

   $scope.isValidMp3 = function(file) {
      var size = file.size || file.fileSize || 4096;
      return (size > 4095) && ($scope.fileExtension(file.name) === 'mp3');
   };

   $scope.getMetadata = function(files) {
      $.each(files, function(index, file) {
         var reader = new FileReader();

         reader.onload = function(e) {
            var responseText = this.result;
            var dv = new jDataView(responseText);

            if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
               $scope.$apply(function() {
                  $scope.songs.push({
                     name: dv.getString(30, dv.tell()),
                     artist: dv.getString(30, dv.tell()),
                     album: dv.getString(30, dv.tell()),
                     year: dv.getString(4, dv.tell()),
                     file: file
                  });
               });
            }
         };

         reader.readAsArrayBuffer(file);
      });
   };

   $scope.songs = [];

   $scope.uploadSongs = function() {
      $scope.files = $filter('filter')($scope.files, $scope.isValidMp3);
      $scope.getMetadata($scope.files);
   };

   $scope.playSong = function(song) {
      $rootScope.SETSONG(song);
      $rootScope.PLAY();
   };
}

function SongRowCtrl($scope) {
   $scope.song = $routeParams.id;
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
