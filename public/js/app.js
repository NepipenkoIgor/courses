/**
 * Created by igor on 7/1/14.
 */
var app = angular.module("academy", ['ui.router','ui.bootstrap','xeditable']);
app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.service('courseEdit',function($http){
    var courseEditService={};

   /* courseEditService.loadSubjects = function() {
        return $http.get('/subject');
    };*/

   /* courseEditService.loadModule = function() {
        return $http.get('/modulelesson');
    };

   // this.getInventory();*/

  /*  courseEditService.resCourseSubject={};
    courseEditService.resCourseSubject.subjects=[];
    courseEditService.resModuleLessonArray=[];

    courseEditService.cangedCourse=function(name){
            for(var i=0;i<this.loadSubjects.length;i++){
                if(courseEditService.loadSubjects[i].menuName===name){
                    courseEditService.resCourseSubject=this.loadSubjects[i];
                    courseEditService.resModuleLessonArray=this.loadModule;
             }
        }
     };*/

 return courseEditService;
})

/*app.controller('routerController', function ($stateParams, $location, $http, $scope) {

   'use strict'
        $http.get('/subject').success(function (data) {
            $scope.subject = data;
           // console.log("adasd",$scope.subject);

            for (var i = 0; i < $scope.subject.length; i++) {
                //console.log($scope.subject[i].menuName);
                $scope.trueTitle=$scope.subject[i].menuName;
                if ($scope.subject[i].menuName === $stateParams.topic) {
                    $scope.trueSubject = $scope.subject[i];
                    //console.log($scope.trueSubject);
                    for (var j = 0; j < $scope.trueSubject.subjects.length; j++) {
                        //console.log($scope.trueSubject.subjects[j]);
                        if ($scope.trueSubject.subjects[j].subjectName === $stateParams.subject) {
                            $scope.subjectNow = $scope.trueSubject.subjects[j];
                           // $scope.subSubjectNow = $scope.trueSubject.subjects[j].subjectName;

                            for(var d=0;d<$scope.subjectNow.subSubjects.length;d++){
console.log($scope.subjectNow.subSubjects[d]);
                               if($scope.subjectNow.subSubjects[d].subSubjectName===$stateParams.subsubject) {
                                    $scope.subSubjectNow = $scope.subjectNow.subSubjects[d];
                                    console.log($scope.subSubjectNow.specialId);
                                   $http.get('/modulelesson').success(function (data) {
                                          console.log("my data",data);
                                       var resMod=[];
                                     for(var i=0;i<data.length;i++){
                                           if(data[i].parent===$scope.subSubjectNow.specialId){
                                               resMod.push(data[i]);
                                               console.log(resMod);
                                           }
                                       }
                                       $scope.module=resMod;
                                   });
                                }
                            }
                            return;
                        }
                    }
                    return;
                }
            }
        });
});*/



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
            controller: ''
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
        }).state('lesson', {
            url: "/courses/:courseTitle",
            templateUrl: "lesson.html",
            controller: 'lessonController'
        });
});
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
