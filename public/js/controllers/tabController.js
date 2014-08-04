/**
 * Created by igor on 7/1/14.
 */
app.controller('maintab', function ($scope, $http, $state, $sce, $stateParams, $location, $window, courseEdit) {
    'user strict';
//$scope.courseEdit=courseEdit;

//console.log("peregryzka")

    $scope.progress = {};
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
            function reloadLink() {
                console.log("$location", $location.$$url.split("/")[1] !== "adminlab");
                if ($location.$$url.split("/")[1] !== "adminlab") {
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

            }

            reloadLink();

        });

    }

    initTab();
    courseEdit.initTab = initTab;


    $scope.courseNowChange = function (id) {
        for (var i = 0; i < $scope.listOfCourses.length; i++) {
            if ($scope.listOfCourses[i]._id === id) {
                $scope.courseNowChanged = $scope.listOfCourses[i];
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
                // $state.go('module', {courseTitle: $scope.courseNowChanged.title, moduleTitle: $scope.moduleNowChanged.title});
            }
        }

    };

    $scope.unitNowChange = function (id) {
        $scope.addQuestionFlag = false;
        $scope.progress.red = {};
        $scope.progress.orange = {};
        $scope.progress.green = {};

        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            // console.log($scope.listOfUnits[i]);
            if ($scope.listOfUnits[i].unitId === id) {
                $scope.unitNowChanged = $scope.listOfUnits[i];

                for (var j = 0; j < $scope.moduleNowChanged.sections.length; j++) {
                    if ($scope.moduleNowChanged.sections[j].specialId === $scope.unitNowChanged.parent) {
                        $scope.sectionNowChanged = $scope.moduleNowChanged.sections[j];
                        $scope.calculateTotalProgress($scope.totalSectionPoint($scope.sectionNowChanged.specialId), courseEdit.userdata.progress, $scope.sectionNowChanged.specialId);

                        /* $state.go('unit', {courseTitle: $scope.courseNowChanged.title, moduleTitle: $scope.moduleNowChanged.title,
                         sectionTitle: $scope.sectionNowChanged.title, unitTitle: $scope.unitNowChanged.unitId});*/
                    }
                }
                courseEdit.unitNowChanged = $scope.unitNowChanged;
                $state.go('unit', {courseTitle: $scope.courseNowChanged.title, moduleTitle: $scope.moduleNowChanged.title,
                    sectionTitle: $scope.sectionNowChanged.title, unitTitle: $scope.unitNowChanged.unitId}).then(function () {
                    setTimeout(function getEl() {
                        if ($scope.unitNowChanged.lims[0].typeLim === "video") {
                            var url = $scope.unitNowChanged.lims[0].content[0];
                            url = "http:" + url + "?enablejsapi=1&playerapiid=ytplayer";
                            var params = { allowScriptAccess: "always" };
                            var atts = { id: "myytplayer" };
                            swfobject.embedSWF(url, "lessonVideoPlayer", "425", "356", "8", null, null, params, atts);
                        }
                    }, 1);
                    if ($scope.unitNowChanged.lims[0].typeLim === "quiz") {

                        var answerObj = [];
                        // _.extend(answerObj,$scope.unitNowChanged.lims[0].content[0].quiz);
                        for (var i = 0; i < $scope.unitNowChanged.lims[0].content[0].quiz.length; i++) {
                            var obj = {}
                            _.extend(obj, $scope.unitNowChanged.lims[0].content[0].quiz[i])
                            answerObj.push(obj);
                            $scope.unitNowChanged.lims[0].content[0].quiz[i].answer = "";
                        }
                        //console.log(answerObj, $scope.unitNowChanged.lims[0].content[0].quiz)

                        $scope.checkQuiz = function () {
                            console.log(answerObj, $scope.unitNowChanged.lims[0].content[0].quiz)
                            //console.log(_.isEqual(answerObj,$scope.unitNowChanged.lims[0].content[0].quiz))
                            for (var i = 0; i < $scope.unitNowChanged.lims[0].content[0].quiz.length; i++) {
                                //_.isEqual(answerObj[i],$scope.unitNowChanged.lims[0].content[0].quiz[i]);
                                if (answerObj[i].answer != $scope.unitNowChanged.lims[0].content[0].quiz[i].answer) {
                                    console.log("your answer  bad")
                                    return;
                                }
                            }

                            console.log("your answer  good");
                            $scope.saveProgress($scope.unitNowChanged.unitId);
                        };
                        $scope.quizCheck = function () {

                            // console.log($scope.unitNowChanged.lims[0].content[0].quiz)
                        };
                    }


                });
                refresh();

                return;
            }
        }
        $state.go('welcome');
    };

    $scope.totalSectionPoint = function (sectionId) {
        var totalPoints = 0;
        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            if ($scope.listOfUnits[i].parent === sectionId) {
                //console.log($scope.listOfUnits[i].lims[0].points)
                totalPoints += $scope.listOfUnits[i].lims[0].points
            }
        }
        //console.log("scores of this sections",totalPoints);
        return totalPoints;
//console.log(courseEdit.userdata)
    };
    $scope.saveProgress = function (unitId) {
        if (!courseEdit.userdata) {
            return;
        }
        if (courseEdit.userdata.progress.indexOf(unitId) === (-1)) {
            $http.post("/progress", [courseEdit.userdata._id, unitId]).success(function (num) {
                console.log("good  progress request", num);
                courseEdit.reqUser(function () {
                    console.log("iam cb")
                    $scope.calculateTotalProgress($scope.totalSectionPoint($scope.sectionNowChanged.specialId), courseEdit.userdata.progress, $scope.sectionNowChanged.specialId);
                });//need promes
            });
        }
    };
    $scope.calculateTotalProgress = function (totalPoints, userProgress, secionId) {
        if (!courseEdit.userdata) {
            return;
        }
        console.log("scores of this sections", totalPoints);
        console.log("userProgress", userProgress);
        var realpointsOfSection = 0;
        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            if (userProgress.indexOf($scope.listOfUnits[i].unitId) !== (-1) && $scope.listOfUnits[i].parent === secionId) {
                //console.log("i is etogo yroka")
                realpointsOfSection += $scope.listOfUnits[i].lims[0].points;

            }
        }
        console.log("real points", realpointsOfSection);
        console.log(realpointsOfSection / totalPoints);
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
        console.log($scope.progress.red, $scope.progress.orange, $scope.progress.green);

    };
    $scope.returnProgress = function () {
        return [$scope.progress.red, $scope.progress.orange, $scope.progress.green]
    }
    $scope.markOfCompleteUnit = function (unitId) {
        if (!courseEdit.userdata) {
            return;
        }
        if (courseEdit.userdata.progress.indexOf(unitId) !== (-1)) {
            return "complete";
        }
        if ($scope.unitNowChanged !== undefined && unitId === $scope.unitNowChanged.unitId) {
            return "active";
        }
    };
    $scope.markOfCompleteSection = function (sectionId) {
        if (!courseEdit.userdata) {
            return;
        }
        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            if ($scope.listOfUnits[i].parent === sectionId) {
                if (courseEdit.userdata.progress.indexOf($scope.listOfUnits[i].unitId) === (-1)) {
                    return " ";
                }
            }
        }
        return "complete";

    };
    $scope.completeStatic = function () {
        $scope.saveProgress($scope.unitNowChanged.unitId);
    };

    $scope.nextUnit = function (id) {
        $scope.unitNowChange($scope.unitNowChanged.unitId + 1);
    };


    function onYouTubePlayerReady(playerId) {
        var ytplayer = document.getElementById("myytplayer");
        // console.log(ytplayer.getDuration())
        ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
    }

    function onytplayerStateChange(newState) {
        if (newState === 0) {
            console.log("conec");//video watch registration
            $scope.saveProgress($scope.unitNowChanged.unitId);
        }
    }

    window.onYouTubePlayerReady = onYouTubePlayerReady;
    window.onytplayerStateChange = onytplayerStateChange;


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
        if (type === "code quest") {
            return "fa fa-file-code-o";
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
        /* document.getElementById('preview').innerHTML = $scope.lesson.code;*/
        console.log($scope.lesson.code)
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
                    //console.log("code lesson",$scope.lesson);
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
        /* $scope.btnText = 'Check';
         $scope.test = num;*/
        // $scope.next = false;
    }

    refresh(1);
    $scope.btnText = 'Check';
    var test = 1;
    var next = false;


    $scope.check = function () {
        if (next) {
            console.log("next")
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

//*****************************************************************************************


    $scope.mapModule = function () {
        console.log($location.$$url);
        var arrLocal = $location.$$url.split("/");
        arrLocal.splice(4, 2)
        console.log(arrLocal.join("/"));
        arrLocal = arrLocal.join("/")
        //$location.$$url=arrLocal;
        $window.location = "/#" + arrLocal;
    };
    $scope.showAddQuestion = function () {

        if (!$scope.addQuestionFlag) {
            $scope.addQuestionFlag = true;
            return;
        }
        $scope.addQuestionFlag = false
        return;
    };


    $scope.goToCommunity = function () {
        console.log($location.$$url)
        $location.$$url = "/post/all";
        $state.go('posts').then(function () {
            console.log("good redirect")
        });
    };
    $scope.goToCourse = function () {
        $state.go('welcome').then(function () {
            console.log("good redirect");
        });
    };
    $scope.ifCommunity = function () {
        if ($location.$$url === "/post/all" || $location.$$url === "/post/new") {
            return false;
        }
        return true;
    };


    $scope.searchType = [
        {value: 'All Posts', text: 'All Posts'},
        {value: 'My Posts', text: 'My Posts'},
        {value: 'My Questions', text: 'My Questions'},
        {value: 'Only Questions', text: 'Only Questions'},
        {value: 'All Activity', text: 'All Activity'}
    ];
    $scope.search = {
        type: "All Posts"
    };
    $scope.postFilter = function (user, postData) {
        var searchObj = {};
        switch ($scope.search.type) {
            case 'All Posts':
                searchObj.type = 'All Posts';
                break;
            case 'My Posts':
                searchObj.type = 'My Posts';
                searchObj.creator = user._id;
                break;
            case 'My Questions':
                searchObj.type = 'My Questions';
                searchObj.creator = user._id;
                searchObj.typePost = "question";
                break;
            case 'Only Questions':
                searchObj.type = 'Only Questions';
                searchObj.typePost = "question";
                break;
            case 'All Activity':
                break;
        }
        //console.log(searchObj);
        courseEdit.searchPosts(searchObj);
    };

    $scope.pointsCalculate = function (userProgresArr) {
        var count = 0;
        for (var i = 0; i < $scope.listOfUnits.length; i++) {
            if (userProgresArr.indexOf($scope.listOfUnits[i].unitId) !== (-1)) {
                count = count + $scope.listOfUnits[i].lims[0].points;
            }
        }
        return count;
    };

    $scope.textOfSearch = {text: ""};
    $scope.textSearch = function () {
        var searchObj = {};
        searchObj.type = 'text';
        searchObj.text = $scope.textOfSearch.text;
        console.log(searchObj);
        courseEdit.searchPosts(searchObj);
    };

});