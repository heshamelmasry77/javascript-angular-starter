'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('HomeCtrl', ['$scope', '$routeParams', 'Prismic', function($scope, $routeParams, Prismic) {
		var page = parseInt($routeParams.page) || "1";
		Prismic.ctx().then(function(ctx){
			ctx.api.form('everything').page(page).ref(ctx.ref).submit(function(err, documents){
				if (err) {
					// Should display some kind of error; will just redirect to / for now
					$location.path('/');
				}
				else {
					$scope.documents = documents;
					var aliases = {};
					documents.results.forEach(function(doc){
						var make_model = {
							id: doc.id,
							make: doc.slug,
							is_model: false
						};
						if(undefined !== doc.fragments['model.make']){
							make_model.is_model = true;
							make_model.model = make_model.make;
							make_model.make = doc.fragments['model.make'].value;
						}
						aliases[doc.slug] = make_model;
					});
					$scope.documents = aliases;
					window.localStorage.setItem('aliases', JSON.stringify(aliases));
					// Angular doesn't repeat over collections created on the fly, so we have to create it here
					if (documents.total_pages > 1) $scope.paginationRange = _.range(1, documents.total_pages+1);
				}
			});
		});
	}])
	.controller('MakeCtrl', ['$scope', '$routeParams', 'Prismic', '$location', function($scope, $routeParams, Prismic, $location) {
		var make = $routeParams.make;
		var aliases = JSON.parse(window.localStorage.getItem('aliases'));

		var id = aliases[make].id;

		Prismic.document(id).then(function(document){
			console.log(document.fragments['model.make']);
			if (document.slug === make) {
				Prismic.ctx().then(function(ctx) {
					$scope.documentHtml = document.asHtml(ctx);
				})
			}
			else if (document.slugs.indexOf(make) >= 0) {
				$location.path('/'+document.slug);
			}
			else {
				// Should display some kind of error; will just redirect to / for now
				$location.path('/');
			}
		});
	}])
	.controller('ModelCtrl', ['$scope', '$routeParams', 'Prismic', '$location', function($scope, $routeParams, Prismic, $location) {
		var model = $routeParams.model;
		var aliases = JSON.parse(window.localStorage.getItem('aliases'));

		var id = aliases[model].id;

		Prismic.document(id).then(function(document){
			if (document.slug === model) {
				Prismic.ctx().then(function(ctx) {
					$scope.documentHtml = document.asHtml(ctx);
				})
			}
			else if (document.slugs.indexOf(model) >= 0) {
				$location.path('/'+document.slug);
			}
			else {
				// Should display some kind of error; will just redirect to / for now
				$location.path('/');
			}
		});
	}])
	.controller('SearchCtrl', ['$scope', '$routeParams', 'Prismic', function($scope, $routeParams, Prismic) {
		$scope.searchq = $routeParams.q;
		$scope.q = $routeParams.q;
		var page = parseInt($routeParams.page) || "1";
		Prismic.ctx().then(function(ctx){
			ctx.api.form('everything').query('[[:d = fulltext(document, "'+$routeParams.q+'")]]')
				.page(page).ref(ctx.ref).submit(function(err, documents){
					if (err) {
						// Should display some kind of error; will just redirect to / for now
						$location.path('/');
					}
					else {
						$scope.documents = documents;
						// Angular doesn't repeat over collections created on the fly, so we have to create it here
						if (documents.total_pages > 1) $scope.paginationRange = _.range(1, documents.total_pages+1);
					}
				});
		});
	}]);
