/**
 * Created by igor on 7/1/14.
 */
app.controller('maintab', function ($scope, $http, $state, $sce, $stateParams, courseEdit) {
    'user strict';
//$scope.courseEdit=courseEdit;

//console.log("peregryzka")

    function initTab() {

        $http.get('/courses').success(function (courses) {
            $scope.listOfCourses = courses;

        });
        $http.get('/units').success(function (units) {
            $scope.listOfUnits = units;
            courseEdit.listOfUnits = $scope.listOfUnits;

            $scope.showUnitsList = function (id) {
                function sortArr(a, b) {
                    if (a.unitId < b.unitId) {
                        return -1;
                    }
                    if (a.unitId > b.unitId) {
                        return 1;
                    }
                    return 0;
                }

                var arrUnits = [];
                for (var i = 0; i < $scope.listOfUnits.length; i++) {
                    if ($scope.listOfUnits[i].parent === id) {
                        arrUnits.push($scope.listOfUnits[i]);
                    }
                }
                //console.log("sort unit", arrUnits.sort(sortArr));
                return arrUnits.sort(sortArr);
            };

            // console.log("iam $stateParams");
            function reloadLink() {
                //console.log("peregryzka params",$state.current.name)
                for (var i = 0; i < $scope.listOfCourses.length; i++) {
                    if ($stateParams.courseTitle && $scope.listOfCourses[i].title === $stateParams.courseTitle) {
                        $scope.courseNowChange($scope.listOfCourses[i]._id);

                        for (var j = 0; j < $scope.courseNowChanged.modules.length; j++) {
                            //console.log("course change",$scope.courseNowChanged.modules[j])
                            if ($stateParams.moduleTitle && $scope.courseNowChanged.modules[j].title === $stateParams.moduleTitle) {
                                $scope.moduleNowChange($scope.courseNowChanged.modules[j]._id);

                                for (var l = 0; l < $scope.listOfUnits.length; l++) {
                                    // console.log("iam ty ty",$scope.listOfUnits[i].unitId)
                                    if ($stateParams.unitTitle && $scope.listOfUnits[l].unitId === parseInt($stateParams.unitTitle)) {

                                        $scope.unitNowChange($scope.listOfUnits[l].unitId);

                                    }
                                }
                            }

                        }
                    }
                }

            }

            //setTimeout(reloadLink,100);
            reloadLink();

        });

    }

    initTab();
    courseEdit.initTab = initTab;


    $scope.courseNowChange = function (id) {
        //console.log("course")
        for (var i = 0; i < $scope.listOfCourses.length; i++) {
            if ($scope.listOfCourses[i]._id === id) {
                $scope.courseNowChanged = $scope.listOfCourses[i];
                // console.log("iam here",$scope.courseNowChanged);
                $scope.moduleNowChanged = "";
                $state.go('course', {courseTitle: $scope.courseNowChanged.title});
                return;
            }
        }

    };
    $scope.moduleNowChange = function (id) {
        for (var i = 0; i < $scope.courseNowChanged.modules.length; i++) {
            if ($scope.courseNowChanged.modules[i]._id === id) {
                $scope.moduleNowChanged = $scope.courseNowChanged.modules[i];
                //console.log("iam here",$scope.courseNowChanged);
                $state.go('module', {courseTitle: $scope.courseNowChanged.title, moduleTitle: $scope.moduleNowChanged.title});
            }
        }

    };
    //console.log("toState",/*toState.resolve.simpleObj()*/$state);


    $scope.unitNowChange = function (id) {
        // $scope.listOfUnits=$scope.listOfUnits||courseEdit.listOfUnits;
        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            // console.log($scope.listOfUnits[i]);
            if ($scope.listOfUnits[i].unitId === id) {
                $scope.unitNowChanged = $scope.listOfUnits[i];
                // console.log("iam here", $scope.unitNowChanged);
                for (var j = 0; j < $scope.moduleNowChanged.sections.length; j++) {
                    if ($scope.moduleNowChanged.sections[j].specialId === $scope.unitNowChanged.parent) {
                        $scope.sectionNowChanged = $scope.moduleNowChanged.sections[j];
                    }
                }

                courseEdit.unitNowChanged = $scope.unitNowChanged;
                console.log("courseEdit.unitNowChanged", courseEdit.unitNowChanged);
                $state.go('unit', {courseTitle: $scope.courseNowChanged.title, moduleTitle: $scope.moduleNowChanged.title,
                    sectionTitle: $scope.sectionNowChanged.title, unitTitle: $scope.unitNowChanged.unitId});

                return;
            }
        }
        $state.go('welcome');
    };
    // courseEdit.unitNowChange=$scope.unitNowChange;

    $scope.formatVideoUrl = function (url) {
        return $sce.trustAsResourceUrl(url);
    };
    $scope.faUnitClass = function (type) {
        if (type === "video") {
            return "fa fa-film";
        }
        if (type === "quiz") {
            return "fa fa-question";
        }
        if (type === "static") {
            return "fa fa-file-o";
        }
        if (type === undefined) {
            return "fa fa-pencil";
        }
    };
    $scope.trustHtml = function (html) {
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