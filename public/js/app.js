/**
 * Created by igor on 7/1/14.
 */
var app = angular.module("academyQuest", ['ui.router','ui.bootstrap','ui.ace','xeditable','ngAnimate','akoenig.deckgrid','monospaced.elastic','ngTagsInput','infinite-scroll'/*'btford.markdown'*//*,'hljs'*/]);
app.run(function(editableOptions) {
    'use strict';
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.service('courseEdit',function($http){
    'use strict';
    var courseEditService={};
 return courseEditService;
});
app.service("httpAuth", function($location) {
    return {
        response: function(response) {
            if(response.status == 403) {
                $location.url("/login");
            } else {
                return response;
            }
        }
    };
});


/*app.factory('Users', function($http) {
    return {
        login : function(data) {
            return $http.post('/api/login', data);
        },
        signup : function(data) {
            return $http.post('/api/signup', data);
        },
        userinfo : function() {
            return $http.get('/user');
        }
    };
});

app.constant('Config', {
    tokenName: 'token',
    tokenPrefix: '4Igor'
});

// Add Token as Auth Header
app.config(['$httpProvider', 'Config', function($httpProvider, Config) {
    $httpProvider.interceptors.push(['$q', function($q) {
        return {
            request: function(httpConfig) {
                if (localStorage.getItem([Config.tokenPrefix, Config.tokenName].join('_'))) {
                    httpConfig.headers.Authorization = 'Bearer ' + localStorage.getItem([Config.tokenPrefix, Config.tokenName].join('_'));
                }
                return httpConfig;
            },
            responseError: function(response) {
                if (response.status === 401) {
                    localStorage.removeItem([Config.tokenPrefix, Config.tokenName].join('_'));
                }
                return $q.reject(response);
            }
        };
    }]);
}]);*/


app.factory('Auth', function ($rootScope, $window, Config) {
    return {
        check : function () {
            var token = [Config.tokenPrefix, Config.tokenName].join('_');
            return Boolean($window.localStorage[token]);
        },
        clearToken : function () {
            var token = [Config.tokenPrefix, Config.tokenName].join('_');
            delete $window.localStorage[token];
        },
        setToken : function (data) {
            var token = data[Config.tokenName];
            var namespace = [Config.tokenPrefix, Config.tokenName].join('_');
            $window.localStorage[namespace] = token;
        }
    };
});



app.run(function($rootScope,$location,courseEdit){});


app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
'use strict';

   $httpProvider.interceptors.push("httpAuth");

   $urlRouterProvider.when('/', '/dashboard');
    //$urlRouterProvider.when('/', '/welcome');
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/");

    $stateProvider

        .state('login', {
            url: "/login",
            templateUrl: "views/account/login.html",
            controller:"refreshController"
        })
        .state('forgot', {
            url: "/forgot",
            templateUrl: "views/account/forgot.html",
            controller:"refreshController"
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "views/account/signup.html",
            controller:"refreshController"
        })
        .state('signupadmin', {
            url: "/signup/admin",
            templateUrl: "views/account/signupadmin.html",
            controller:"refreshController"
        })
        .state('post', {
            url: "/post/new",
            templateUrl: "newpost.html",
            controller:"refreshController"
        })
        .state('completeSection', {
            url: "/courses/:courseTitle/:moduleTitle/:sectionTitle/complete",
            templateUrl: "views/courses/completeSection.html",
            controller:"refreshController"
        })
        .state('posts', {
            url: "/post/all",
            templateUrl: "postall.html",
            resolve:{
                promiseUser:  function($http){
                    return $http.get('/user')

                }
            },
            controller:"posts"
        }).state('adminlab', {
            url: "/adminlab",
            templateUrl: "views/adminlab/adminlab.html",
            controller:"refreshController"
        }).state('adminlab.lesson', {
            url: "/courses/:courseTitle",
            templateUrl: "views/adminlab/course.html",
            controller: 'lessonController'
        }).state('adminlab.lesson.module', {
            url: "/main",
            templateUrl: "views/adminlab/coursedesc.html",
            controller:"refreshController"

        }).state('adminlab.lesson.unit', {
            url: "/:moduleTitle/:sectionTitle/:unitTitle",
            templateUrl: "views/adminlab/courseunit.html",
            controller:"refreshController"
        }).state('adminlab.lesson.description', {
            url: "/description",
            templateUrl: "views/adminlab/description.html",
            controller:"refreshController"
        }).state('dashboard', {
            url: "/dashboard",
            resolve:{
                promiseUser:  function($http){
                    return $http.get('/user')

                }
            },
            templateUrl: "views/main/welcome.html",
            controller: 'posts'
        }).state('editprofile', {
            url: "/profile/:username",
            resolve:{
                promiseUser:  function($http){
                    return $http.get('/user')

                }
            },
            templateUrl: "views/account/profile.html",
            controller: 'posts'
        }).state('course', {
            url: "/courses/:courseTitle",
            templateUrl: "views/courses/courseChenged.html",
            onEnter: function(){
                $("body").addClass("withMap");
            },
            onExit: function(){
                $("body").removeClass("withMap");
            },
            controller:"refreshController"
        }).state('courses', {
            url: "/courses",
            templateUrl: "views/courses/courses.html",
            controller:"refreshController"
        }).state('modules', {
            url: "/courses/:courseTitle/:moduleTitle",
            templateUrl: "views/courses/moduleChanged.html",
            controller:"refreshController"
        }).state('modulecomplete', {
            url: "/courses/:courseTitle/:moduleTitle/complete",
            templateUrl: "views/courses/modulecomplete.html",
            controller: 'progress'
        }).state('unit', {
            url: "/courses/:courseTitle/:moduleTitle/:sectionTitle/:unitTitle",
            templateUrl: "views/courses/unitChenged.html",
            controller:"refreshController"

        }).state('refresh', {
            url: "/refresh",
            templateUrl: "views/main/refresh.html"

        }).state('404', {
            url: "/404",
            templateUrl: "404.html"

        });
});
