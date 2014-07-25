/**
 * Created by igor on 7/15/14.
 */
app.controller('lessonController', function ($scope, $http, $stateParams, $state, $sce, $location, courseEdit) {

    function init() {
        $http.get('/courses').success(function (courses) {

            if (courses.length > 0) {
                $scope.courses = courses;
                console.log("courses", $scope.courses);
            } else {
                $scope.courses = [];
                courseEdit.course = " ";
            }


            for (var i = 0; i < $scope.courses.length; i++) {
                if ($scope.courses[i].title === $stateParams.courseTitle) {
                    $scope.course = $scope.courses[i];
                    courseEdit.course = $scope.course;
                }
            }

            if (!$scope.course) {
                $state.go('adminlab');
            }


            courseEdit.courses = $scope.courses;
            //  courseEdit.course=$scope.course;
            $http.get('/units').success(function (units) {

                if (units.length > 0) {
                    $scope.units = units;
                } else {
                    $scope.units = [];
                    $state.go('adminlab');
                }
                $scope.showUnits = function (id) {
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
                    for (var i = 0; i < $scope.units.length; i++) {
                        if ($scope.units[i].parent === id) {
                            arrUnits.push($scope.units[i]);
                        }
                    }
                   // console.log("sort unit", arrUnits.sort(sortArr));
                    return arrUnits.sort(sortArr);
                };

                $scope.disabled = false;
                //  console.log($scope.units)
            });

        });


    }
    init();


    $scope.saveCourse = function (action) {
        $scope.disabled = true;
        var data = [
            {action: action},
            $scope.course,
            $scope.units,
            $scope.unitsDelete,
            $scope.unitsNew
        ];

        $http.post('/subjects', data).success(function (data) {
            $scope.unitsDelete = [];
            $scope.unitsNew = null;
            console.log(data);
            if (action === 'deletecourse') {
                // $state.go('lesson',{courseTitle:$scope.courses[0].title});
                $state.go('adminlab');
                init();

            }else{
              //  $state.go('adminlab.lesson.module', {courseTitle: $scope.course.title});
                // $state.go('adminlab')
                init();
                courseEdit.initTab();
            }


        });
    };
    courseEdit.saveCourse = $scope.saveCourse;

    $scope.unitsDelete = [];
    $scope.deleteUnit = function (parent, unitId) {

        var unitTitle = unitId || "all";
        if (unitTitle === "all") {
            for (var i = 0; i < $scope.units.length; i++) {
                if ($scope.units[i].parent === parent) {
                    $scope.unitsDelete.push($scope.units[i]._id);
                   // $scope.unitsDelete;
                    $scope.units.splice(i, 1);
                    $scope.saveCourse();
                    i--;
                }

            }

            return;
        }
        for (var i = 0; i < $scope.units.length; i++) {
            if ($scope.units[i].unitId !== unitId) {
                continue;
            }
            $scope.unitsDelete.push($scope.units[i]._id);
            $scope.units.splice(i, 1);
            $scope.saveCourse();
            return;
        }

    };

    $scope.deleteCourse = function (id) {
        for (var i = 0; i < $scope.courses.length; i++) {
            if ($scope.courses[i]._id !== id) {
                continue;
            }
            $scope.course = $scope.courses[i];
            for (var j = 0; j < $scope.courses[i].modules.length; j++) {
                for (var l = 0; l < $scope.courses[i].modules[j].sections.length; l++) {
                    $scope.deleteUnit($scope.courses[i].modules[j].sections[l].specialId);
                }
            }
            $scope.saveCourse('deletecourse');

        }
    };
    courseEdit.deleteCourse = $scope.deleteCourse;


    $scope.deleteModule = function (id) {

        for (var i = 0; i < $scope.course.modules.length; i++) {
            if ($scope.course.modules[i]._id === id) {
                for (var j = 0; j < $scope.course.modules[i].sections.length; j++) {
                    $scope.deleteUnit($scope.course.modules[i].sections[j].specialId);
                }
                $scope.course.modules.splice(i, 1);
                //return;
                //j--;
            }
        }

        if ($scope.course.modules.length === 0) {
            $scope.saveCourse('deletecourse');

        }

    };


    $scope.deleteSection = function (moduleId, id) {
        for (var i = 0; i < $scope.course.modules.length; i++) {
            if ($scope.course.modules[i]._id === moduleId) {
                for (var j = 0, l = $scope.course.modules[i].sections.length; j < l; j++) {
                    if ($scope.course.modules[i].sections[j]._id === id) {
                        $scope.deleteUnit($scope.course.modules[i].sections[j].specialId);
                        $scope.course.modules[i].sections.splice(j, 1);
                        l--;
                    }

                }
                //$scope.course.modules.splice(i,1);
            }
        }
    };


    $scope.addModule = function (id, position) {

        for (var i = 0, l = $scope.course.modules.length; i < l; i++) {

            if ($scope.course.modules[i]._id === id) {

                if (position === 'after') {
                    //console.log(l)
                    var specialId = Date.now();
                    $scope.course.modules.splice(i + 1, 0, {title: "New Module", description: "", sections: [
                        {title: "New Section", description: "", specialId: specialId}
                    ]});
                    // console.log( $scope.course.modules);
                    $scope.units.push({parent: specialId, title: "New Unit", unitId: specialId, description: "", lims: []});
                    $scope.saveCourse();
                    return;
                }
                if (position === 'before') {
                    // console.log(l)
                    var specialId = Date.now();
                    $scope.course.modules.splice(i, 0, {title: "New Module", description: "", sections: [
                        {title: "New Section", description: "", specialId: specialId}
                    ]});
                    // console.log( $scope.course.modules);
                    $scope.units.push({parent: specialId, title: "New Unit", unitId: specialId, description: "", lims: []});
                    $scope.saveCourse();
                    return;
                }
            }
        }
    };


    $scope.addSection = function (name, position) {
        for (var i = 0; i < $scope.course.modules.length; i++) {
            for (var j = 0, l = $scope.course.modules[i].sections.length; j < l; j++) {
                if ($scope.course.modules[i].sections[j].title === name) {
                    if (position === 'after') {
                        var specialId = Date.now();
                        $scope.course.modules[i].sections.splice(j + 1, 0, {title: "New Section", description: "", specialId: specialId});
                        // console.log( $scope.course.modules);
                        $scope.units.push({parent: specialId, title: "New Unit", unitId: specialId, description: "", lims: []});
                        $scope.saveCourse();
                        return;
                    }
                    if (position === 'before') {
                        var specialId = Date.now();
                        $scope.course.modules[i].sections.splice(j, 0, {title: "New Section", description: "", specialId: specialId});
                        console.log($scope.course.modules[i].sections);
                        $scope.units.push({parent: specialId, title: "New Unit", unitId: specialId, description: "", lims: []});
                        $scope.saveCourse();
                        return;
                    }
                }
            }
        }
    };

    $scope.addUnit = function (moduleId, sectionId, unitsOrderId, position) {
        for (var i = 0; i < $scope.course.modules.length; i++) {
            if ($scope.course.modules[i]._id !== moduleId) {
                continue;
            }
            for (var j = 0, l = $scope.course.modules[i].sections.length; j < l; j++) {
                if ($scope.course.modules[i].sections[j].specialId === sectionId) {
                    var specialId = $scope.course.modules[i].sections[j].specialId;

                    if (position === 'after') {
                        var orderId = unitsOrderId + 1;
                        var newUnit = {parent: specialId, unitId: orderId, title: "New Unit", description: "", lims: []};
                        for (var z = 0; z < $scope.units.length; z++) {
                            if ($scope.units[z].unitId !== newUnit.unitId) {
                                $scope.units.push(newUnit);
                                $scope.saveCourse();
                                console.log("after", $scope.units)
                                return;
                            }

                        }
                    }
                    if (position === 'before') {
                        var orderId = unitsOrderId - 1;
                        // $scope.course.modules[i].sections.splice(j,0,{title:"New Section",description:"",specialId:specialId});
                        console.log($scope.course.modules[i].sections);
                        var newUnit = {parent: specialId, unitId: orderId, title: "New Unit", description: "", lims: []};
                        for (var z = 0; z < $scope.units.length; z++) {
                            if ($scope.units[z].unitId !== newUnit.unitId) {
                                $scope.units.push(newUnit);
                                $scope.saveCourse();
                                console.log($scope.units);
                                return;
                            }

                        }

                    }
                }
            }
        }

    };


    $scope.changeInit = function (id) {
        if( $scope.disabled===false) {
            for (var i = 0; i < $scope.units.length; i++) {
                if ($scope.units[i]._id !== id) {
                    continue;
                }
                $scope.unitNow = $scope.units[i];
            }
            console.log("unit now", $scope.unitNow);
            if (!$scope.unitNow.lims[0]) {
                $scope.typeLim = {
                    type: "quiz"
                };
            } else {
                $scope.typeLim = {
                    type: $scope.unitNow.lims[0].typeLim
                };
            }
            //console.log($scope.unitNow.lims[0] === undefined || !angular.isObject($scope.unitNow.lims[0].content[0]));
            if ($scope.unitNow.lims[0] === undefined || !angular.isObject($scope.unitNow.lims[0].content[0])) {
                $scope.quizInEdit = [
                    {description: "", quiz: [
                        {orderId: Date.now(), title: "", answer: ""}
                    ]}
                ];

            } else {
                $scope.quizInEdit = $scope.unitNow.lims[0].content;
            }

        }
    };


    $scope.statuses = [
        {value: 'static', text: 'static'},
        {value: 'video', text: 'video'},
        {value: 'quiz', text: 'quiz'}
    ];

    $scope.formatVideoUrl = function (url) {

        if($scope.unitNow.lims[0] === undefined || $scope.unitNow.lims[0].typeLim!='video'){
          var  url="//www.youtube.com/embed/mSgX4wNekns";
        }else{
            var url = url || $scope.unitNow.lims[0].content[0];
        }

        $scope.videoSource = url;
        return $sce.trustAsResourceUrl(url);
    };

    $scope.saveVideo = function () {

        var obj = {typeLim: $scope.typeLim.type, content: $scope.videoSource};
        $scope.unitNow.lims[0] = obj;

       // console.log("new unit seeeee", $scope.unitNow);
        $scope.saveCourse();
    };

    $scope.addQuiz = function (id, position) {

        for (var i = 0; i < $scope.quizInEdit[0].quiz.length; i++) {

            if ($scope.quizInEdit[0].quiz[i].orderId === id) {
                if (position === "after") {
                    $scope.quizInEdit[0].quiz.splice(i + 1, 0, {orderId: id + 1, title: "", answer: ""});
                    return;
                }
                if (position === "before") {
                    $scope.quizInEdit[0].quiz.splice(i, 0, {orderId: id - 1, title: "", answer: ""});
                    return;
                }
            }
        }
    };

    $scope.deleteQuiz = function (id) {
        for (var i = 0; i < $scope.quizInEdit[0].quiz.length; i++) {

            if ($scope.quizInEdit[0].quiz[i].orderId === id) {

                $scope.quizInEdit[0].quiz.splice(i, 1);
                return;

            }
        }
    };

    $scope.saveQuiz = function () {
        var obj = {typeLim: $scope.typeLim.type, content: [$scope.quizInEdit[0]]};

        $scope.unitNow.lims[0] = obj;
        console.log($scope.unitNow.lims[0]);
        $scope.saveCourse();
    };

    $scope.aceLoaded = function(_editor){
        // Editor part
        var _session = _editor.getSession();
        var _renderer = _editor.renderer;
        var content;

        if($scope.unitNow.lims[0] === undefined || $scope.unitNow.lims[0].typeLim!='static'){
             content="Your static content";
        }else{
            content=$scope.unitNow.lims[0].content[0];
        }
        _editor.setValue(reverseEscapeHtml(content));
        // Options
       // _editor.setReadOnly(true);
        _session.setUndoManager(new ace.UndoManager());
        _renderer.setShowGutter(false);
        // Events
       // _editor.on("changeSession", function(data){console.log("iam changed",data)});
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        };
        function reverseEscapeHtml(unsafe) {
            return unsafe
                .replace(/&amp/g, "&;")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
        };
        _session.on("change", function(inputData){

        $scope.editView=escapeHtml(_editor.getValue());

        });
        //_editor.on("blur", function(event,data){console.log(_editor.getValue())});
    };
 $scope.saveStatic=function(){
     console.log($scope.editView);
     var obj = {typeLim: $scope.typeLim.type, content: [$scope.editView]};
     $scope.unitNow.lims[0] = obj;
     $scope.saveCourse();
 };




})