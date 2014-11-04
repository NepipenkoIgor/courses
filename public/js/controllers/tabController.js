/**
 * Created by igor on 7/1/14.
 */


app.controller('maintab', function ($scope, $http, $state, $sce, $stateParams, $location, $window, $timeout, $modal, $log, courseEdit, toaster) {
    'user strict';


    $("#blockwindow").hide();
    $scope.userNowView = {};
    $scope.positionInCourse = {};
    $scope.progress = {};
    $(".postLoad").hide();


    /*********** initial tab*-*****************/
    function initTab() {

        $http.get('/courses').success(function (courses) {
            $scope.listOfBadges = [
                {

                    "badgeId": 0,
                    'name': 'Make a post',
                    'img': 'img/badges/first.png',
                    'description': 'First Post'
                },
                {

                    "badgeId": 1,
                    'name': 'Ask a question',
                    'img': 'img/badges/first.png',
                    'description': 'First Question'
                },
                {
                    "badgeId": 2,
                    'name': '50 Answers',
                    'img': 'img/badges/answer.png',
                    'description': 'Helper'
                },
                {
                    "badgeId": 3,
                    'name': '50 Comments',
                    'img': 'img/badges/answer.png',
                    'description': 'Active'
                },
                {

                    "badgeId": 4,
                    'name': '50 questions',
                    'img': 'img/badges/answer.png',
                    'description': 'Curious'
                },
                {
                    "badgeId": 5,
                    'name': '100 Answers',
                    'img': 'img/badges/answer.png',
                    'description': 'Guru'
                },
                {
                    "badgeId": 6,
                    'name': '100 posts',
                    'img': 'img/badges/answer.png',
                    'description': 'Conversation King'
                },
                {

                    "badgeId": 7,
                    'name': '100 questions',
                    'img': 'img/badges/answer.png',
                    'description': 'Inquisitor'
                },
                {
                    "badgeId": 8,
                    'name': '100 Comments',
                    'img': 'img/badges/answer.png',
                    'description': 'Active+'
                }

            ];
            courseEdit.listOfBadges = $scope.listOfBadges;
            $scope.listOfCourses = courses;
            courseEdit.listOfCourses = $scope.listOfCourses;
            if (typeof $scope.listOfCourses !== 'string') {
                for (var i = 0; i < $scope.listOfCourses.length; i++) {
                    for (var j = 0; j < $scope.listOfCourses[i].modules.length; j++) {
                        var badge = {
                            "badgeId": 9 + j,
                            'name': 'Complete Module',
                            'img': 'img/badges/download.png',
                            'description': 'module ' + (j + 1)
                        };
                        courseEdit.listOfBadges.push(badge);

                    }
                }
            }
            $scope.eqvalBadges = function (user) {
                // $scope.countBadge
                if (courseEdit.userdata) {
                    var user = user || courseEdit.userdata;
                    if (user.badges && courseEdit.listOfBadges) {
                        var trueBadge = [];
                        for (var i = 0; i < user.badges.length; i++) {
                            for (var j = 0; j < courseEdit.listOfBadges.length; j++) {
                                if (user.badges[i] === courseEdit.listOfBadges[j].badgeId) {
                                    trueBadge.push(courseEdit.listOfBadges[j]);
                                }
                            }
                        }

                        return trueBadge;

                    }

                }
            };

            courseEdit.eqvalBadges = $scope.eqvalBadges;
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
            courseEdit.showUnitsList = $scope.showUnitsList;

            /**************some rout logic***********************/

            if (courseEdit.userdata) {
                if ($location.$$path.split("/")[1] === 'adminlab' && courseEdit.userdata) {
                    if (!courseEdit.userdata.position) {
                        $location.url("/dashboard");
                    }
                }
                var url = $location.$$url;
                url = url.split("/");

                if (url[1] && url[1] === 'courses' && url[5] !== "complete") {

                    if ($scope.listOfCourses[url[2] - 1]) {
                        $scope.courseNowChange($scope.listOfCourses[url[2] - 1]._id);
                        if (url[3]) {
                            if ($scope.courseNowChanged.modules[url[3] - 1]) {

                                if ((url[3] - 2) !== (-1)) {
                                    //console.log("next modules")
                                    $scope.moduleNowChange($scope.courseNowChanged.modules[url[3] - 2]._id);
                                    var id = $scope.moduleNowChanged.sections[$scope.moduleNowChanged.sections.length - 1].specialId
                                    var mass = $scope.showUnitsList(id)
                                    if (courseEdit.userdata.progress.indexOf(mass[mass.length - 1].unitId) === (-1)) {

                                        $scope.courseNowChange($scope.listOfCourses[url[2] - 1]._id);
                                        return;
                                    }
                                    $scope.moduleNowChange($scope.courseNowChanged.modules[url[3] - 1]._id);
                                } else {
                                    $scope.moduleNowChange($scope.courseNowChanged.modules[url[3] - 1]._id);
                                }

                                if (url[5]) {
                                    var sectionUrl = url[4].split(".");
                                    var unitUrl = url[5].split(".");
                                    var sectionNowId = $scope.moduleNowChanged.sections[sectionUrl[1] - 1].specialId;
                                    var arrUnitsNow = $scope.showUnitsList(sectionNowId);

                                    if ((unitUrl[2] - 2) === (-1)) {

                                        if ((sectionUrl[1] - 2) !== (-1)) {
                                            var sectionBeforeId = $scope.moduleNowChanged.sections[sectionUrl[1] - 2].specialId;
                                            var arrUnitBefore = $scope.showUnitsList(sectionBeforeId);

                                            if (courseEdit.userdata.progress.indexOf(arrUnitBefore[arrUnitBefore.length - 1].unitId) === (-1)) {

                                                $scope.unitNowChange(arrUnitBefore[arrUnitBefore.length - 1].unitId, sectionBeforeId);
                                                return;
                                            }
                                        }
                                        $scope.unitNowChange(arrUnitsNow[unitUrl[2] - 1].unitId, sectionNowId);
                                    } else {

                                        if ($scope.moduleNowChanged.sections[sectionUrl[1] - 1] && arrUnitsNow[unitUrl[2] - 1]) {
                                            if (courseEdit.userdata.progress.indexOf(arrUnitsNow[unitUrl[2] - 2].unitId) !== (-1)) {
                                                $scope.unitNowChange(arrUnitsNow[unitUrl[2] - 1].unitId, sectionNowId);
                                            } else {
                                                // $state.go("404");
                                            }
                                        } else {
                                            $state.go("404");
                                        }
                                    }
                                }
                            } else {
                                $state.go("404");
                            }
                        }
                    } else {
                        $state.go("404");
                    }
                }
                if (url[5] === "complete") {
                    console.log("asdasdasd")
                }
            }
        });


    }

    initTab();
    courseEdit.initTab = initTab;


    /*************method of change course module section unit****************/


    $scope.saveCurrentUnit = function (unit, specialId, courseId, moduleId, title, position) {
        //console.log(unit, specialId, courseId, moduleId);
        var data = {
            id: courseEdit.userdata._id,
            unit: unit,
            specialId: specialId,
            courseId: courseId,
            moduleId: moduleId,
            title: title,
            position: position
        };
        $http.post("/curentlesson", data).success(function (data) {

        });
    };

    $scope.watchCurentUnit = function () {
        courseEdit.reqUser(function () {
            // console.log(courseEdit.userdata.currentLesson);
            if (courseEdit.userdata.currentLesson) {
                $scope.currentLesson = parseInt(courseEdit.userdata.currentLesson.unit);
                $scope.currentSection = parseInt(courseEdit.userdata.currentLesson.specialId);
                $scope.currentCourse = courseEdit.userdata.currentLesson.courseId;
                $scope.currentModule = courseEdit.userdata.currentLesson.moduleId;
                //console.log($scope.currentModule)
                $scope.currentUnitTitle = courseEdit.userdata.currentLesson.title;
                $scope.currentUnitPosition = courseEdit.userdata.currentLesson.position;
            }
        });
    };
    $scope.goToCurrentUnit = function () {
        // console.log($scope.currentModule)
        $scope.courseNowChange($scope.currentCourse, function () {
            $scope.moduleNowChange($scope.currentModule, function () {
                $scope.unitNowChange($scope.currentLesson, $scope.currentSection);
            });
        });
    };

    $scope.showNotifyOfCurrentUnit = function () {
        if (courseEdit.userdata && courseEdit.userdata.currentLesson) {

            if (courseEdit.userdata.progress.indexOf(parseInt(courseEdit.userdata.currentLesson.unit)) === (-1)) {
                return true;
            }
            return false;
        }
        return false;
    };

    $scope.courseNowChange = function (id, cb) {
        $scope.watchCurentUnit();
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
                    if (cb) {
                        cb();
                        return;
                    }
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
                                context.lineTo(point[j].left - 21, point[j].top + 65);
                                context.lineWidth = 3;
                                context.setLineDash([6, 4]);
                                context.stroke();
                            }
                        }
                    });
                    return;
                }
            }
        }


    };
    courseEdit.courseNowChange = $scope.courseNowChange;


    $scope.moduleNowChange = function (id, cb) {

        if ($scope.dangerModule.indexOf(id) > 0) {
            alert("you must complete the previous module");
            return;
        }
        for (var i = 0; i < $scope.courseNowChanged.modules.length; i++) {
            if ($scope.courseNowChanged.modules[i]._id === id) {
                $scope.moduleNowChanged = $scope.courseNowChanged.modules[i];

                $scope.positionInCourse.module = i + 1;
                $scope.dangerUnit = {};
                $scope.dangerSection = [];
                if (cb) {
                    cb();
                    return;
                }
                $state.go("modules", {
                    courseTitle: $scope.positionInCourse.course,
                    moduleTitle: $scope.positionInCourse.module
                });

            }
        }

    };
    courseEdit.moduleNowChange = $scope.moduleNowChange;


    $scope.unitNowChange = function (id, specialId) {
//console.log($scope.dangerSection)
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

                $state.go('unit', {
                    courseTitle: courseEdit.positionInCourse.course,
                    moduleTitle: courseEdit.positionInCourse.module,
                    sectionTitle: courseEdit.positionInCourse.module + "." + courseEdit.positionInCourse.section,
                    unitTitle: courseEdit.positionInCourse.module + "." + courseEdit.positionInCourse.section + "." + courseEdit.positionInCourse.unit
                }).then(function () {
                    setTimeout(function getEl() {
                        if ($scope.unitNowChanged.lims[0].typeLim === "video") {
                            var url = $scope.unitNowChanged.lims[0].content[0];
                            $scope.videoUrl=url

                            /*url = "http:" + url + "?enablejsapi=1&playerapiid=ytplayer";
                            var params = {allowScriptAccess: "always", wmode: "transparent"};
                            var atts = {id: "myytplayer"};
                            swfobject.embedSWF(url, "lessonVideoPlayer", "425", "356", "8", null, null, params, atts);*/
                            $scope.formatVideoUrl = function (url) {
                                return $sce.trustAsResourceUrl(url);
                            };
                            $scope.saveProgress($scope.unitNowChanged.unitId);
                        }
                        if ($scope.unitNowChanged.lims[0].typeLim === "code quest") {
                            var url = $scope.unitNowChanged.lims[0].content[0];
                            $scope.codeSource=url
                            $scope.formatSourceUrl = function (url) {
                                return $sce.trustAsResourceUrl(url);
                            };
                            $scope.saveProgress($scope.unitNowChanged.unitId);
                        }
                    }, 1);
                    if ($scope.unitNowChanged.lims[0].typeLim === "quiz") {

                        $scope.changeRadio = function (num) {
                            $scope.answerCheck = num;
                        };
                        $scope.checkQuiz = function (num) {

                            for (var i = 0; i < $scope.unitNowChanged.lims[0].content[0].quiz.length; i++) {

                                if ($scope.unitNowChanged.lims[0].content[0].quiz[i].answer !== true) {
                                    continue;
                                }
                                if ($scope.answerCheck === i) {
                                    //console.log("yes yes yes")
                                    $scope.saveProgress($scope.unitNowChanged.unitId);
                                    return;
                                }
                                // console.log("no")
                            }

                        };
                    }
                    if ($scope.unitNowChanged.lims[0].typeLim === "static") {
                        $scope.saveProgress($scope.unitNowChanged.unitId);
                    }
                    if ($state.current.name !== "course") {
                        $scope.saveCurrentUnit(id, specialId, $scope.courseNowChanged._id, $scope.moduleNowChanged._id, $scope.unitNowChanged.title,
                            $scope.positionInCourse.module + "." + $scope.positionInCourse.section + "." + $scope.positionInCourse.unit);
                    }
                });
                refresh();
                return;
            }
        }

    };
    courseEdit.unitNowChange = $scope.unitNowChange;

    $scope.startModule = function () {
        if ($scope.moduleNowChanged) {
            var id = $scope.moduleNowChanged.sections[0].specialId;
            var massUnit = $scope.showUnitsList(id);
            $scope.unitNowChange(massUnit[0].unitId, id);
        }

    };

    /*** calculate point and progress****/

    $scope.totalPointsOfAllCourse = function (list) {

        var totalPoints = 0;
        if (list) {
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
    $scope.popPoints = function (points) {
        toaster.pop('warning', "+" + points);
    };
    $scope.saveProgress = function (unitId) {
        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            if ($scope.listOfUnits[i].unitId === unitId) {

                $scope.popPoints($scope.listOfUnits[i].lims[0].points);
            }
        }

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
    $scope.markOfCompleteModule = function (id, modIndex) {
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
            // courseEdit.userHasBadge(courseEdit.listOfBadges[0], courseEdit.userdata);
        }

        // console.log(modIndex)
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

    /*function onYouTubePlayerReady(playerId) {
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
    window.onytplayerStateChange = onytplayerStateChange;*/

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


    /**************************CODE QUEST*********************************/

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
            refresh($scope.lessonId + 1);
            return;
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
        $scope.chengedSearchIcon = "Everything";
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
            case "date":
                return false;
        }
        return true;


    };

    $scope.ifCourse = function () {
        if ($location.$$url.split("/")[1] !== "courses") {
            return false;
        }
        return true;
    };

    $scope.searchType = ['Everything', 'My Posts', 'My Questions', 'All Questions', 'Popular'];
    $scope.search = {
        type: "All Posts"
    };
    $scope.typeSearch = function (type, data) {
        $scope.search = {
            type: type
        };
        $scope.postFilter(data);

    };

    $scope.clickSearchIcon = function (type) {
        $scope.chengedSearchIcon = type;
    };
    $scope.colorOfIcon = function (type) {
        if ($scope.chengedSearchIcon === type) {
            return {"color": "#A5A044"};
        }
        return {};
    };

    $scope.serachIcon = function (typeData) {
        var iconObj = {};
        typeData = typeData || $scope.search.type;
        switch (typeData) {
            case 'Everything':
                iconObj.first = 'fa fa-users fa-stack-1x';
                iconObj.second = 'fa fa-square-o fa-stack-1x';
                break;
            case 'My Posts':
                iconObj.first = 'fa fa-user fa-stack-1x';
                iconObj.second = 'fa fa-circle-o fa-stack-1x';
                break;
            case 'My Questions':
                iconObj.first = 'fa fa-question fa-stack-1x';
                iconObj.second = 'fa fa-circle-o fa-stack-1x';
                break;
            case 'All Questions':
                iconObj.first = 'fa fa-question fa-stack-1x';
                iconObj.second = 'fa fa-square-o fa-stack-1x';
                break;
            case 'Only Posts':
                iconObj.first = 'fa fa-users fa-stack-1x';
                iconObj.second = 'fa fa-square-o fa-stack-1x';
                break;
            case 'Popular':
                iconObj.first = 'fa fa-list fa-stack-1x';
                iconObj.second = 'fa  fa-square-o fa-stack-1x';
                break;
        }
        return iconObj;
    };

    $scope.postFilter = function (user, typeData) {
        var searchObj = {};
        typeData = typeData || $scope.search.type;
        switch (typeData) {
            case 'Everything':
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
            case 'All Questions':
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
                if (userProgresArr && userProgresArr.indexOf($scope.listOfUnits[i].unitId) !== (-1)) {
                    count = count + $scope.listOfUnits[i].lims[0].points;
                }
            }
        }

        return count;
    };
    courseEdit.pointsCalculate = $scope.pointsCalculate;


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
    $scope.getFromAllNotify = function () {
        var notifymass = [];
        $http.get("/user/notify").success(function (data) {
            $http.get('/user').success(function (dataUser) {
                // console.log(dataUser)
                if (typeof data !== 'string' && typeof dataUser !== 'string') {
                    for (var i = 0; i < data.data.length; i++) {

                        if (dataUser && (data.data[i].user === dataUser._id)) {
                            notifymass = data.data[i].content;
                            $scope.notification = notifymass;
                            return;
                        }
                    }
                    $scope.notification = notifymass;
                }
            });
        });
    };
    $scope.getFromAllNotify();
    var socket = io();
    socket.on("notify", function (data) {
        //notifymass=[];
        if (data.hasOwnProperty("type") && data.creatorOfPost === courseEdit.userdata._id && data.creatorComment !== data.creatorOfPost) {
            $scope.httpUsersList(function () {

                $scope.notification.push(data);
                //$scope.$apply();
            }, true);
            return;
        }
        socket.emit('my other event', {my: 'data'});
    });
    socket.on("success", function (data) {
        $scope.popSuccess = function (data) {
            toaster.pop('success', data.text)
        };
        $scope.popSuccess(data);
        //  console.log("sdasdasdasdasd")
    });
    socket.on("error", function (data) {
        $scope.popError = function (data) {
            toaster.pop('error', data.text);
        };
        $scope.popError(data);
        //  console.log("sdasdasdasdasd")
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
    $scope.httpUsersList = function (cb) {
        $http.get('/users').success(function (data) {
            $scope.listOfUsers = data;
            cb && cb();
        });
    };
    $scope.httpUsersList();
    $scope.whoIsThis = function (id) {

        if ($scope.listOfUsers) {
            for (var i = 0; i < $scope.listOfUsers.length; i++) {
                if ($scope.listOfUsers[i]._id === id) {
                    return $scope.listOfUsers[i];
                }
            }
        }
    };


    $scope.clearNotify = function (id) {

        $http.post("/notify/delet/all", {id: id}).success(function (data) {
            $scope.getFromAllNotify();
        });
    };

    /**************************Profile edition******************************************/

    $scope.editionType = {};
    $scope.editionType.type = false;
    $scope.percentComplete = 0;
    $scope.nullProg = function () {
        $scope.userUploadProgress.progress = {'width': 0 + '%'};
        $scope.percentComplete = 0;
    };
    $scope.showProfileEdition = function (bool) {
        setTimeout(function () {
            $scope.uploadTrusy = 0;

            $scope.editionType.type = !$scope.editionType.type;
            $scope.$apply();
            function initUploadUser() {


                var inputUser = $("#inputUser");
                $scope.userUploadProgress = {};

                inputUser.bind("change", function (event) {
                    $scope.uploadTrusy = 1;
                    setTimeout(function () {
                        var reader = new FileReader();
                        var file = event.currentTarget.files[0];
                        reader.readAsDataURL(event.currentTarget.files[0]);
                        reader.onload = function (oFREvent) {
                            document.getElementById("uploadPreview").src = oFREvent.target.result;
                        };
                        $scope.uplodUserAvatar = function () {
                            $scope.uploadTrusy = 2;
                            var formData = new FormData();
                            formData.append("userfile", file);
                            var xhr = new XMLHttpRequest();
                            xhr.addEventListener('progress', function (event) {

                                if (event.lengthComputable) {
                                    var percentComplete = event.loaded / event.total;
                                    $scope.percentComplete = percentComplete * 100;
                                    $scope.userUploadProgress.progress = {'width': percentComplete + 90 + '%'};
                                }
                            });
                            xhr.addEventListener('load', function () {
                                courseEdit.reqUser();
                                courseEdit.reqPosts();
                                courseEdit.reqUsers();
                                $scope.showProfileEdition(false);

                            }, false);
                            xhr.open("POST", "/user/upload", true);
                            xhr.send(formData);
                        };

                    }, 100);
                });
            }

            initUploadUser();

            $scope.cancelUserAvatar = function () {
                document.getElementById("uploadPreview").src = "";
                $scope.uploadTrusy = 0;
                setTimeout(initUploadUser, 100);
            };

            var photoArea = document.querySelector(".avatar_upload");
            if (photoArea) {
                photoArea.ondragover = function (e) {
                    $scope.uploadTrusy = 1;
                    e.preventDefault();
                    return false;
                };
                photoArea.ondragleave = function (e) {
                    $scope.uploadTrusy = 0;
                    e.preventDefault();
                    return false;
                };

                photoArea.ondrop = function (event) {

                    event.preventDefault();
                    var reader = new FileReader();
                    var file = event.dataTransfer.files[0];
                    reader.readAsDataURL(event.dataTransfer.files[0])
                    reader.onload = function (oFREvent) {

                        document.getElementById("uploadPreview").src = oFREvent.target.result;
                    };

                    $scope.uplodUserAvatar = function () {
                        $scope.uploadTrusy = 2;
                        var formData = new FormData();
                        formData.append("userfile", file);
                        var xhr = new XMLHttpRequest();
                        xhr.addEventListener('progress', function (event) {

                            if (event.lengthComputable) {
                                var percentComplete = event.loaded / event.total;
                                $scope.percentComplete = percentComplete * 100;
                                $scope.userUploadProgress.progress = {'width': percentComplete + 90 + '%'};
                            }
                        });
                        xhr.addEventListener('load', function () {
                            courseEdit.reqUser();
                            courseEdit.reqPosts();
                            courseEdit.reqUsers();
                            $scope.showProfileEdition(false);

                        }, false);
                        xhr.open("POST", "/user/upload", true);
                        xhr.send(formData);
                    };

                };


            }


        }, 25);


    };
    /*****************controll open user menu********************/
    $scope.menuOpen = false;
    $scope.foo = 'www';

    setInterval(function () {
        if ($("#menuUser").hasClass("open")) {
            $scope.menuOpen = true;
            $scope.$apply();
            return;
        }
        $scope.menuOpen = false;
        $scope.$apply();
    }, 100);

    $scope.closeMenuNotify = function () {
        $("#menuUser").removeClass("open");
    };
    /***********************open question modal***************************/

    $scope.openQuestionModal = function () {

        var modalInstanceQuestion = $modal.open({
            templateUrl: "myModalContentQuestion.html",
            controller: ModalInstanceCtrlQuestion,
            resolve: {
                saveNewQuestion: function () {
                    return $scope.saveNewQuestion;
                },
                user: function () {
                    return courseEdit.userdata;
                }
            }
        });
    };

    var ModalInstanceCtrlQuestion = function ($scope, $modalInstance, saveNewQuestion, user) {
        $scope.saveNewQuestion = saveNewQuestion;
        $scope.user = user;
        $scope.text = {};
        $scope.tag = {};
        $scope.consolkaQuest = function () {

            var formData = new FormData();
            formData.append("postFile", $("#questInputFile")[0].files[0]);

            $scope.formData = formData;
        };
        $scope.ok = function () {
            var files = $("#questInputFile")[0].files;
            $scope.saveNewQuestion($scope.text.title, $scope.text.content, $scope.user._id, undefined, $scope.formData, $scope.tag.tags, files);
            $modalInstance.close();
            // post()
        };

        $scope.cancel = function () {
            //$modalInstance.dismiss('cancel');
            $modalInstance.close();
        };
    };

    /************************open post modal**************************/

    $scope.openPostModal = function () {
        var modalInstancePost = $modal.open({
            templateUrl: "myModalContentPost.html",
            controller: ModalInstanceCtrlPost,
            resolve: {
                saveNewPost: function () {
                    return $scope.saveNewPost;
                },
                user: function () {
                    return courseEdit.userdata;
                },
                uploadPostImg: function () {
                    return $scope.uploadPostImg
                }
            }
        });

    };

    var ModalInstanceCtrlPost = function ($scope, $modalInstance, $modal, saveNewPost, user, uploadPostImg) {

        $scope.user = user;

        $scope.tag = {};
        $scope.consolka = function () {


            $scope.formData = $("#postInputFile")[0].files;
        };
        //console.log($scope.user)
        $scope.saveNewPost = saveNewPost;
        $scope.text = {};
        $scope.ok = function () {
            var files = $("#postInputFile")[0].files;
            $scope.saveNewPost($scope.text.content, $scope.user._id, $scope.formData, $scope.tag.tags, files);
            $modalInstance.close();
        };

        $scope.cancel = function () {
            //$modalInstance.dismiss('cancel');
            $modalInstance.close();
        };
    };

    /************************open modal post/question**************************/

    $scope.openModal = function (template, size) {

        var modalInstance = $modal.open({
            templateUrl: template,
            controller: ModalInstanceCtrl,
            size: size,
            resolve: {
                openPostModal: function () {
                    return $scope.openPostModal;
                },
                openQuestionModal: function () {
                    return $scope.openQuestionModal;
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {

        }, function () {
            // $modalInstance.close();
        });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance, $modal, openPostModal, openQuestionModal) {

        $scope.openQuestionModal = openQuestionModal;
        $scope.openPostModal = openPostModal;
        $scope.openPost = function () {
            $modalInstance.close();
            $scope.openPostModal();
            // $modalInstance.dismiss('cancel');

        };
        $scope.openQuestion = function () {
            $modalInstance.close();
            $scope.openQuestionModal();
            // $modalInstance.dismiss('cancel');

        };
    };
    /**************upload post/question foto**************************/
    $scope.uploadPostImg = function (div) {
        var inputPost = $("#" + div);
        inputPost.bind("change", function (event) {

            var file = event.currentTarget.files[0];
            var formData = new FormData();

            formData.append("postFile", file);


        });

    };


    /************************save post new**************************/



    $scope.saveNewPost = function (content, creator, fileUpload, tags, files) {
        $(".postLoad").show();
        var tagsObj = []
        for (var i = 0; i < tags.length; i++) {
            tagsObj.push(tags[i].text);
        }
        courseEdit.userHasBadge(courseEdit.listOfBadges[0], courseEdit.userdata);

        var newPost = {content: content, creator: creator, tags: tagsObj};

        function postImgUpload(files, postId, count) {

            var formData = new FormData();
            formData.append("postFile", files[count]);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('readystatechange', function () {


                if (xhr.readyState === 4) {
                    count++;
                    if (count <= files.length - 1) {

                        postImgUpload(files, postId, count);
                    } else {
                        courseEdit.reqPosts();
                        $state.go('posts').then(function () {
                            //$(".postLoad").hide();
                            $location.url("/post/all?type=allposts");

                        });
                    }
                }

            }, false);

            xhr.open("POST", "/posts/upload", true);
            xhr.setRequestHeader("postId", postId);
            xhr.send(formData);
        }

        $http.post('/post/new', newPost).success(function (data) {
            var id = data.data.postId;
            var count = 0;
            postImgUpload(files, id, count);

        });


    };

    courseEdit.saveNewPost = $scope.saveNewPost;


    $scope.saveNewQuestion = function (title, content, creator, unit, fileUpload, tags, files) {
        $(".postLoad").show();
        var tagsObj = [];
        if ($state.current.name === 'unit') {
            tagsObj.push($location.$$url.split("/")[5]);
            //tagsObj.push(tags[i].text);
        }
        for (var i = 0; i < tags.length; i++) {
            tagsObj.push(tags[i].text);
        }
        courseEdit.userHasBadge(courseEdit.listOfBadges[1], courseEdit.userdata);

        var newQuestion = {
            title: title,
            content: content,
            creator: creator,
            unit: unit,
            typePost: "question",
            tags: tagsObj
        };

        function questImgUpload(files, postId, count) {

            var formData = new FormData();
            formData.append("postFile", files[count]);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('readystatechange', function () {

                if (xhr.readyState === 4) {
                    count++;
                    if (count <= files.length - 1) {

                        questImgUpload(files, postId, count);
                    } else {
                        courseEdit.reqPosts();
                        if ($state.current.name === 'unit') {
                            $(".postLoad").hide();
                            return;
                        }
                        $state.go('posts').then(function () {
                            $location.url("/post/all?type=allposts");

                        });
                    }
                }

            }, false);

            xhr.open("POST", "/posts/upload", true);
            xhr.setRequestHeader("postId", postId);
            xhr.send(formData);
        }

        $http.post('/post/new', newQuestion).success(function (data) {
            var id = data.data.postId;
            var count = 0;
            questImgUpload(files, id, count);
        });

    };


});