/**
 * Created by igor on 8/5/14.
 */
app.controller("badgeController",function($scope,$http,courseEdit,toaster){
    $scope.showBadges=false;
    $scope.userHasBadge=function(badge,user){
        $scope.imgBadge=badge.img;
 //console.log(badge,user)
        $scope.desc=badge.description;
     if(user.badges.indexOf(badge.badgeId)===(-1)){
         $http.post('/badgeuser', [user._id,badge.badgeId]).success(function (data) {
             //console.log("save badges");
            // courseEdit.initBadge();
             courseEdit.reqUser();
            // $scope.showBadges=false;
         });
         $scope.pop()
         $scope.showBadges=true;
     }
       return ;
     };
    courseEdit.userHasBadge=$scope.userHasBadge;

    $scope.hideBadge=function(){
        $scope.showBadges=false;
    };

    $scope.pop = function(){
       /* toaster.pop('success', title*//*, "text"*//*)*/
        toaster.pop("users",null, "badge.html", null, 'template');
    };

});