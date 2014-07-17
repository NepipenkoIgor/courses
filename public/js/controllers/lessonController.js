/**
 * Created by igor on 7/15/14.
 */
app.controller('lessonController', function ($scope, $http, $stateParams, $state,courseEdit) {

    var init = function () {
        $http.get('/courses').success(function (courses) {
            console.log(courses)
            if (courses.length > 0) {
                $scope.courses = courses;
                console.log("courses", $scope.courses)
            } else {
                $scope.courses = [];
                courseEdit.course=" ";
            }


            for (var i = 0; i < $scope.courses.length; i++) {
                if ($scope.courses[i].title === $stateParams.courseTitle) {
                    $scope.course = $scope.courses[i];
                    courseEdit.course=$scope.course;
                }
            }
            console.log("kyky",$scope.course)
            if (!$scope.course) {
                /*courseEdit.courses=$scope.courses;
                courseEdit.course=" ";*/
                $state.go('welcome');
            }



            courseEdit.courses=$scope.courses;
          //  courseEdit.course=$scope.course;


        });
        $http.get('/units').success(function (units) {

            if (units.length > 0) {
                $scope.units = units;
            } else {
                $scope.units = [];
                $state.go('welcome');
            }
            $scope.showUnits = function (id) {
                function sortArr(a, b) {
                    if (a.unitid < b.unitid) {
                        return -1;
                    }
                    if (a.unitid > b.unitid) {
                        return 1;
                    }
                    return 0;
                };
                var arrUnits = [];
                for (var i = 0; i < $scope.units.length; i++) {
                    if ($scope.units[i].parent === id) {
                        arrUnits.push($scope.units[i]);
                    }
                }
                return arrUnits.sort(sortArr);
            };


          //  console.log($scope.units)
        });

    };
    init();


    $scope.saveCourse = function (action) {
        var data = [
            {action: action},
            $scope.course,
            $scope.units,
            $scope.unitsDelete,
            $scope.unitsNew
        ];
        console.log($scope.units)
        $http.post('/subjects', data).success(function (data) {
            $scope.unitsDelete = [];
            $scope.unitsNew = null;
            console.log(data);
            if(action==='deletecourse'){
                $state.go('lesson',{courseTitle:$scope.courses[0].title});
            }
            $state.go('lesson',{courseTitle:$scope.course.title});
            //init();
        });
    };
    courseEdit.saveCourse=$scope.saveCourse;

    $scope.unitsDelete = []
    $scope.deleteUnit = function (parent, unitId) {
        var unitTitle = unitId || "all";
        if (unitTitle === "all") {
            for (var i = 0; i < $scope.units.length; i++) {
                if ($scope.units[i].parent === parent) {
                    $scope.unitsDelete.push($scope.units[i]._id);
                    $scope.unitsDelete
                    $scope.units.splice(i, 1);
                    $scope.saveCourse();
                    i--;
                }

            }

            return;
        }
        for (var i = 0; i < $scope.units.length; i++) {
            if ($scope.units[i].parent === parent && $scope.units[i].unitid === unitId) {
                // unitsDelete.push($scope.units[i]._id);
                $scope.unitsDelete.push($scope.units[i]._id);

                $scope.units.splice(i, 1);
                $scope.saveCourse();

            }

        }

        console.log("delet units", $scope.unitsDelete)
    };


    $scope.deleteModule = function (id) {
        console.log($scope.course.modules)
        for (var i = 0; i < $scope.course.modules.length; i++) {
            if ($scope.course.modules[i]._id === id) {
                for (var j = 0; j < $scope.course.modules[i].sections.length; j++) {
                    $scope.deleteUnit($scope.course.modules[i].sections[j].specialId);
                }
                $scope.course.modules.splice(i, 1);
                j--;
            }
        }

        if($scope.course.modules.length===0){
            $scope.saveCourse('deletecourse')

        }

    }


    $scope.deleteSection = function (moduleId, id) {
        for (var i = 0; i < $scope.course.modules.length; i++) {
            if ($scope.course.modules[i]._id === moduleId) {
                for (var j = 0, l = $scope.course.modules[i].sections.length; j < l; j++) {
                    if ($scope.course.modules[i].sections[j]._id === id) {
                        $scope.deleteUnit($scope.course.modules[i].sections[j].specialId)
                        $scope.course.modules[i].sections.splice(j, 1);
                        l--;
                    }

                }
                //$scope.course.modules.splice(i,1);
            }
        }
    };


    $scope.addModule = function (name, position) {

        for (var i = 0, l = $scope.course.modules.length; i < l; i++) {
            //console.log($scope.course.modules[i].title===name)
            if ($scope.course.modules[i].title === name) {
                console.log(position === 'after')
                if (position === 'after') {
                    //console.log(l)
                    var specialId = Date.now();
                    $scope.course.modules.splice(i + 1, 0, {title: "New Module", description: "", sections: [
                        {title: "New Section", description: "", specialId: specialId}
                    ]})
                    // console.log( $scope.course.modules);
                    $scope.units.push({parent: specialId, title: "New Unit", unitid: specialId, description: "", lims: []});
                    $scope.saveCourse();
                    return;
                }
                if (position === 'before') {
                    // console.log(l)
                    var specialId = Date.now();
                    $scope.course.modules.splice(i, 0, {title: "New Module", description: "", sections: [
                        {title: "New Section", description: "", specialId: specialId}
                    ]})
                    // console.log( $scope.course.modules);
                    $scope.units.push({parent: specialId, title: "New Unit", unitid: specialId, description: "", lims: []});
                    $scope.saveCourse();
                    return;
                }
            }
        }
    }


    $scope.addSection = function (name, position) {
        for (var i = 0; i < $scope.course.modules.length; i++) {
            for (var j = 0, l = $scope.course.modules[i].sections.length; j < l; j++) {
                if ($scope.course.modules[i].sections[j].title === name) {
                    if (position === 'after') {
                        var specialId = Date.now();
                        $scope.course.modules[i].sections.splice(j + 1, 0, {title: "New Section", description: "", specialId: specialId});
                        // console.log( $scope.course.modules);
                        $scope.units.push({parent: specialId, title: "New Unit", unitid: specialId, description: "", lims: []});
                        $scope.saveCourse();
                        return;
                    }
                    if (position === 'before') {
                        var specialId = Date.now();
                        $scope.course.modules[i].sections.splice(j, 0, {title: "New Section", description: "", specialId: specialId});
                        console.log($scope.course.modules[i].sections);
                        $scope.units.push({parent: specialId, title: "New Unit", unitid: specialId, description: "", lims: []});
                        //  $scope.unitsNew.push
                        console.log($scope.units)
                        $scope.saveCourse();
                        return;
                    }
                }
            }
        }
    }

    $scope.addUnit = function (id, unitsOrderId, position) {
        for (var i = 0; i < $scope.course.modules.length; i++) {
            for (var j = 0, l = $scope.course.modules[i].sections.length; j < l; j++) {
                if ($scope.course.modules[i].sections[j].specialId === id) {
                    var specialId = $scope.course.modules[i].sections[j].specialId;
                    //  for(var l=0;l< $scope.units)

                    if (position === 'after') {
                        var orderId = unitsOrderId + 1;
                        $scope.units.push({parent: specialId, unitid: orderId, title: "New Unit", description: "", lims: []});
                        $scope.saveCourse();
                        return;
                    }
                    if (position === 'before') {
                        var orderId = unitsOrderId - 1;
                        // $scope.course.modules[i].sections.splice(j,0,{title:"New Section",description:"",specialId:specialId});
                        console.log($scope.course.modules[i].sections);
                        $scope.units.push({parent: specialId, unitid: orderId, title: "New Unit", description: "", lims: []});

                        console.log($scope.units);
                        $scope.saveCourse();
                        return;
                    }
                }
            }
        }

    }


})