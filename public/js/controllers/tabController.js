/**
 * Created by igor on 7/1/14.
 */
app.controller('maintab', function ($scope, $http, $state, $sce, $stateParams, $location, $window, $timeout, courseEdit) {
    'user strict';
    $("#blockwindow").hide();
    /**/
    $scope.userNowView = {};
    $scope.positionInCourse = {};
    $scope.progress = {};

    /*function initBadge(){
     $http.get('/badges').success(function (badge) {
     $scope.listOfBadges = badge;
     courseEdit.listOfBadges = $scope.listOfBadges;
     });

     }
     initBadge();
     courseEdit.initBadge = initBadge;*/

    $scope.user_progress = {
        label: 50,
        percentage: 0.5
    };
    /*********** develop badge config*-*****************/
    $scope.listOfBadges = [
        {
            "badgeId": 0,
            'name': 'Complete Module',
            'img': 'img/badges/download.png',
            'description': 'module 1'
        },
        {

            "badgeId": 1,
            'name': 'Make a post',
            'img': 'img/badges/first.png',
            'description': 'First Post'
        },
        {

            "badgeId": 2,
            'name': 'Ask a question',
            'img': 'img/badges/first.png',
            'description': 'First Question'
        },
        {
            "badgeId": 3,
            'name': '50 Answers',
            'img': 'img/badges/answer.png',
            'description': 'Helper'
        },
        {
            "badgeId": 4,
            'name': '50 Comments',
            'img': 'img/badges/answer.png',
            'description': 'Active'
        },
        {

            "badgeId": 5,
            'name': '50 questions',
            'img': 'img/badges/answer.png',
            'description': 'Curious'
        },
        {
            "badgeId": 6,
            'name': '100 Answers',
            'img': 'img/badges/answer.png',
            'description': 'Guru'
        },
        {
            "badgeId": 7,
            'name': '100 posts',
            'img': 'img/badges/answer.png',
            'description': 'Conversation King'
        },
        {

            "badgeId": 8,
            'name': '100 questions',
            'img': 'img/badges/answer.png',
            'description': 'Inquisitor'
        },
        {
            "badgeId": 9,
            'name': '100 Comments',
            'img': 'img/badges/answer.png',
            'description': 'Active+'
        }

    ];
    /*$scope.listOfBadges = [
     {
     "badgeId": 0,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first lesson "
     },
     {
     "badgeId": 1,
     "img": "http://www.auplod.com/u/oupdal37d51.png",
     "description": "your first answer for quiz"
     },
     {
     "badgeId": 2,
     "img": "http://www.auplod.com/u/dalopu37d54.png",
     "description": "your first viewed video"
     },
     {
     "badgeId": 3,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first post"
     },
     {
     "badgeId": 4,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first question"
     },
     {
     "badgeId": 5,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first lesson"
     },
     {
     "badgeId": 0,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first lesson"
     },
     {
     "badgeId": 1,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first answer for quiz sgdfghh hhhhhh hhhhhhh hhhhhhh hhhhhhhhhhhh hhhhhhhhh hhhhhhh hhhhhh hhhhhhhhhhh hhhhhh hhhhhh hhhhhhhh"
     },
     {
     "badgeId": 2,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first viewed video"
     },
     {
     "badgeId": 3,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first post dsgdfghhhhhh hhhhhhhhh hhhhhhhhh hhhhhhhhhhhh hhhhhhh hhhhhhhhhhhh hhhhhhhhhhhh hhhhhhhhhhhhhh hhhhhh"
     },
     {
     "badgeId": 4,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first question"
     },
     {
     "badgeId": 5,
     "img": "http://www.auplod.com/u/lpauod37c05.png",
     "description": "your first lesson"
     }
     ];*/

    courseEdit.listOfBadges = $scope.listOfBadges;

    /*********** initial tab*-*****************/
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
                return arrUnits.sort(sortArr);
            };


            /**************some rout logic***********************/

            if (!courseEdit.userdata) {
                if ($location.$$path.split("/")[1] !== "/signup" || $location.$$path.split("/")[1] !== "/signup/admin") {
                    $location.url("/login");
                }
            }
            if (courseEdit.userdata) {
                if ($location.$$path.split("/")[1] === 'adminlab' && courseEdit.userdata) {
                    if (!courseEdit.userdata.position) {
                        $location.url("/dashboard");
                    }
                }
                var url = $location.$$url;
                url = url.split("/");

                if (url[1] && url[1] === 'courses') {
                    if ($scope.listOfCourses[url[2] - 1]) {
                        $scope.courseNowChange($scope.listOfCourses[url[2] - 1]._id);
                        if (url[3]) {
                            $scope.moduleNowChange($scope.courseNowChanged.modules[url[3] - 1]._id);
                            if (url[5]) {
                                var sectionUrl = url[4].split(".");
                                var unitUrl = url[5].split(".");
                                $scope.unitNowChange($scope.showUnitsList($scope.moduleNowChanged.sections[sectionUrl[1] - 1].specialId)[unitUrl[2] - 1].unitId, $scope.moduleNowChanged.sections[sectionUrl[1] - 1].specialId);
                            }
                            if (url[5] && url[1] === 'complete') {
                                // console.log("dsdasdasdsd");
                            }
                        }
                    }
                }
            }
        });


    }

    initTab();
    courseEdit.initTab = initTab;


    /*************method of change course module section unit****************/




    $scope.courseNowChange = function (id) {

        $scope.dangerModule = [];
        $scope.dangerUnit = {};
        $scope.dangerSection = [];
        if ($scope.listOfCourses) {
            for (var i = 0; i < $scope.listOfCourses.length; i++) {
                if ($scope.listOfCourses[i]._id === id) {
                    $scope.courseNowChanged = $scope.listOfCourses[i];
                    $scope.positionInCourse.course = i + 1;
                    $scope.background = {'background-image': 'url(' + $scope.courseNowChanged.img + ')'};
                    $scope.moduleNowChanged = "";
                    $state.go('course', {courseTitle: $scope.positionInCourse.course}).then(function () {
                        var drawingCanvas = document.getElementById('canvasMap');
                        var point = [];
                        for (var i = 0; i < $scope.courseNowChanged.modules.length; i++) {
                            point[i] = $scope.courseNowChanged.modules[i].map;
                        }
                        if (drawingCanvas && drawingCanvas.getContext) {
                            var context = drawingCanvas.getContext('2d');
                            $(drawingCanvas).prop('width', 900);
                            $(drawingCanvas).prop('height', 600);
                            context.strokeStyle = "red";


                            for (var j = 1; j < $scope.courseNowChanged.modules.length; j++) {
                                // console.log()
                                if ($scope.markOfCompleteModule($scope.courseNowChanged.modules[j - 1]._id)) {
                                    if ($scope.markOfCompleteModule($scope.courseNowChanged.modules[j - 1]._id).color === "green") {
                                        context.strokeStyle = "green";
                                    }
                                } else {
                                    context.strokeStyle = "red";
                                }

                                context.beginPath();
                                context.moveTo(point[j - 1].left - 21, point[j - 1].top + 65);
                                /*context.bezierCurveTo(
                                 point[j-1].left-21,Math.abs(point[j].top-21+point[j-1].top+65),
                                 Math.abs(point[j].left-21+point[j-1].left+65)/2,Math.abs(point[j].top-21+point[j-1].top+65)/2,
                                 point[j].left-21,point[j].top+65);*/
                                // context.quadraticCurveTo(point[j].left-21+point[j-1].left+65, point[j].top-21+point[j-1].top+65,  point[j].left-21,point[j].top+65);
                                context.lineTo(point[j].left - 21, point[j].top + 65);
                                context.lineWidth = 3;
                                context.setLineDash([6, 4])
                                context.stroke();
                            }
                        }
                    });
                    return;
                }
            }
        }


    };
    $scope.moduleNowChange = function (id) {

        if ($scope.dangerModule.indexOf(id) > 0) {
            alert("you must complete the previous module");
            return;
        }
        for (var i = 0; i < $scope.courseNowChanged.modules.length; i++) {
            if ($scope.courseNowChanged.modules[i]._id === id) {
                $scope.moduleNowChanged = $scope.courseNowChanged.modules[i];

                $scope.positionInCourse.module = i + 1;
                $state.go("modules", {courseTitle: $scope.positionInCourse.course, moduleTitle: $scope.positionInCourse.module});
                $scope.dangerUnit = {};
                $scope.dangerSection = [];
            }
        }

    };

    $scope.unitNowChange = function (id, specialId) {
        if ($scope.dangerSection) {
            if ($scope.dangerSection.indexOf(specialId) > 0) {
                alert("you must complete the previous section");
                return;
            }
        }
        if ($scope.dangerUnit[specialId]) {
            if ($scope.dangerUnit[specialId].indexOf(id) > 0) {
                alert("you must complete the previous lesson");
                return;
            }
        }

        $scope.addQuestionFlag = false;
        $scope.progress.red = {};
        $scope.progress.orange = {};
        $scope.progress.green = {};

        for (var i = 0; i < $scope.listOfUnits.length; i++) {

            if ($scope.listOfUnits[i].unitId === id) {
                $scope.unitNowChanged = $scope.listOfUnits[i];


                for (var j = 0; j < $scope.moduleNowChanged.sections.length; j++) {
                    if ($scope.moduleNowChanged.sections[j].specialId === $scope.unitNowChanged.parent) {
                        $scope.sectionNowChanged = $scope.moduleNowChanged.sections[j];


                        $scope.positionInCourse.section = j + 1;

                        var mass = $scope.showUnitsList($scope.sectionNowChanged.specialId);
                        for (var t = 0; t < mass.length; t++) {
                            if (mass[t].unitId === $scope.unitNowChanged.unitId) {
                                $scope.positionInCourse.unit = t + 1;
                                // console.log($scope.positionInCourse.unit)
                            }
                        }

                        courseEdit.positionInCourse = $scope.positionInCourse;
                        $scope.calculateTotalProgress($scope.totalSectionPoint($scope.sectionNowChanged.specialId), courseEdit.userdata.progress, $scope.sectionNowChanged.specialId);

                    }
                }
                courseEdit.unitNowChanged = $scope.unitNowChanged;

                /* if (courseEdit.listOfBadges && courseEdit.userdata) {
                 courseEdit.userHasBadge(courseEdit.listOfBadges[0], courseEdit.userdata);
                 }*/


                $state.go('unit', {
                    courseTitle: courseEdit.positionInCourse.course,
                    moduleTitle: courseEdit.positionInCourse.module,
                    sectionTitle: courseEdit.positionInCourse.module + "." + courseEdit.positionInCourse.section,
                    unitTitle: courseEdit.positionInCourse.module + "." + courseEdit.positionInCourse.section + "." + courseEdit.positionInCourse.unit
                }).then(function () {
                    setTimeout(function getEl() {
                        if ($scope.unitNowChanged.lims[0].typeLim === "video") {
                            var url = $scope.unitNowChanged.lims[0].content[0];
                            url = "http:" + url + "?enablejsapi=1&playerapiid=ytplayer";
                            var params = { allowScriptAccess: "always", wmode: "transparent"};
                            var atts = { id: "myytplayer" };
                            swfobject.embedSWF(url, "lessonVideoPlayer", "425", "356", "8", null, null, params, atts);
                        }
                    }, 1);
                    if ($scope.unitNowChanged.lims[0].typeLim === "quiz") {

                        var answerObj = [];
                        // _.extend(answerObj,$scope.unitNowChanged.lims[0].content[0].quiz);
                        for (var i = 0; i < $scope.unitNowChanged.lims[0].content[0].quiz.length; i++) {
                            var obj = {};
                            _.extend(obj, $scope.unitNowChanged.lims[0].content[0].quiz[i]);
                            answerObj.push(obj);
                            $scope.unitNowChanged.lims[0].content[0].quiz[i].answer = "";
                        }
                        //console.log(answerObj, $scope.unitNowChanged.lims[0].content[0].quiz)

                        $scope.checkQuiz = function () {
                            for (var i = 0; i < $scope.unitNowChanged.lims[0].content[0].quiz.length; i++) {

                                if (answerObj[i].answer !== $scope.unitNowChanged.lims[0].content[0].quiz[i].answer) {

                                    return;
                                }
                            }
                            //courseEdit.userHasBadge(courseEdit.listOfBadges[1], courseEdit.userdata);
                            $scope.saveProgress($scope.unitNowChanged.unitId);
                        };
                    }
                    if ($scope.unitNowChanged.lims[0].typeLim === "static") {
                        $scope.saveProgress($scope.unitNowChanged.unitId);
                        //console.log('vupolnil');
                    }
                });
                refresh();
                return;
            }
        }

    };


    $scope.startModule = function () {
        if ($scope.moduleNowChanged) {
            var id = $scope.moduleNowChanged.sections[0].specialId;
            var massUnit = $scope.showUnitsList(id);
            $scope.unitNowChange(massUnit[0].unitId, id);
        }

    };

    /*** calculate point and progress****/

    $scope.totalPointsOfAllCourse = function (list) {
        //console.log(list)
        var totalPoints = 0;
        if(list){
            for (var i = 0; i < list.length; i++) {
                if (list[i].lims[0]) {

                    if (!list[i].lims[0].points) {
                        list[i].lims[0].points = 0;
                    }
                } else {
                    totalPoints += 0;
                    continue;
                }
                totalPoints += $scope.listOfUnits[i].lims[0].points;
            }
            return totalPoints;
        }

    };
    courseEdit.totalPointsOfAllCourse = $scope.totalPointsOfAllCourse;

    $scope.totalSectionPoint = function (sectionId) {
        var totalPoints = 0;
        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            if ($scope.listOfUnits[i].parent === sectionId) {
                if (!$scope.listOfUnits[i].lims[0].points) {
                    $scope.listOfUnits[i].lims[0].points = 0;
                }
                totalPoints += $scope.listOfUnits[i].lims[0].points;
            }
        }
        return totalPoints;
    };
    $scope.saveProgress = function (unitId) {
        if (!courseEdit.userdata) {
            return;
        }
        if (courseEdit.userdata.progress.indexOf(unitId) === (-1)) {
            $http.post("/progress", [courseEdit.userdata._id, unitId]).success(function (num) {
                courseEdit.reqUser(function () {

                    $scope.calculateTotalProgress($scope.totalSectionPoint($scope.sectionNowChanged.specialId), courseEdit.userdata.progress, $scope.sectionNowChanged.specialId);
                });
            });
        }
    };
    $scope.calculateTotalProgress = function (totalPoints, userProgress, secionId) {
        if (!courseEdit.userdata) {
            return;
        }
        var realpointsOfSection = 0;
        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            if (userProgress.indexOf($scope.listOfUnits[i].unitId) !== (-1) && $scope.listOfUnits[i].parent === secionId) {
                realpointsOfSection += $scope.listOfUnits[i].lims[0].points;
            }
        }
        courseEdit.realpointsOfSection = realpointsOfSection;
        var percentage = realpointsOfSection / totalPoints;

        if (percentage >= 0 && percentage < 0.4) {
            $scope.progress.red = {width: percentage * 100 + "%"};
            $scope.progress.orange = {width: 0 + "%"};
            $scope.progress.green = {width: 0 + "%"};
        }
        if (percentage >= 0.4 && percentage < 0.8) {
            $scope.progress.red = {width: 40 + "%"};
            $scope.progress.orange = {width: percentage * 100 - 40 + "%"};
            $scope.progress.green = {width: 0 + "%"};
        }
        if (percentage >= 0.8 && percentage <= 1) {
            $scope.progress.red = {width: 40 + "%"};
            $scope.progress.orange = {width: 40 + "%"};
            $scope.progress.green = {width: percentage * 100 - 80 + "%"};
        }
    };
    $scope.returnProgress = function () {
        return [$scope.progress.red, $scope.progress.orange, $scope.progress.green];
    };


    /***********mark of complite unit section modules*****************/
    $scope.dangerUnit = {};
    $scope.markOfCompleteUnit = function (unitId, sectionId) {
        var unitArr = [];
        if ($scope) {
            for (var i = 0; i < $scope.showUnitsList(sectionId).length; i++) {
                unitArr.push($scope.showUnitsList(sectionId)[i].unitId);
            }
        }

        if ($scope.dangerUnit[sectionId] === undefined) {
            $scope.dangerUnit[sectionId] = unitArr;
        }
        if (!courseEdit.userdata) {
            return;
        }

        if ($scope.unitNowChanged !== undefined && unitId === $scope.unitNowChanged.unitId) {

            if ($state.current.name === 'completeSection') {
                return "complete";
            }
            if (courseEdit.userdata.progress.indexOf(unitId) !== (-1)) {
                if ($scope.dangerUnit[sectionId].indexOf(unitId) !== (-1)) {
                    var index = $scope.dangerUnit[sectionId].indexOf(unitId);
                    $scope.dangerUnit[sectionId].splice(index, 1);

                }
                return "curentactive";
            }
            return "active";
        }
        if (courseEdit.userdata.progress.indexOf(unitId) !== (-1)) {
            if ($scope.dangerUnit[sectionId].indexOf(unitId) !== (-1)) {
                var index = $scope.dangerUnit[sectionId].indexOf(unitId);
                $scope.dangerUnit[sectionId].splice(index, 1);

            }
            return "complete";
        }
    };

    $scope.dangerSection = [];
    $scope.markOfCompleteSection = function (sectionId) {
        var sectionArr = [];
        if ($scope.moduleNowChanged) {
            for (var i = 0; i < $scope.moduleNowChanged.sections.length; i++) {
                sectionArr.push($scope.moduleNowChanged.sections[i].specialId);
            }
            if ($scope.dangerSection.length === 0) {
                $scope.dangerSection = sectionArr;
            }
        }
        if (!courseEdit.userdata) {
            return;
        }
        if ($scope.listOfUnits) {
            for (var j = 0; j < $scope.listOfUnits.length; j++) {
                if ($scope.listOfUnits[j].parent === sectionId) {
                    if (courseEdit.userdata.progress.indexOf($scope.listOfUnits[j].unitId) === (-1)) {
                        return " ";
                    }

                }
            }
        }

        if ($scope.dangerSection.indexOf(sectionId) !== (-1)) {
            var index = $scope.dangerSection.indexOf(sectionId);
            $scope.dangerSection.splice(index, 1);
        }
        if ($state.current.name === 'unit') {
            return " ";
        }
        return "complete";

    };
    $scope.dangerModule = [];
    $scope.markOfCompleteModule = function (id) {
        var moduleArr = [];
        if ($scope.courseNowChanged) {
            for (var i = 0; i < $scope.courseNowChanged.modules.length; i++) {
                moduleArr.push($scope.courseNowChanged.modules[i]._id);
            }
            if ($scope.dangerModule.length === 0) {
                $scope.dangerModule = moduleArr;
            }
        }
        if (!courseEdit.userdata || !$scope.courseNowChanged) {
            return;
        }
        for (var j = 0; j < $scope.courseNowChanged.modules.length; j++) {
            if ($scope.courseNowChanged.modules[j]._id === id) {
                if ($scope.courseNowChanged.modules[j]._id === $scope.moduleNowChanged._id) {
                    return {'color': 'orange'};
                }
                for (var l = 0; l < $scope.courseNowChanged.modules[j].sections.length; l++) {
                    if ($scope.markOfCompleteSection($scope.courseNowChanged.modules[j].sections[l].specialId) !== "complete") {
                        return;
                    }
                }
            }
        }
        if ($scope.dangerModule.indexOf(id) !== (-1)) {
            var index = $scope.dangerModule.indexOf(id);
            $scope.dangerModule.splice(index, 1);
        }
        if (courseEdit.listOfBadges && courseEdit.userdata) {
            courseEdit.userHasBadge(courseEdit.listOfBadges[0], courseEdit.userdata);
        }
        return {'color': 'green'};
    };

    /********logic of complete unit************/



    $scope.unitNext = function (unit) {

        for (var i = 0; i < $scope.showUnitsList(unit.parent).length; i++) {
            if (unit.unitId === $scope.showUnitsList(unit.parent)[i].unitId) {

                if ($scope.showUnitsList(unit.parent)[i + 1] === undefined) {

                    for (var j = 0; j < $scope.moduleNowChanged.sections.length; j++) {
                        if ($scope.moduleNowChanged.sections[j].specialId === unit.parent) {
                            //console.log("na sled section", $scope.moduleNowChanged.sections[j + 1]);
                            if ($scope.moduleNowChanged.sections[j + 1] === undefined) {
                                $scope.nextSection = null;
                                $state.go('completeSection', {
                                    courseTitle: courseEdit.positionInCourse.course,
                                    moduleTitle: courseEdit.positionInCourse.module,
                                    sectionTitle: courseEdit.positionInCourse.module + "." + courseEdit.positionInCourse.section
                                });

                                return;
                            }
                            $scope.nextUnitBe = $scope.showUnitsList($scope.moduleNowChanged.sections[j + 1].specialId)[0];
                            $scope.nextSection = $scope.moduleNowChanged.sections[j + 1];

                            $state.go('completeSection', {
                                courseTitle: courseEdit.positionInCourse.course,
                                moduleTitle: courseEdit.positionInCourse.module,
                                sectionTitle: courseEdit.positionInCourse.module + "." + courseEdit.positionInCourse.section
                            });

                        }
                    }
                    return;
                }

                $scope.unitNowChange($scope.showUnitsList(unit.parent)[i + 1].unitId, unit.parent);

                break;
            }

        }


    };

    $scope.stateNow = function () {

        if ($state.current.name === "unit" || $state.current.name === "completeSection") {
            return true;
        }
        return false;

    };
    $scope.goTocompleteMod = function () {
        $state.go("modulecomplete", {
            courseTitle: courseEdit.positionInCourse.course,
            moduleTitle: courseEdit.positionInCourse.module
        });
    };

    $scope.nextFinish = function (id) {
        var arr = $scope.showUnitsList(id);
        if ($scope.unitNowChanged.unitId === arr[arr.length - 1].unitId) {
            return true;
        }
        return false;
    };


    /****************video controll and registrate*******************/

    function onYouTubePlayerReady(playerId) {
        var ytplayer = document.getElementById("myytplayer");
        ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
    }

    function onytplayerStateChange(newState) {
        if (newState === 0) {
            //courseEdit.userHasBadge(courseEdit.listOfBadges[2], courseEdit.userdata);
            $scope.saveProgress($scope.unitNowChanged.unitId);
        }
    }

    window.onYouTubePlayerReady = onYouTubePlayerReady;
    window.onytplayerStateChange = onytplayerStateChange;

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
    //*********************************************************

    $scope.glued = true;
    /*CODE QUEST*/

    //**********************ACE********************
    $scope.modes = ['html', 'css'];
    $scope.mode = $scope.modes[0];
    $scope.aceOption = {
        mode: $scope.mode.toLowerCase(),
        onLoad: function (_ace) {
            $scope.modeChanged = function () {
                _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
            };
        },
        onChange: function (text, _ace) {
            document.getElementById('preview').innerHTML = _ace.getSession().getValue();
        }
    };
    $scope.loadEx = function (html) {
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


    function refresh(num) {
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&amp/g, "&;")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
        }

        num = num || 1;
        $scope.lessonId = num;
        if (isNaN($scope.lessonId)) {
            $scope.lessonId = $scope.lessons[num] && $scope.lessons[num].id;
        }
        if ($scope.lessonId > 5) {
            //$location.path("/lessons/1");
        }
        if ($scope.unitNowChanged && $scope.unitNowChanged.lims[0].typeLim === "code quest") {
            for (var i = 0; i < $scope.unitNowChanged.lims[0].content[0].levels.length; i++) {
                if ($scope.lessonId === $scope.unitNowChanged.lims[0].content[0].levels[i].id) {
                    $scope.lesson = $scope.unitNowChanged.lims[0].content[0].levels[i];

                    $scope.messages = [];
                    $scope.messages.push({text: $sce.trustAsHtml(escapeHtml($scope.lesson.description)), class: ''});
                    $scope.unitNowChanged.lims[0].content[0].levels[i].isCurrent = true;
                }
                if ($scope.lessonId > $scope.unitNowChanged.lims[0].content[0].levels[i].id) {
                    $scope.unitNowChanged.lims[0].content[0].levels[i].isActive = true;
                    $scope.unitNowChanged.lims[0].content[0].levels[i].isCurrent = false;
                }
            }
        }
    }

    refresh(1);
    $scope.btnText = 'Check';
    var test = 1;
    var next = false;


    $scope.check = function () {
        if (next) {
            //console.log("next")
            refresh($scope.lessonId + 1);
            return;
            //$location.path("/lessons/" + ($scope.lessonId + 1));
        }
        function completeLess() {
            $scope.messages.push({text: $scope.lesson.correct, class: 'correct'});
            next = true;
            $scope.btnText = 'Next';
        }

        switch ($scope.lesson.id) {
            case 1:
                var title = $('#preview title').html();
                if (title === undefined || $scope.lesson.tests[test].check === title) {
                    $scope.messages.push({text: $scope.lesson.tests[test].error, class: 'incorrect'});
                    test = 2;
                } else {
                    completeLess();
                }
                break;
            case 2:
                var h1 = $('#preview h1')[0];
                var h2_6 = $('#preview h2, #preview h3, #preview h4, #preview h5, #preview h6')[0];
                if (h1 || h2_6 === undefined) {
                    $scope.messages.push({text: $scope.lesson.tests[1].error, class: 'incorrect'});
                    break;
                }
                var p = $('#preview p').html();
                var b = $('#preview p b').html();
                var orig_p = $scope.lesson.tests[2].check[1];
                var orig_b = $scope.lesson.tests[2].check[2];
                if (p !== undefined && b !== undefined) {
                    if (p === orig_p || b === orig_b) {
                        $scope.messages.push({text: $scope.lesson.tests[2].error, class: 'incorrect'});
                        break;
                    }
                }
                completeLess();
                break;
            case 3:
                var img = $('#preview img').attr('src');
                if (img === undefined || $scope.lesson.tests[1].check !== img) {
                    $scope.messages.push({text: $scope.lesson.tests[1].error, class: 'incorrect'});
                } else {
                    completeLess();
                }
                break;
            case 4:
                var olCount = $('#preview ol li').length;
                var ulCount = $('#preview ul li').length;
                if (olCount < 4 || ulCount < 4) {
                    $scope.messages.push({text: $scope.lesson.tests[1].error, class: 'incorrect'});
                } else {
                    completeLess();
                }
                break;
            case 5:
                completeLess();
                break;
            default:
                break;
        }
    };

    /***************logic click on map**********************************************/


    $scope.mapModule = function () {

        $scope.courseNowChange($scope.courseNowChanged._id);
    };
    $scope.showAddQuestion = function () {

        if (!$scope.addQuestionFlag) {
            $scope.addQuestionFlag = true;
            return;
        }
        $scope.addQuestionFlag = false;
        return;
    };

    /************************************COMMUNITY and FILTERS***********************************************/

    $scope.goToCommunity = function () {

        $state.go('posts').then(function () {

            $location.url("/post/all?type=allposts");

        });
    };
    $scope.goToCourse = function () {
        $state.go('courses').then(function () {
        });
    };
    $scope.ifCommunity = function () {

        switch ($location.search().type) {
            case "allposts":
                return false;

            case "questions":
                return false;

            case "myposts":
                return false;

            case "myquestions":
                return false;

            case "tags":
                return false;

            case "text":
                return false;
            case "notifypost":
                return false;
            case "popular":
                return false;

        }
        return true;


    };


    $scope.searchType = ['All Posts', 'My Posts', 'My Questions', 'Only Questions', 'Popular'];
    $scope.search = {
        type: "All Posts"
    };
    $scope.typeSearch = function (type, data) {
        $scope.search = {
            type: type
        };
        $scope.postFilter(data);

    };

    $scope.postFilter = function (user, typeData) {
        var searchObj = {};
        typeData = typeData || $scope.search.type;
        switch (typeData) {
            case 'All Posts':
                searchObj.type = 'allposts';
                break;
            case 'My Posts':
                searchObj.type = 'myposts';
                searchObj.creator = user._id;
                break;
            case 'My Questions':
                searchObj.type = 'myquestions';
                searchObj.creator = user._id;
                searchObj.typePost = "question";
                break;
            case 'Only Questions':
                searchObj.type = 'questions';
                searchObj.typePost = "question";
                break;
            case 'Only Posts':
                searchObj.type = 'onlyposts';
                searchObj.creator = user._id;
                break;
            case 'notifypost':
                searchObj.type = 'notifypost';
                searchObj.post = $scope.number;
                break;
            case 'Popular':
                searchObj.type = 'popular';
                break;
        }
        courseEdit.searchPosts(searchObj);
    };

    $scope.textOfSearch = {text: ""};
    $scope.textSearch = function () {
        var searchObj = {};
        searchObj.type = 'text';
        searchObj.text = $scope.textOfSearch.text;
        courseEdit.searchPosts(searchObj);
    };


    /***********************************************************************************/


    $scope.pointsCalculate = function (userProgresArr) {
        var count = 0;
        if ($scope.listOfUnits !== undefined) {
            for (var i = 0; i < $scope.listOfUnits.length; i++) {
                if (userProgresArr.indexOf($scope.listOfUnits[i].unitId) !== (-1)) {
                    count = count + $scope.listOfUnits[i].lims[0].points;
                }
            }
        }

        return count;
    };
    courseEdit.pointsCalculate = $scope.pointsCalculate;


    $scope.eqvalBadges = function (badge) {
        if (courseEdit.userdata.badges && courseEdit.listOfBadges&&badge) {
        /*    $scope.countBadges = 0;
            for (var i = 0; i < courseEdit.userdata.badges.length; i++) {
                $scope.countBadges++;
                if (courseEdit.listOfBadges[courseEdit.userdata.badges[i]]) {
                    courseEdit.listOfBadges[courseEdit.userdata.badges[i]].opasity = {"opacity": 1};
                }

            }*/
            //console.log(badge)
            if(courseEdit.userdata.badges.indexOf(badge.badgeId)!==(-1)){
                return true;
            }
            return false;

        }

    };
    courseEdit.eqvalBadges = $scope.eqvalBadges;


    /*************icon of the lessons***************/
    $scope.faUnitClass = function (type) {
        if (type === "video") {
            return "fa fa-film";
        }
        if (type === "quiz") {
            return "fa fa-question";
        }
        if (type === "static") {
            return "fa fa-pencil";
        }
        if (type === "code quest") {
            return "fa fa-file-code-o";
        }
        if (type === undefined) {
            return "fa fa-pencil";
        }
    };
    $scope.showQuestionBlock = false;
    $scope.showBlockQuestion = function (bool) {
        $scope.showQuestionBlock = bool;
    };

    /******************************notify logic**************************************************/

    var notifymass = [];
    $http.get("/user/notify").success(function (data) {
        //console.log(data)
        if (typeof data !== 'string') {
            for (var i = 0; i < data.data.length; i++) {
                //  console.log(data.data[i].user === courseEdit.userdata._id)
                if (data.data[i].user === courseEdit.userdata._id) {
                    notifymass = data.data[i].content;
                    $scope.notification = notifymass;
                    return;
                }
            }
            $scope.notification = notifymass;
        }
    });

    var socket = io();
    socket.on("notify", function (data) {
        if(data.notify&& data.creatorOfPost === courseEdit.userdata._id){
            //console.log("notify",data.creatorComment);
            notifymass.push(data);
            $scope.$apply();
            return;
        }
        if (data.hasOwnProperty("type") && data.creatorOfPost === courseEdit.userdata._id && data.creatorComment !== data.creatorOfPost) {
            console.log(data)
            notifymass.push(data);
            $scope.$apply();
        }
        socket.emit('my other event', { my: 'data' });
    });

    $scope.clickNotify = function (notify) {
        for (var i = 0; i < $scope.notification.length; i++) {
            if (notify.notifyId === $scope.notification[i].notifyId) {
                $scope.number = $scope.notification[i].postId;
                $scope.notification.splice(i, 1);
                $http.post("/notify/delete", [notify, $scope.notification]).success(function () {
                    $state.go('refresh').then(function () {
                        $state.go('posts').then(function () {
                            $location.url("/post/all?type=notifypost&post=" + $scope.number);

                        });
                    });
                });
            }
        }
    };
    $scope.httpUsersList = function () {
        $http.get('/users').success(function (data) {

            $scope.listOfUsers = data;
            // console.log("$scope.listOfUsers",$scope.listOfUsers)
        });
    };
    $scope.httpUsersList();
    $scope.howIsThis = function (id) {

        if ($scope.listOfUsers) {
            for (var i = 0; i < $scope.listOfUsers.length; i++) {
                if ($scope.listOfUsers[i]._id === id) {
                    return $scope.listOfUsers[i];
                }
            }
        }
    };

    /**************************Profile edition******************************************/

    $scope.editionType = {};
    $scope.editionType.type = false;
    $scope.showProfileEdition = function (bool) {
        setTimeout(function () {
            $scope.editionType.type = !$scope.editionType.type;
            $scope.$apply();

            /*$("#inputUser").onchange(function(event){
                console.log(event)
            })*/
            var inputUser= $("#inputUser")

            inputUser.bind("change",function(event){
                console.log("asdasdsd")
                console.log(event,event.currentTarget.files[0])
                var file = event.currentTarget.files[0];
                var formData = new FormData();
                formData.append("userfile", file);
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('load', function () {
                    courseEdit.reqUser();
                    courseEdit.reqPosts();
                    courseEdit.reqUsers();
                    console.log("Sdaasdsd")
                    photoDropZone.html("uploaded");

                }, false)
                xhr.open("POST", "/user/upload", true);
                xhr.send(formData);
            })
            var photoDropZone = $('#photoDropZone');
            if (typeof(window.FileReader) == 'undefined') {
                photoDropZone.text('Не поддерживается браузером!');
                photoDropZone.addClass('error');
            }
            var photoArea = document.getElementById("photoDropZone")
            photoArea.ondragover = function () {
                photoDropZone.addClass('hover');
                return false;
            };
            photoArea.ondragleave = function () {
                photoDropZone.removeClass('hover');
                return false;
            };
            photoArea.ondrop = function (event) {
                event.preventDefault();
                photoDropZone.removeClass('hover');
                photoDropZone.addClass('drop');
                var file = event.dataTransfer.files[0];
                var formData = new FormData();
                formData.append("userfile", file);
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('load', function () {
                    courseEdit.reqUser();
                    courseEdit.reqPosts();
                    courseEdit.reqUsers();
                    console.log("Sdaasdsd")
                    photoDropZone.html("uploaded");

                }, false)
                xhr.open("POST", "/user/upload", true);
                xhr.send(formData);


            };


        }, 25);




    };

    $scope.menuOpen=false;

    setInterval(function(){
        if($("#menuUser").hasClass("open")){
            $scope.menuOpen=true;
            $scope.$apply();
            return;
        }
        $scope.menuOpen=false;
        $scope.$apply();
    },100)
});