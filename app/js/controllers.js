function MainCtrl($scope) {
   $scope.InitJPlayer = function() {
      $(document).ready(function(){
         $("#jplayer").jPlayer({
            ready: function(){
               $(this).jPlayer('setMedia', {
                  mp3: '/music/Madoka%20Magica/Madoka%20Kaname%20-%20See%20You%20Tomorrow.mp3'
               });
            },
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

function PlayingCtrl($scope, $http) {
   $http.get('/app/data/songs.json').success(function(data) {
      $scope.songs = data;
   });

   $scope.uploadSongs = function() {
      console.log('shitshitshit');
      console.log($scope.files);
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
