/**
 * Created by igor on 7/1/14.
 */
app.controller('maintab', function ($scope, $http,$state) {
    'user strict';

    $http.get('/courses').success(function (courses) {
$scope.listOfCourses=courses;
    });
    $http.get('/units').success(function (units) {
        $scope.listOfUnits=units;


        $scope.showUnitsList = function (id) {
            function sortArr(a, b) {
                if (a.unitId < b.unitId) {
                    return -1;
                }
                if (a.unitId > b.unitId) {
                    return 1;
                }
                return 0;
            };
            var arrUnits = [];
            for (var i = 0; i < $scope.listOfUnits.length; i++) {
                if ($scope.listOfUnits[i].parent === id) {
                    arrUnits.push($scope.listOfUnits[i]);
                }
            }
            console.log("sort unit",arrUnits.sort(sortArr));
            return arrUnits.sort(sortArr);
        };

    });


    $scope.courseNowChange=function(id){
        for(var i=0;i<$scope.listOfCourses.length;i++){
            if($scope.listOfCourses[i]._id===id){
                $scope.courseNowChanged=$scope.listOfCourses[i];
               // console.log("iam here",$scope.courseNowChanged);
                $scope.moduleNowChanged="";
                $state.go('course',{courseTitle:$scope.courseNowChanged.title});
            }
        }

    };
    $scope.moduleNowChange=function(id){
        for(var i=0;i<$scope.courseNowChanged.modules.length;i++){
            if($scope.courseNowChanged.modules[i]._id===id){
                $scope.moduleNowChanged=$scope.courseNowChanged.modules[i];
                //console.log("iam here",$scope.courseNowChanged);
                $state.go('module',{courseTitle:$scope.courseNowChanged.title,moduleTitle:$scope.moduleNowChanged.title});
            }
        }

    };
    $scope.unitNowChange=function(id){

        for(var i=0;i<$scope.listOfUnits.length;i++){
           // console.log($scope.listOfUnits[i]);
            if($scope.listOfUnits[i].unitId===id){
                $scope.unitNowChanged=$scope.listOfUnits[i];
                console.log("iam here", $scope.unitNowChanged);
                for(var j=0;j<$scope.moduleNowChanged.sections.length;j++){
                    if($scope.moduleNowChanged.sections[j].specialId===$scope.unitNowChanged.parent){
                        $scope.sectionNowChanged=$scope.moduleNowChanged.sections[j];
                    }
                }
                $state.go('unit',{courseTitle:$scope.courseNowChanged.title,moduleTitle:$scope.moduleNowChanged.title,
            sectionTitle:$scope.sectionNowChanged.title,unitTitle:$scope.unitNowChanged.title});
            }
        }

    };
});