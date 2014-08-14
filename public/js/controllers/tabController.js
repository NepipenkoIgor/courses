/**
 * Created by igor on 7/1/14.
 */
app.controller('maintab', function ($scope, $http, $state, $sce, $stateParams, $location, $window, courseEdit) {
    'user strict';

    /**/

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
    $scope.listOfBadges = [
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
    ];
    //console.log($scope.listOfBadge)
    courseEdit.listOfBadges = $scope.listOfBadges;
    //console.log(courseEdit)

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
            /*function of redirect on reload window*/
            function reloadLink() {
                //console.log("$location", $location.$$url.split("/")[1] !== "adminlab");
                if ($location.$$url.split("/")[1] !== "adminlab") {
                    //console.log("peregryzka params",$state.current.name)
                    if ($scope.listOfCourses) {
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

            }

            reloadLink();
        });

    }

    initTab();
    courseEdit.initTab = initTab;


    $scope.courseNowChange = function (id) {
       // console.log(id);
        $scope.dangerModule= [];
        $scope.dangerUnit = {};
        $scope.dangerSection = [];
        if ($scope.listOfCourses) {
            for (var i = 0; i < $scope.listOfCourses.length; i++) {
                if ($scope.listOfCourses[i]._id === id) {
                    $scope.courseNowChanged = $scope.listOfCourses[i];
                    $scope.positionInCourse.course=i+1;
                    console.log( $scope.positionInCourse.course)
                    $scope.moduleNowChanged = "";
                    $state.go('course', {courseTitle: $scope.courseNowChanged.title});
                    return;
                }
            }
        }


    };
    $scope.moduleNowChange = function (id) {
        if($scope.dangerModule.indexOf(id)>0){
            alert("you must complete the previous module");
            return;
        }
        for (var i = 0; i < $scope.courseNowChanged.modules.length; i++) {
            if ($scope.courseNowChanged.modules[i]._id === id) {
                $scope.moduleNowChanged = $scope.courseNowChanged.modules[i];
                $state.go("modules",{courseTitle: $scope.courseNowChanged.title,moduleTitle:$scope.moduleNowChanged.title})
                $scope.positionInCourse.module=i+1;
                console.log( $scope.positionInCourse.module)
                $scope.dangerUnit = {};
                $scope.dangerSection = [];
            }
        }

    };

    $scope.startModule=function(){
        //console.log("asdasdasdasdasdas",$scope.moduleNowChanged)
        if($scope.moduleNowChanged){
            var id=$scope.moduleNowChanged.sections[0].specialId;
            var massUnit=$scope.showUnitsList(id);
            //console.log(id,massUnit)
            $scope.unitNowChange(massUnit[0].unitId,id);
        }

     };
    $scope.unitNowChange = function (id,specialId) {

        if($scope.dangerSection.indexOf(specialId)>0){
            alert("you must complete the previous section");
            return;
        }
        if ($scope.dangerUnit[specialId].indexOf(id) > 0){
            alert("you must complete the previous lesson");
            return;
        }
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
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


                        $scope.positionInCourse.section=j+1;
                        console.log( $scope.positionInCourse.section)
                        var mass=$scope.showUnitsList($scope.sectionNowChanged.specialId);
                         for(var t=0;t<mass.length;t++){
                             if(mass[t].unitId===$scope.unitNowChanged.unitId){
                                 $scope.positionInCourse.unit=t+1;
                                 console.log($scope.positionInCourse.unit)
                             }
                         }

                        courseEdit.positionInCourse=$scope.positionInCourse;
                        $scope.calculateTotalProgress($scope.totalSectionPoint($scope.sectionNowChanged.specialId), courseEdit.userdata.progress, $scope.sectionNowChanged.specialId);

                    }
                }
                courseEdit.unitNowChanged = $scope.unitNowChanged;

                if (courseEdit.listOfBadges && courseEdit.userdata) {
                    courseEdit.userHasBadge(courseEdit.listOfBadges[0], courseEdit.userdata);
                }


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
                            var obj = {};
                            _.extend(obj, $scope.unitNowChanged.lims[0].content[0].quiz[i]);
                            answerObj.push(obj);
                            $scope.unitNowChanged.lims[0].content[0].quiz[i].answer = "";
                        }
                        //console.log(answerObj, $scope.unitNowChanged.lims[0].content[0].quiz)

                        $scope.checkQuiz = function () {
                            for (var i = 0; i < $scope.unitNowChanged.lims[0].content[0].quiz.length; i++) {

                                if (answerObj[i].answer != $scope.unitNowChanged.lims[0].content[0].quiz[i].answer) {

                                    return;
                                }
                            }
                            courseEdit.userHasBadge(courseEdit.listOfBadges[1], courseEdit.userdata)
                            $scope.saveProgress($scope.unitNowChanged.unitId);
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

                if(!$scope.listOfUnits[i].lims[0].points){
                    $scope.listOfUnits[i].lims[0].points=0;
                }
                totalPoints += $scope.listOfUnits[i].lims[0].points;
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
                //console.log("good  progress request", num);
                courseEdit.reqUser(function () {
                    //console.log("iam cb")
                    $scope.calculateTotalProgress($scope.totalSectionPoint($scope.sectionNowChanged.specialId), courseEdit.userdata.progress, $scope.sectionNowChanged.specialId);
                });//need promes
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
        //console.log($scope.progress.red, $scope.progress.orange, $scope.progress.green);

    };
    $scope.returnProgress = function () {
        return [$scope.progress.red, $scope.progress.orange, $scope.progress.green];
    };

    $scope.dangerUnit = {};
    $scope.markOfCompleteUnit = function (unitId, sectionId) {
        var unitArr = [];
        for (var i = 0; i < $scope.showUnitsList(sectionId).length; i++) {

            unitArr.push($scope.showUnitsList(sectionId)[i].unitId);
        }

//console.log("$scope.dangerUnit[sectionId]",$scope.dangerUnit[sectionId])
        if($scope.dangerUnit[sectionId]===undefined){
            $scope.dangerUnit[sectionId]=unitArr;
        }
        /*console.log("red", $scope.dangerUnit);
        console.log("$scope.dangerSection",$scope.dangerSection);*/
        if (!courseEdit.userdata) {
            return;
        }
        if (courseEdit.userdata.progress.indexOf(unitId) !== (-1)) {
            if($scope.dangerUnit[sectionId].indexOf(unitId)!==(-1)){
                var index=$scope.dangerUnit[sectionId].indexOf(unitId);
                $scope.dangerUnit[sectionId].splice(index,1);
                //console.log(" $scope.dangerUnit", $scope.dangerUnit)
            }

            return "complete";
        }
        if ($scope.unitNowChanged !== undefined && unitId === $scope.unitNowChanged.unitId) {
            return "active";
        }
    };

    $scope.dangerSection = [];
    $scope.markOfCompleteSection = function (sectionId) {
        var sectionArr = [];
        if($scope.moduleNowChanged){
            for (var i = 0; i < $scope.moduleNowChanged.sections.length; i++) {
                sectionArr.push($scope.moduleNowChanged.sections[i].specialId);
            }
            if($scope.dangerSection.length===0){
                $scope.dangerSection=sectionArr;
            }
        }
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
        if($scope.dangerSection.indexOf(sectionId)!==(-1)){
            var  index=$scope.dangerSection.indexOf(sectionId);
            $scope.dangerSection.splice(index,1);
        }
        //$scope.dangerSection.splice(0,1);
        return "complete";

    };
    $scope.dangerModule= [];
    $scope.markOfCompleteModule = function (id) {
        var moduleArr=[]
        if($scope.courseNowChanged){
            for (var i = 0; i < $scope.courseNowChanged.modules.length; i++) {
                moduleArr.push($scope.courseNowChanged.modules[i]._id);
            }
            if($scope.dangerModule.length===0){
                $scope.dangerModule=moduleArr;
            }
        }
        // console.log( "!!!!!",$scope.sectionOfModule)
        if (!courseEdit.userdata||!$scope.courseNowChanged) {
            return;
        }
        for (var j = 0; j < $scope.courseNowChanged.modules.length; j++) {
            if ($scope.courseNowChanged.modules[j]._id === id) {
                if($scope.courseNowChanged.modules[j]._id=== $scope.moduleNowChanged._id){
                    return {'color':'orange'};
                }
                for (var l = 0; l < $scope.courseNowChanged.modules[j].sections.length; l++) {
                     //console.log("section",l);
                    if ($scope.markOfCompleteSection($scope.courseNowChanged.modules[j].sections[l].specialId) !== "complete") {
                        return ;
                    }
                }
            }
        }
        if($scope.dangerModule.indexOf(id)!==(-1)){
            var  index=$scope.dangerModule.indexOf(id);
            $scope.dangerModule.splice(index,1);
        }
        //console.log( "*******")
        return {'color':'green'};

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
        //alert("change state")
        if (newState === 0) {
            //console.log("conec");//video watch registration
            courseEdit.userHasBadge(courseEdit.listOfBadges[2], courseEdit.userdata);
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
        //console.log($scope.lesson.code)
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

//*****************************************************************************************


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
        // console.log($location.$$url)
        $location.$$url = "/post/all";
        $state.go('posts').then(function () {
            /*courseEdit.reqPosts();
             courseEdit.reqUsers();*/
            //console.log("good redirect")
        });
    };
    $scope.goToCourse = function () {
        $state.go('courses').then(function () {
            // console.log("good redirect");
        });
    };
    $scope.ifCommunity = function () {
        if ($location.$$url === "/post/all" || $location.$$url === "/post/new") {
            return false;
        }
        return true;
    };


    /*$scope.searchType = [
     {value: 'All Posts', text: 'All Posts'},
     {value: 'My Posts', text: 'My Posts'},
     {value: 'My Questions', text: 'My Questions'},
     {value: 'Only Questions', text: 'Only Questions'}
     ];
     $scope.search = {
     type: "All Posts"
     };*/
    $scope.searchType = ['All Posts', 'My Posts', 'My Questions', 'Only Questions'];
    $scope.search = {
        type: "All Posts"
    };
    $scope.typeSearch = function (type) {
        $scope.search = {
            type: type
        };
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
        }
        courseEdit.searchPosts(searchObj);
    };

    $scope.textOfSearch = {text: ""};
    $scope.textSearch = function () {
        var searchObj = {};
        searchObj.type = 'text';
        searchObj.text = $scope.textOfSearch.text;
        //console.log(searchObj);
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

    $scope.eqvalBadges = function () {
        if (courseEdit.userdata.badges && courseEdit.listOfBadges) {
            /*console.log(courseEdit.userdata.badges)
            console.log(courseEdit.listOfBadges)*/
            $scope.countBadges=0
            for (var i = 0; i < courseEdit.userdata.badges.length; i++) {
                $scope.countBadges++;
                courseEdit.listOfBadges[courseEdit.userdata.badges[i]].opasity = {"opacity": 1};
            }
        }

    };
    courseEdit.eqvalBadges = $scope.eqvalBadges;

});