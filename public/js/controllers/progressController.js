/**
 * Created by igor on 9/2/14.
 */
app.controller('progress', function ($scope, $state, $http, $sce, $location,$stateParams, courseEdit) {
    $http.get("/user").success(function (user) {
        $scope.user = user;

        $http.get("/units").success(function (list) {
            var attitude = courseEdit.pointsCalculate($scope.user.progress) / courseEdit.totalPointsOfAllCourse(list);
            attitude = Math.round(attitude * 100);
            $scope.progress = {'width': attitude + "%"};

        });
    });
    if (courseEdit.listOfBadges && courseEdit.userdata) {
        courseEdit.userHasBadge(courseEdit.listOfBadges[8+parseInt($stateParams.moduleTitle)], courseEdit.userdata);
    }
   // console.log($stateParams.moduleTitle)
})