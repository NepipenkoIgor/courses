

app.controller('profile', function ($scope, $http) {
    'user strict';
    var self = $scope;

    function reqUser() {
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
        if (!data.phone) {
            data.phone = '';
        }
        if (!data.settings) {
            data.settings = '';
        }
        /*if (!data.courses[0].id) {
            data.courses[0].id = '';
        }*/

        $scope.userdata = data;
        if (typeof $scope.userdata === 'string') {
            $scope.userdata = false;
        }
        self.username=$scope.userdata;
        console.log(self.username)
    });

}
    $scope.us=reqUser;
    $scope.us();
    //setInterval(reqUser,1000);
/*$scope.username=function(){
 setInterval(function(){
 console.log($scope.userdata.username)
 //return $scope.userdata.username;
 },1000);
 };*/
// var user=reqUser();
//  console.log('her',typeof user)
//self.username=reqUser().username;
$scope.postProfile = function (data) {
console.log($scope.us);
    $http.post('/main', data).success(function (data) {
        console.log("my callback data =", data.data);
        console.log("good request");
        $scope.us();
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