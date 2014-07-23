/**
 * Created by igor on 7/1/14.
 */
app.controller('maintab', function ($scope, $http,$state,$sce,courseEdit) {
    'user strict';

    function initTab() {
        $http.get('/courses').success(function (courses) {
            $scope.listOfCourses = courses;
        });
        $http.get('/units').success(function (units) {
            $scope.listOfUnits = units;


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
                //console.log("sort unit", arrUnits.sort(sortArr));
                return arrUnits.sort(sortArr);
            };

        });

    }
    initTab();
    courseEdit.initTab=initTab;

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
               // console.log("iam here", $scope.unitNowChanged);
                for(var j=0;j<$scope.moduleNowChanged.sections.length;j++){
                    if($scope.moduleNowChanged.sections[j].specialId===$scope.unitNowChanged.parent){
                        $scope.sectionNowChanged=$scope.moduleNowChanged.sections[j];
                    }
                }
                console.log($scope.unitNowChanged)
                $state.go('unit',{courseTitle:$scope.courseNowChanged.title,moduleTitle:$scope.moduleNowChanged.title,
            sectionTitle:$scope.sectionNowChanged.title,unitTitle:$scope.unitNowChanged.title});
            }
        }

    };
    $scope.formatVideoUrl = function(url) {
        //TODO: append params, etc.

        return $sce.trustAsResourceUrl(url);
    };
    $scope.faUnitClass=function(type){
        if(type==="video"){
            return "fa fa-film";
        }
        if(type==="quiz"){
            return "fa fa-question"
        }
        if(type==="static"){
            return "fa fa-file-o"
        }
        if(type===undefined){
            return "fa fa-pencil"
        }
    };
    $scope.trustHtml=function(html){
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&amp/g, "&;")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
        }
        return $sce.trustAsHtml(escapeHtml(html));
    };

});