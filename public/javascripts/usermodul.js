/*
 * Created by Игорь on 19.06.2014.
 */

var app = angular.module("academy", ['ui.router']);

app.controller('profile', function ($scope, $http) {
    'user strict';
    var self = this;

    $http.get('/user').success(function (data) {
        if (!data.username) {
            data.username = 'guest';
        }

        console.log(data.username);
        if (!data.firstname) {
            data.firstname = '';
        }
        if (!data.lastname) {
            data.lastname = '';
        }
        if (!data.phone) {
            data.phone = '';
        }

        $scope.userdata = data;
        if(typeof $scope.userdata==='string'){
            $scope.userdata=false;
        }
        console.log($scope.userdata);
    });

    $scope.postProfile = function (data) {

        $http.post('/main', data).success(function (data) {
            console.log("my callback data =", data.data);
            console.log("good request");
        });

    };
  /*  this.flag = false;

    this.editProfile = function () {
        console.log(this.flag);
        if (this.flag === false) {
            this.flag = true;
            return;
        }
        this.flag = false;

    };*/

});


app.controller('maintab', function () {
    'user strict';

    this.tab = 1;

    this.menus = [
        {
            num: 1,
            menuName: 'Math',
            color: {
                'background-color': 'olive'
            },
            subjects: [
                "Math1",
                "Math2",
                "Math3"
            ]
        },
        {
            num: 2,
            menuName: 'Science',
            color: {
                'background-color': 'green'
            },
            subjects: [
                "Science1",
                "Science2",
                "Science3"
            ]

        },
        {
            num: 3,
            menuName: 'Humanties',
            color: {
                'background-color': 'teal'
            },
            subjects: [
                "Humanties1",
                "Humanties2",
                "Humanties3"
            ]

        },
        {
            num: 4,
            menuName: 'Economics and Finance',
            color: {
                'background-color': 'grey'
            },
            subjects: [
                "Economics and Finance1",
                "Economics and Finance2",
                "Economics and Finance3"
            ]

        },
        {
            num: 5,
            menuName: 'Computing',
            color: {
                'background-color': 'gold'
            },
            subjects: [
                "Computing1",
                "Computing2",
                "Computing3"
            ]

        }

    ]
var vertical=this.menus.length*90+'px';
    this.tabheight={height:vertical};
    console.log(this.tabheight);

    this.showTab = function (num) {
        this.tab = num;
        this.changTabColor = this.menus[num - 1].color['background-color'];
    };

    this.activeTab = function (num) {
        if (num === this.tab) {
            return true;
        }
        ;
        return false;
    };

    /* this.classActive=function(num){
     if(num===this.tab){
     return "active";
     };
     return;
     };*/
    this.colorTab = this.menus[0].color['background-color'];
    this.changTabColor = this.menus[0].color['background-color'];
    this.hover = function (color) {
        if (color) {
            this.colorTab = color;
            return;
        }
        this.colorTab = 'ghostwhite';

    };
    this.color = function (color1, color2, color3) {
        if (color2 === color3) {
            return {'background-color': color2};
        }
        ;
        if (color1 === color2) {

            return {'background-color': color1};
        }
        ;
        return {'background-color': 'ghostwhite'};
    };


});

app.controller('mainMenu', function () {

    this.menus = [
        {
            menuName: 'Math',
            color: {
                'background-color': 'olive'
            },
            subjects: [
                "Math1",
                "Math2",
                "Math3"
            ]
        },
        {
            menuName: 'Science',
            color: {
                'background-color': 'green'
            },
            subjects: [
                "Science1",
                "Science2",
                "Science3"
            ]

        },
        {
            menuName: 'Humanties',
            color: {
                'background-color': 'teal'
            },
            subjects: [
                "Humanties1",
                "Humanties2",
                "Humanties3"
            ]

        },
        {
            menuName: 'Economics and Finance',
            color: {
                'background-color': 'grey'
            },
            subjects: [
                "Economics and Finance1",
                "Economics and Finance2",
                "Economics and Finance3"
            ]

        },
        {
            menuName: 'Computing',
            color: {
                'background-color': 'gold'
            },
            subjects: [
                "Computing1",
                "Computing2",
                "Computing3"
            ]

        }

    ];


});

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/', '/welcome');
    //$urlRouterProvider.when('/', '/welcome');
    // For any unmatched url, send to /route1
   $urlRouterProvider.otherwise("/")

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
            templateUrl: "login.html",
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "signup.html",
        })
})