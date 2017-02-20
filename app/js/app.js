'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'prismic.io',
    'ngSanitize'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/:page?', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    });
    $routeProvider.when('/document/:id/:slug', {
        templateUrl: 'partials/document.html',
        controller: 'DocumentCtrl'
    });
    $routeProvider.when('/search/:q*/:page?', {
        templateUrl: 'partials/search.html',
        controller: 'SearchCtrl'
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]).
config(['PrismicProvider', function(PrismicProvider) {
    PrismicProvider.setApiEndpoint('https://lesbonneschoses.prismic.io/api');
    PrismicProvider.setAccessToken('MC5XSVg1M1NzQUFBcEJPWnhW.Te-_vWVq77-977-977-977-9au-_vXYtJO-_ve-_vRAjcxbvv73vv70w77-977-977-977-9e1hC77-977-977-9');
    PrismicProvider.setClientId('WIX53SsAALA-OZxU');
    PrismicProvider.setClientSecret('af67dbe3fdd578488b0e78e05e136783');
    PrismicProvider.setLinkResolver(function(ctx, doc) {
        return '#/document/' + doc.id + '/' + doc.slug + ctx.maybeRefParam;
    });
}]);
