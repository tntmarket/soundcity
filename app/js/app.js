angular.module('file', []).
   directive('fileUpload', function() {

   return {
      restrict: 'E',
      template: '<input id="song-upload" type="file"'+
                'webkitdirectory directory multiple mozdirectory>',
      link: function(scope, el, attr, controller) {
         $('#song-upload').change(function(e) {
            if(attr.ngModel) {
               scope[attr.ngModel] = e.target.files;
            }
            scope.$eval(attr.ngChange);
         });
      }
   };
});

angular.module('soundCity', ['file']).
   config(['$routeProvider', function($routeProvider) {

   $routeProvider.
   when('/playing', {
      templateUrl: 'partials/playing.html',
      controller: PlayingCtrl
   }).
   when('/mymusic', {
      templateUrl: 'partials/mymusic.html',
      controller: MyMusicCtrl
   }).
   when('/song/:id', {
      templateUrl: 'partials/song.html',
      controller: SongCtrl
   }).
   when('/artist/:id', {
      templateUrl: 'partials/artist.html',
      controller: ArtistCtrl
   }).
   when('/album/:id', {
      templateUrl: 'partials/album.html',
      controller: AlbumCtrl 
   });
}]);
