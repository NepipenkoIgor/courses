/**
 * Created by igor on 7/1/14.
 */
var app = angular.module("academy", ['ui.router']);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/', '/welcome');
    //$urlRouterProvider.when('/', '/welcome');
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('editprofile', {
            url: "/editprofile",
            templateUrl: "profile.html",
            controller: 'profile'
        })
        .state('welcome', {
            url: "/welcome",
            templateUrl: "welcome.html",
            controller: 'maintab'
        })
        .state('login', {
            url: "/login",
            templateUrl: "login.html"
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "signup.html"
        });
});