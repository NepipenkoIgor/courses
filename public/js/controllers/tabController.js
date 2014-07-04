/**
 * Created by igor on 7/1/14.
 */
app.controller('maintab', function ($scope, $http) {
    'user strict';

    $scope.tab = 1;
    function reqSubject() {
        $http.get('/subject').success(function (data) {
            $scope.menus = data;
            console.log($scope.menus);
            $scope.vertical=$scope.menus.length*90+'px';
            $scope.tabheight={height:$scope.vertical};
            $scope.colorTab = $scope.menus[0].color['background-color'];
            $scope.changTabColor = $scope.menus[0].color['background-color'];
        });

    };
    reqSubject();
    console.log($scope.menus);
   /* this.menus = [
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

    ];*/
   //$scope.vertical=$scope.menus.length*90+'px';
   // $scope.tabheight={height:$scope.vertical};
    console.log("asd",$scope.tabheight);

    $scope.showTab = function (num) {
        $scope.tab = num;
        $scope.changTabColor = this.menus[num - 1].color['background-color'];
    };

    $scope.activeTab = function (num) {
        if (num === this.tab) {
            return true;
        }
        return false;
    };

    /* this.classActive=function(num){
     if(num===this.tab){
     return "active";
     };
     return;
     };*/
    //$scope.colorTab = $scope.menus[0].color['background-color'];
    //$scope.changTabColor = $scope.menus[0].color['background-color'];
    $scope.hover = function (color) {
        if (color) {
            $scope.colorTab = color;
            return;
        }
        $scope.colorTab = 'ghostwhite';

    };
    $scope.color = function (color1, color2, color3) {
        if (color2 === color3) {
            return {'background-color': color2};
        }
        if (color1 === color2) {

            return {'background-color': color1};
        }
        return {'background-color': 'ghostwhite'};
    };


});