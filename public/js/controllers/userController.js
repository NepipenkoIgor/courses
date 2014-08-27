app.controller('profile', function ($scope,$state, $http,$sce,$location, courseEdit) {
    'user strict';

    $scope.reqUser=function(cb){
        $http.get('/user').success(function (data) {

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
            if (!data.settings) {
                data.settings = '';
            }

            if($scope.userdata&&data){
                $scope.userdata = $scope.userdata||{};
                _.extend($scope.userdata, data);
                courseEdit.userdata=$scope.userdata;
                courseEdit.eqvalBadges();
            }else{
                $scope.userdata=data;
                courseEdit.userdata=$scope.userdata;
                courseEdit.eqvalBadges();
            }

            if (typeof $scope.userdata === 'string') {
                $scope.userdata = false;
                courseEdit.userdata=$scope.userdata;
            }
             return cb && cb();
        });

    };

    $scope.reqUser();
    courseEdit.reqUser= $scope.reqUser;

    $scope.postProfile = function (data) {
        $http.post('/main', data).success(function (data) {
            $scope.reqUser();

        });
    };
    $scope.userImgAvatar=function(img){
        img = img || 'http://karalmik.com/wp-content/uploads/2013/03/29-150x150.jpg';
      //  console.log(img);
        return $sce.trustAsResourceUrl(img);
    }
    $scope.userAvatar = function (img) {
        img = img || 'http://karalmik.com/wp-content/uploads/2013/03/29-150x150.jpg';
        var background = "url('" + img + "') center";
        var obj = {'background': background};
        return obj;
    };
    $scope.profileGo=function(user){
        $state.go('editprofile',({username:user}));
    };
   // setInterval(function(){console.log(courseEdit)},1000);
   /* if(!$scope.userdata){
       console.log($location.$$path.split("/")[1]);
        if($location.$$path.split("/")[1]!=='signup'){
            $location.url("/login");
            return;
        }

    }*/
});