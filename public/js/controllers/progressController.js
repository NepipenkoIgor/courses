/**
 * Created by igor on 9/2/14.
 */
app.controller('progress', function ($scope, $state, $http, $sce, $location, courseEdit) {
    $http.get("/user").success(function (user) {
        $scope.user = user;

        $http.get("/units").success(function (list) {
            var attitude = courseEdit.pointsCalculate($scope.user.progress) / courseEdit.totalPointsOfAllCourse(list);
            attitude = Math.round(attitude * 100)
            $scope.progress = {'width': attitude + "%"}

        })
    })

})