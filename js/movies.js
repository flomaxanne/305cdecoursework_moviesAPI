/*global angular  */

/* we 'inject' the ngRoute module into our app. This makes the routing functionality to be available to our app. */
var myApp = angular.module('myApp', ['ngRoute']) 

/* the config function takes an array. 1ST PART:DEFINE THE ROUTE */
myApp.config( ['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/home', {
		  templateUrl: 'pages/home.html',
      controller: 'homeController'
		})
    .when('/search', {
		  templateUrl: 'pages/search.html',
      controller: 'searchController'
		})
    .when('/details/:id', {
      templateUrl: 'pages/details.html',
      controller: 'detailController'
    })
    .when('/favourites', {
		  templateUrl: 'pages/favourites.html',
      controller: 'favouritesController'
		})
		.otherwise({
		  redirectTo: 'home'
		})
	}])



// defining popular movie list controller
myApp.controller('homeController', ['$scope', '$http',
    function ($scope, $http) {
      var apiKey = '968cca12b1a8492036b1e1e05af57e3f';
      var popularMoviesEndpoint = "https://api.themoviedb.org/3/movie/popular";
      var page = 0;
      $scope.movies = [];
      // creating a function for getting the movie list. we use this function when loading next page is needed
      $scope.getMovieList = function () {

        var url = popularMoviesEndpoint + '?page=' + ++page + '&api_key=' + apiKey; // generating the url

        $http({method: 'GET', url: url}).
          success(function (data, status, headers, config) {

            if (status == 200) {
              console.log("List of popular movies successfully retrieved!")
              page = data.page;                                             // saving current page for pagination
              $scope.movies.push.apply($scope.movies, data.results)   // appending new movies to current list
            } else {
              console.error('Error happened while getting the movie list.')
            }

          }).
          error(function (data, status, headers, config) {
            console.error('Error happened while getting the movie list.')
          });
      }

      $scope.getMovieList();    // calling the function when script is loaded for the first time

    }]
);

myApp.controller('searchController', function($scope, $http) {
  $scope.$watch('search', function() {
      fetch();
    });

   $scope.search = "Chronicles of Narnia";
   
    function fetch() {
      var APIkey = "f6ee4864";
      $http.get("https://www.omdbapi.com/?t="+$scope.search+"&tomatoes=true&plot=full&apikey="+APIkey)
        .then(function(response) {
          console.log("Successfully found movie")
          $scope.movies = response.data;
        });

      $http.get("https://www.omdbapi.com/?s="+$scope.search+"&apikey="+APIkey)
        .then(function(response) {
          console.log("Successfully found movie")
          $scope.related = response.data;
        });
    }

    $scope.update = function(movie) {
      $scope.search = movie.Title;
    };

 
    
  });
  
  
myApp.controller('detailController', function($scope, $routeParams, $http) {
  $scope.message = 'This is the detail screen'
  $scope.id = $routeParams.id

  var url = 'https://api.themoviedb.org/3/movie/'+ $scope.id +'?api_key=db58fe42fc0fd2358a12083bff10441a' 
  $http.get(url).success(function(rspMovie) {
    console.log("Found movie" + $scope.id)
    $scope.movies = {}
    $scope.movies.title = rspMovie.title
    $scope.movies.overview = rspMovie.overview
    $scope.movies.budget = rspMovie.budget
    $scope.movies.overview = rspMovie.overview
    $scope.movies.homepage= rspMovie.homepage
    $scope.movies.poster_path = rspMovie.poster_path
    $scope.movies.release_date= rspMovie.release_date
    $scope.movies.revenue= rspMovie.revenue
    $scope.movies.tagline= rspMovie.tagline
    $scope.movies.status= rspMovie.status
    $scope.movies.runtime= rspMovie.runtime
   
  })

  $scope.addToFavourites = function(title, overview) {
    console.log('Adding: '+ title+' to favourites.')
    localStorage.setItem(title, overview)
    alert("Added "+title+" to favourites!")
  }
})

myApp.controller('favouritesController', function($scope) {
  console.log('Favourites controller')
  var init = function() {
    console.log('getting movies')
    var items = new Array();	
    for(var i = 0; i < localStorage.length; i++) {
    	var key = localStorage.key(i);	
    	var obj = {};
    	items.push({title: key, overview:localStorage.getItem(key)})  
    }
    console.log(items)
    $scope.movies = items
  }
  init()

   $scope.delete = function(title) {
  	localStorage.removeItem(title)
  	 init();
  	  alert("Removed "+title+" from favourites!")
    console.log('Deleting movie: '+title)
  }
  
  $scope.deleteAll = function()
  { 
    localStorage.clear();
    init();
     alert("Cleared entire favourites list")
   console.log('Deleted entire favourites list')
    
  }
})


