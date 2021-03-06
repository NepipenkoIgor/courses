app.controller('profile', function ($scope, $state, $http, $sce, $location, courseEdit) {
    'user strict';
    /*console.log(Users.userinfo().then(function(data){
     console.log(data)
     }))*/
    $scope.reqUser = function (cb, badge) {
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

            if ($scope.userdata && data) {
                $scope.userdata = $scope.userdata || {};
                _.extend($scope.userdata, data);
                courseEdit.userdata = $scope.userdata;
                // courseEdit.eqvalBadges();
            } else {
                $scope.userdata = data;
                courseEdit.userdata = $scope.userdata;
                // courseEdit.eqvalBadges();
            }

            if (typeof $scope.userdata === 'string') {
                $scope.userdata = false;
                courseEdit.userdata = $scope.userdata;

            }
            $scope.checkExistUnit = function () {
                $http.get("/units").success(function (units) {
                    var send = false
                    if ($scope.userdata) {
                        var massOfUnits = [];
                        for (var i = 0; i < units.length; i++) {
                            massOfUnits.push(units[i].unitId)
                        }
                        //console.log(massOfUnits)
                        for (var j = 0; j < $scope.userdata.progress.length; j++) {
                            if (massOfUnits.indexOf($scope.userdata.progress[j]) === (-1)) {
                              //  console.log(massOfUnits.indexOf($scope.userdata.progress[j]),$scope.userdata.progress.splice(j, 1))
                                $scope.userdata.progress.splice(j,1);
                                j--;
                                send = true;
                            }
                        }
                        if($scope.userdata.currentLesson&&massOfUnits.indexOf($scope.userdata.currentLesson.unit) === (-1)){
                            $scope.userdata.currentLesson={}
                            send = true;
                        }
                        if (send) {
                            //console.log($scope.userdata.progress.splice(0,1))
                            $http.post("/delete/oldunit", [$scope.userdata._id, $scope.userdata.progress,$scope.userdata.currentLesson]).success(function () {
                                //console.log( $scope.userdata.progress)
                                //console.log( massOfUnits);
                            });
                        }


                    }
                });


            };
            $scope.checkExistUnit();
            if (badge) {
                cb()
                return;
            }

            return cb && cb();
        });

    };

    $scope.reqUser();
    courseEdit.reqUser = $scope.reqUser;



    //$scope.checkExistUnit();


    $scope.postProfile = function (data) {
        $http.post('/main', data).success(function (data) {
            $scope.reqUser();

        });
    };
    $scope.userImgAvatar = function (img) {
        img = img || 'img/user.jpg';

        return $sce.trustAsResourceUrl(img);
    };
    $scope.userAvatar = function (img) {
        img = img || 'img/user.jpg';
        var background = "url('" + img + "') center";
        var obj = {'background': background};
        return obj;
    };
    $scope.profileGo = function (user) {
        $state.go('editprofile', ({username: user}));
    };

    /****on support by browser*****/

});