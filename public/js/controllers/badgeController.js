/**
 * Created by igor on 8/5/14.
 */
app.controller("badgeController",function($scope,$http,courseEdit,toaster){
    'use strict';
    $scope.showBadges=false;
    $scope.userHasBadge=function(badge,user){
        $scope.imgBadge=badge.img;
        $scope.desc=badge.description;
     if(user.badges.indexOf(badge.badgeId)===(-1)){
         $http.post('/badgeuser', [user._id,badge.badgeId]).success(function (data) {

             courseEdit.reqUser();

         });
         $scope.pop();
         $scope.showBadges=true;
     }
       return ;
     };
    courseEdit.userHasBadge=$scope.userHasBadge;

    $scope.hideBadge=function(){
        $scope.showBadges=false;
    };

    $scope.pop = function(){
        toaster.pop("users",null, "badge.html", null, 'template');
    };

});