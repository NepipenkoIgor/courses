app.controller('profile', function ($scope, $http) {
    'user strict';

    $scope.reqUser=function(){
        $http.get('/user').success(function (data) {
 console.log("iam start");

            /*$scope.userdata = data || {};

            $scope.userdata.username = data.username || 'guest';
            $scope.userdata.password = data.password || '';
            $scope.userdata.userlevel = data.userlevel || '0';
            $scope.userdata.firstname = data.firstname || '';
            $scope.userdata.lastname = data.lastname || '';
            $scope.userdata.birth = data.birth || '';
            $scope.userdata.email = data.email || '';
            $scope.userdata.phone = data.phone || '';
            $scope.userdata.settings = data.settings || '';*/

            if (!data.username) {
                data.username = 'guest';
            }
            if (!data.password) {
                data.password = '';
            }
            if (!data.userlevel) {
                data.userlevel = '0';
            }
            if (!data.firstname) {
                data.firstname = '';
            }
            if (!data.lastname) {
                data.lastname = '';
            }
            if (!data.birth) {
                data.birth = '';
            }
            if (!data.email) {
                data.email = '';
            }
            if (!data.phone) {
                data.phone = '';
            }
            if (!data.phone) {
                data.phone = '';
            }
            if (!data.settings) {
                data.settings = '';
            }

console.log("data scope",$scope.userdata);


            if($scope.userdata&&data){
                $scope.userdata = $scope.userdata||{};
                _.extend($scope.userdata, data);
            }else{
                $scope.userdata=data;
            }


           //


            //console.log($scope.userdata);
            if (typeof $scope.userdata === 'string') {
                $scope.userdata = false;
            }

        });

    };

    $scope.reqUser();
    //$scope.us();

    $scope.postProfile = function (data) {
        console.log(data,$scope.userdata);
        //data.username=$scope.userdata.username;
        $http.post('/main', data).success(function (data) {
            console.log("my callback data =", data.data);
            console.log("good request");
             $scope.reqUser();
        });


    };
    $scope.userAvatar = function (img) {
        var img = img || 'http://karalmik.com/wp-content/uploads/2013/03/29-150x150.jpg';
        var background = "url('" + img + "') center";
        var obj = {'background': background};
        return obj;
    };

});