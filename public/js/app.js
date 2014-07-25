/**
 * Created by igor on 7/1/14.
 */
var app = angular.module("academy", ['ui.router','ui.bootstrap','ui.ace','xeditable']);
app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.service('courseEdit',function($http){
    var courseEditService={};

 return courseEditService;
})


app.run(function($rootScope,$location,courseEdit){
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
           if(toState.name==="unit"){
               /* for(var i=0;i<courseEdit.listOfUnits.length;i++){
                    if(toParams.unitTitle===courseEdit.listOfUnits[i]){

                    }
                }*/
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
        })
})


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
        .state('login', {
            url: "/login",
            templateUrl: "login.html"
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "signup.html"
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
            templateUrl: "adminlab.html"
        }).state('adminlab.lesson', {
            url: "/courses/:courseTitle",
            templateUrl: "course.html",
            controller: 'lessonController'
        }).state('adminlab.lesson.module', {
            url: "/main",
            templateUrl: "coursedesc.html"

        }).state('adminlab.lesson.unit', {
            url: "/:moduleTitle/:sectionTitle/:unitTitle",
            templateUrl: "courseunit.html"
        }).state('welcome', {
            url: "/welcome",
            templateUrl: "welcome.html",
            controller: ''
        }).state('course', {
            url: "/courses/:courseTitle",
            templateUrl: "courseChenged.html",
            controller: ''
        }).state('module', {
            url: "/courses/:courseTitle/:moduleTitle",
            templateUrl: "moduleChenged.html"

        }).state('unit', {
            url: "/courses/:courseTitle/:moduleTitle/:sectionTitle/:unitTitle",
            templateUrl: "unitChenged.html"
        });
});
/*




 */
/*.state('themaSubject', {
 url: "/:topic/:subject",
 templateUrl: "topicSubject.html",
 controller: 'routerController'
 }).state('themaTop', {
 url: "/:topic",
 templateUrl: "topic.html",
 controller: 'routerController'
 }).state('subSubject', {
 url: "/:topic/:subject/:subsubject",
 templateUrl: "subSubject.html",
 controller: 'routerController'
 })*

 /*.state('editcourses', {
 url: "/coursesedit",
 templateUrl: "editcourses.html",
 controller: 'editcourses'
 }).state('coursesedition', {
 url: "/courses/edition",
 templateUrl: "coursesedition.html",
 controller: 'courseEdition'
 }).state('subjectedition', {
 url: "/courses/edition/:course",
 templateUrl: "subjectedition.html",
 controller: 'courseEdition'
 }).state('subSubjectedition', {
 url: "/courses/edition/:course/:subject",
 templateUrl: "subSubjectedition.html",
 controller: 'courseEdition'
 }).state('moduleedition', {
 url: "/courses/edition/:course/:subject/:subSubject",
 templateUrl: "moduleedition.html",
 controller: 'courseEdition'
 }).state('stepedition', {
 url: "/courses/edition/:course/:subject/:subSubject/:module",
 templateUrl: "stepedition.html",
 controller: 'courseEdition'
 })*/
