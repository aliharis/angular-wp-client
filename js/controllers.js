
var blogApp = angular.module('blogApp', ['ngRoute', 'blogControllers', 'ngSanitize']);

blogApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/articles', {
        templateUrl: 'articles.html',
        controller: 'ArticlesController'
      }).
      when('/articles/:slug', {
        templateUrl: 'articles-details.html',
        controller: 'ArticlesDetailsController'
      }).
      otherwise({
        redirectTo: '/articles'
      });

      $locationProvider.html5Mode(true).hashPrefix('!');
  }]);

var blogControllers = angular.module('blogControllers', []);

blogControllers.controller('ArticlesController', function($scope, $http) {
    $http.get('https://public-api.wordpress.com/rest/v1.1/sites/75162937/posts/').success(function(data) {        
        $scope.articles = data["posts"];
        $(".loading-wrap").fadeOut('slow');
    }); 
});

blogControllers.controller('ArticlesDetailsController', ['$scope', '$sce', '$routeParams', '$http',
    function($scope, $sce, $routeParams, $http) {
        $(".loading-wrap").fadeIn('slow');
        $http.get('https://public-api.wordpress.com/rest/v1.1/sites/75162937/posts/slug:' + $routeParams.slug).success(function(data) {
            $scope.article = data;
            $scope.content = $sce.trustAsHtml(data.content);
            $(".loading-wrap").fadeOut('slow');
        });

        $scope.$on('$viewContentLoaded', function(){
          setTimeout(function(){ Prism.highlightAll()  }, 3000);
        });
    }]);

