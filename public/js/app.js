/**
 * Created by igor on 7/1/14.
 */
var app = angular.module("academy", ['ui.router','ui.bootstrap','ui.ace','xeditable']);
app.run(function(editableOptions) {
    'use strict';
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.service('courseEdit',function($http){
    'use strict';
    var courseEditService={};
 return courseEditService;
});


app.run(function($rootScope,$location,courseEdit){
   /* $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
           if(toState.name==="unit"){
                for(var i=0;i<courseEdit.listOfUnits.length;i++){
                    if(toParams.unitTitle===courseEdit.listOfUnits[i]){

                    }
                }
               console.log("courseEdit.listOfUnits",courseEdit.listOfUnits);
                console.log("RuncourseEdit.unitNowChanged",courseEdit.unitNowChanged)
               // courseEdit.unitNowChange(toParams.unitTitle)
            }
            //console.log("toState",toState.resolve.simpleObj());
            //console.log("toParams",toParams);
            //console.log("fromState",fromState);
            //console.log("fromParams",fromParams);
            // console.log("$location",$location);
            //console.log(toState);
            courseEdit.course={};
            //console.log(courseEdit.unitNowChange);
        })*/
});


app.config(function ($stateProvider, $urlRouterProvider) {
'use strict';
   $urlRouterProvider.when('/', '/welcome');
    //$urlRouterProvider.when('/', '/welcome');
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('editprofile', {
            url: "/editprofile",
            templateUrl: "views/account/profile.html",
            controller: 'profile'
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/account/login.html"
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "views/account/signup.html"
        })
        .state('signupadmin', {
            url: "/signup/admin",
            templateUrl: "views/account/signupadmin.html"
        })
        .state('post', {
            url: "/post/new",
            templateUrl: "newpost.html"
        })
        .state('posts', {
            url: "/post/all",
            templateUrl: "postall.html"
        }).state('adminlab', {
            url: "/adminlab",
            templateUrl: "views/adminlab/adminlab.html"
        }).state('adminlab.lesson', {
            url: "/courses/:courseTitle",
            templateUrl: "views/adminlab/course.html",
            controller: 'lessonController'
        }).state('adminlab.lesson.module', {
            url: "/main",
            templateUrl: "views/adminlab/coursedesc.html"

        }).state('adminlab.lesson.unit', {
            url: "/:moduleTitle/:sectionTitle/:unitTitle",
            templateUrl: "views/adminlab/courseunit.html"
        }).state('welcome', {
            url: "/welcome",
            templateUrl: "views/main/welcome.html",
            controller: ''
        }).state('course', {
            url: "/courses/:courseTitle",
            templateUrl: "views/courses/courseChenged.html",
            controller: ''
        }).state('module', {
            url: "/courses/:courseTitle/:moduleTitle",
            templateUrl: "views/courses/moduleChenged.html"

        }).state('unit', {
            url: "/courses/:courseTitle/:moduleTitle/:sectionTitle/:unitTitle",
            templateUrl: "views/courses/unitChenged.html"

        });
});

