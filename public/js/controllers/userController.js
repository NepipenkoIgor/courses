

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


        $scope.userdata = data;
        if (typeof $scope.userdata === 'string') {
            $scope.userdata = false;
        }
        $scope.userAvatar=$scope.userdata.avatar||'http://karalmik.com/wp-content/uploads/2013/03/29-150x150.jpg';
        self.username=$scope.userdata;
        //debugger;
        console.log(self.username)
    });

}
    $scope.us=reqUser;
    $scope.us();

$scope.postProfile = function (data) {
console.log($scope.us);
    $http.post('/main', data).success(function (data) {
        console.log("my callback data =", data.data);
        console.log("good request");
        $scope.us();
    });

};
    $scope.userAvatar = function (img) {
        var img=img||'http://karalmik.com/wp-content/uploads/2013/03/29-150x150.jpg'
        var background = "url'"+"("+img+")'"+" "+"center";
        var obj={'background':background}
        return obj;
    };

});