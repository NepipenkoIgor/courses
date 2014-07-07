/**
 * Created by igor on 7/1/14.
 */
var app = angular.module("academy", ['ui.router']);


app.controller('routerController', function ($stateParams, $location, $http, $scope) {

    //function reqSubject() {
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
                                    console.log($scope.subSubjectNow)
                                }
                                //return;
                            }
                            //console.log($scope.trueSubject.subjects[j].subjectName);
                            return;
                        }
                    }
                    return;
                }

            }

        });

    //};
    //reqSubject();

});



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
        })
        .state('post', {
            url: "/post/new",
            templateUrl: "newpost.html"
        })
        .state('posts', {
            url: "/post/all",
            templateUrl: "postall.html"
        }).state('themaSubject', {
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
        });


});
