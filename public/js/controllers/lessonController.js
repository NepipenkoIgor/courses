/**
 * Created by igor on 7/15/14.
 */
app.controller('lessonController', function ($scope, $http, $stateParams, $state, $sce, $location, courseEdit) {
    $("#blockwindow").hide();
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

        $scope.url = $location.$$url
    }

    init();


    $scope.saveCourse = function (action) {
        $("#blockwindow").show();
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
                // $state.go('adminlab');
                init();

            } else {
                //  $state.go('adminlab.lesson.module', {courseTitle: $scope.course.title});
                // $state.go('adminlab')
                init();
                courseEdit.initTab();
            }
            $("#blockwindow").hide();

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
                    var unitArray = [];
                    for (var i = 0; i < $scope.units.length; i++) {
                        if ($scope.units[i].parent === specialId) {
                            unitArray.push($scope.units[i].unitId);
                        }
                    }
                    console.log(unitArray);
                    unitArray.sort();
                    var positionArr = unitArray.indexOf(unitsOrderId);
                    if (position === 'after') {
                        if (positionArr < unitArray.length - 1) {
                            var orderId = unitsOrderId + (unitArray[positionArr + 1] - unitArray[positionArr]) / 2;
                        }
                        if (positionArr === unitArray.length - 1) {
                            var orderId = unitsOrderId + 1;
                        }

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
                        if (positionArr < unitArray.length - 1) {
                            var orderId = unitsOrderId - (unitArray[positionArr] - unitArray[positionArr - 1]) / 2;
                        }
                        if (positionArr === unitArray.length - 1) {
                            var orderId = unitsOrderId - 1;
                            if ((unitArray.length - 1) > 0) {
                                var orderId = unitsOrderId - (unitArray[positionArr] - unitArray[positionArr - 1]) / 2;
                            }
                        }

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
        if ($scope.disabled === false) {
            for (var i = 0; i < $scope.units.length; i++) {
                if ($scope.units[i]._id !== id) {
                    continue;
                }
                $scope.unitNow = $scope.units[i];
            }

            //console.log("unit now", $scope.unitNow);
            if (!$scope.unitNow.lims[0]) {
                $scope.typeLim = {
                    type: "quiz"
                };
            } else {
                $scope.typeLim = {
                    type: $scope.unitNow.lims[0].typeLim
                };
                $scope.points.count = $scope.unitNow.lims[0].points;
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
            if($scope.unitNow.lims[0]&&$scope.unitNow.lims[0].typeLim==="video"){
                console.log( $scope.videoSource,$scope.unitNow.lims[0].content[0])
                $scope.videoSource=$scope.unitNow.lims[0].content[0];
            }
        }
    };
    $scope.changeSection = function (id) {
        if ($scope.disabled === false) {
            for (var i = 0; i < $scope.course.modules.length; i++) {
                for(var j=0;j<$scope.course.modules[i].sections.length;j++){
                    if($scope.course.modules[i].sections[j]._id===id){
                        $scope.sectionNow = $scope.course.modules[i].sections[j];
                    }
                }
            };
            //console.log("$scope.sectionNow",$scope.sectionNow)
        }

    };
    $scope.changeModule = function (id) {
        if ($scope.disabled === false) {
            for (var i = 0; i < $scope.course.modules.length; i++) {

                    if($scope.course.modules[i]._id===id){
                        $scope.moduleNow = $scope.course.modules[i];
                    }

            };
            console.log("$scope.sectionNow", $scope.moduleNow)
        }

    };

    $scope.statuses = [
        {value: 'static', text: 'static'},
        {value: 'video', text: 'video'},
        {value: 'quiz', text: 'quiz'},
        {value: 'code quest', text: 'code quest'}
    ];

    $scope.formatVideoUrl = function (url) {

        $scope.videoSaveSource=url;
        return $sce.trustAsResourceUrl(url);
    };

    $scope.saveVideo = function () {
        //console.log("save video",$scope.videoSource)
        var obj = {typeLim: $scope.typeLim.type, content:  $scope.videoSaveSource, points: parseInt($scope.points.count)};
        $scope.unitNow.lims[0] = obj;

        // console.log("new unit seeeee", $scope.unitNow);
      $scope.saveCourse();
        //$scope.points.count=0;
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
        var obj = {typeLim: $scope.typeLim.type, content: [$scope.quizInEdit[0]], points: parseInt($scope.points.count)};
        console.log(obj)
        $scope.unitNow.lims[0] = obj;
        console.log($scope.unitNow.lims[0]);
        $scope.saveCourse();
        // $scope.points.count=0;
    };

    $scope.aceLoaded = function (_editor) {
        // Editor part
        var _session = _editor.getSession();
        var _renderer = _editor.renderer;
        var content;

        if ($scope.unitNow.lims[0] === undefined || $scope.unitNow.lims[0].typeLim != 'static') {
            content = "Your static content";
        } else {
            content = $scope.unitNow.lims[0].content[0];
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
        _session.on("change", function (inputData) {

            $scope.editView = escapeHtml(_editor.getValue());

        });
        //_editor.on("blur", function(event,data){console.log(_editor.getValue())});
    };
    $scope.saveStatic = function () {
        console.log($scope.editView);
        var obj = {typeLim: $scope.typeLim.type, content: [$scope.editView], points: parseInt($scope.points.count)};
        $scope.unitNow.lims[0] = obj;
        $scope.saveCourse();
    };
    $scope.saveCodeQuest = function () {
        console.log($scope.editView);
        var lessons = {
            levels: [
                {
                    id: 1,
                    description: 'HTML (“HyperText Markup Language”) is a ' +
                        'language to describe the contents of web documents. The code on ' +
                        'the right is a basic structure of an HTML document. Notice how there is ' +
                        'an opening tag &lt; /&gt; and a closing tag &lt;/ &gt;. These represent the beginning and' +
                        ' end of an element. <br><strong>Try changing the title of this document by changing the text ' +
                        'between the &lt;title&gt;&lt;/title&gt; tags to something else then checking the preview.</strong>  Type ' +
                        '“next” when you are done.',
                    tests: {
                        1: {
                            error: 'Oops, looks like it is still the same. <strong>Click in the editor on the right' +
                                'and change the text “Code Quest” to something else.</strong>',
                            check: 'Code Quest',
                            help: ''
                        },
                        2: {
                            error: 'Oops, looks like it is still the same. Change the code “&lt;title&gt;Code Quest&lt;/title&gt;” ' +
                                ' to “&lt;title&gt;{{username}}’s HTML&lt;/title&gt;”',
                            check: 'Code Quest',
                            help: ''
                        }
                    },
                    correct: 'Great. Now let’s try typing out that basic structure on your own. ' +
                        ' <strong>In the editor on the right type out the follow HTML code:</strong><br>' +
                        ' <pre class="c_black">&lt;!DOCTYPE html&gt;<br>' +
                        '&lt;html&gt;<br>' +
                        ' &lt;head&gt;<br>' +
                        '   &lt;title&gt;{{username}}’s HTML&lt;/title&gt;<br>' +
                        ' &lt;/head&gt;<br>' +
                        ' &lt;body&gt;<br><br>' +
                        ' &lt;/body&gt;<br>' +
                        '&lt;/html&gt;</pre>',
                    code: '<!DOCTYPE html>\n' +
                        '<html>\n' +
                        '  <head>\n' +
                        '    <title>Code Quest</title>\n' +
                        '  </head>\n' +
                        '  <body>\n' +
                        '  </body>\n' +
                        '</html>'
                },
                {
                    id: 2,
                    description: 'Now that you’ve run through the basic structure of an HTML document,' +
                        ' let’s add some elements. In the code on the right you will notice new ' +
                        'elements in the &lt;body&gt;&lt;/body&gt; tags. &lt;h1&gt; is a header. &lt;p&gt; a paragraph. ' +
                        'and &lt;b&gt; is for bold. <strong>Try the following:</strong><br>' +
                        '<ul class="b_des_list">' +
                        '<li>1. Change &lt;h1&gt; to any number between 2 and 6.</li>' +
                        '<li>2. Add a sentence to the paragraph, in between the &lt;p&gt; tags.</li>' +
                        '<li>3. Change the text between the &lt;b&gt; tags to anything else.</li>' +
                        '</ul> <p>Type “next” when you are done.</p>',
                    tests: {
                        1: {
                            error: 'Oops, looks like you missed step 1.<br>' +
                                '<ul class="b_des_list">' +
                                '<li>1. Change &lt;h1&gt; to any number between 2 and 6</li>' +
                                '</ul>',
                            check: '<h1>Giraffes</h1>',
                            help: 'Your code should look like this...' +
                                '<pre class="c_black">&lt;!DOCTYPE html&gt;<br>' +
                                '&lt;html&gt;<br>' +
                                ' &lt;head&gt;<br>' +
                                '   &lt;title&gt;{{username}}’s HTML elements&lt;/title&gt;<br>' +
                                ' &lt;/head&gt;<br>' +
                                ' &lt;body&gt;<br>' +
                                '   &lt;h1&gt;{{username}}&lt;/h1&gt;<br>' +
                                '   &lt;p&gt;A sentence about you, &lt;b&gt;{{username}}&lt;/b&gt;&lt;/p&gt;' +
                                ' &lt;/body&gt;<br>' +
                                '&lt;/html&gt;</pre>'
                        },
                        2: {
                            error: 'Oops, looks like you missed step 2 or 3.<br>' +
                                '<ul class="b_des_list">' +
                                '<li>2. Add a sentence to the paragraph, in between the &lt;p&gt; tags.</li>' +
                                '<li>3. Change the text between the &lt;b&gt; tags to anything else.</li>' +
                                '</ul>',
                            check: {
                                1: 'I’d love to own a pet <b>giraffe!</b>',
                                2: 'giraffe!'
                            },
                            help: 'Make sure to close your tags...' +
                                '<pre class="c_black">&lt;h1&gt;{{username}}&lt;/h1&gt;<br>' +
                                '&lt;p&gt;A sentence about you, &lt;b&gt;{{username}}.&lt;/b&gt;&lt;/p&gt;</pre>'
                        }
                    },
                    correct: 'Good job. Now try it on your own by adding these elements to' +
                        'the &lt;body&gt; tags. <strong>In the editor on the right add a header &lt;h1&gt;, ' +
                        'paragraph &lt;p&gt;, and bold&lt;b&gt; something inside that paragraph.</strong> ',
                    code: '<!DOCTYPE html>\n' +
                        '<html>\n' +
                        '  <head>\n' +
                        '    <title>Code Quest</title>\n' +
                        '  </head>\n' +
                        '  <body>\n' +
                        '    <h1>Giraffes</h1>\n' +
                        '    <p>I’d love to own a pet <b>giraffe!</b></p>\n' +
                        '  </body>\n' +
                        '</html>'
                },
                {
                    id: 3,
                    description: 'Next let’s add some images with HTML. The &lt;img&gt; tag ' +
                        'is a singular tag meaning everything needed will be in one set of &lt;&gt;.' +
                        ' <strong>Try changing the img source (src) to </strong><br>' +
                        '<p class="b_des">http://code.thedesignori.net/images/moose2.jpg</p> ' +
                        'Type “next” when you are done.',
                    tests: {
                        1: {
                            error: 'Oops, <strong>Try changing the img source (src="moose.jpg") </strong>' +
                                'to <p class="b_des">src="http://www.epatage-club.ru/wp-content/uploads/2011/09/cat-200x200.jpg"</p>',
                            check: 'http://www.epatage-club.ru/wp-content/uploads/2011/09/cat-200x200.jpg',
                            help: 'Your code should look like this:' +
                                '<pre class="c_black">' +
                                '&lt;img src="http://code.thedesignori.net/images/moose2.jpg" alt="This is an image." height="50" width="50" /&gt;' +
                                '</pre><br />' +
                                'Make sure you have " "'
                        }
                    },
                    correct: 'Good job. Now try it on your own by adding the entire &lt;img&gt; ' +
                        'tag. In the editor on the right add the image ' +
                        '<p class="b_des">http://code.thedesignori.net/images/more_moose.jpg</p>' +
                        'with a width of 100 and a height of 75.',
                    code: '<!DOCTYPE html>\n' +
                        '<html>\n' +
                        '  <head>\n' +
                        '    <title>Code Quest</title>\n' +
                        '  </head>\n' +
                        '  <body>\n' +
                        '    <h1>Moose!</h1>\n' +
                        '    <img src="moose.jpg" alt="This is an image." height="50" width="50" />\n' +
                        '  </body>\n' +
                        '</html>'
                },
                {
                    id: 4,
                    description: 'Now we are going to make some lists.There are ' +
                        'two types of lists, ordered list and unordered lists.' +
                        'Which use the &lt;ol&gt; and &lt;ul&gt; tag respectively. Each item in the list uses ' +
                        'the list item tag &lt;li&gt;. <strong>Try adding another list item to each list. Follow ' +
                        'the same syntax that you see in the provided code.</strong> <br>' +
                        'Type “next” when you are done.',
                    tests: {
                        1: {
                            error: 'List items need to be closed like a typical HTML tag.' +
                                '&lt;li&gt;this is a list item&lt;/li&gt;, Try adding this between ' +
                                'the &lt;ul&gt;&lt;/ul&gt; and &lt;ol&gt; &lt;/ol&gt; tags.',
                            check: '',
                            help: 'Start with the &lt;ol&gt; &lt;/ol&gt; tags, then add your list items between them.'
                        },
                        2: {
                            help: 'Make sure you have fully closed your tags. &lt;ol&gt; &lt;li&gt;list item&lt;/li&gt; &lt;/ol&gt;. You need 5 list items.'
                        }
                    },
                    correct: 'Great. Now try it on your own by creating your own lists.<br>' +
                        ' <strong>In the editor on the right create an ordered list giving 5 list items.</strong>',
                    code: '<!DOCTYPE html>\n' +
                        '<html>\n' +
                        '  <head>\n' +
                        '    <title>Lists</title>\n' +
                        '  </head>\n' +
                        '  <body>\n' +
                        '    <ol>\n' +
                        '      <li>Yawn</li>\n' +
                        '      <li>Take a nap</li>\n' +
                        '      <li>Wake up</li>\n' +
                        '    </ol>\n' +
                        '    <ul>\n' +
                        '      <li>Salt</li>\n' +
                        '      <li>Pepper</li>\n' +
                        '      <li>Cummin</li>\n' +
                        '    </ul>\n' +
                        '  </body>\n' +
                        '</html>'
                },
                {
                    id: 5,
                    description: 'Whilst HTML structures the document and tells browsers what' +
                        ' an element’s function is, CSS gives the browser instructions on how to display' +
                        ' a certain element. Take a look at the code on the right. We will be place our' +
                        ' CSS inside the &lt;style&gt;&lt;/style&gt; tags. CSS works by selecting an element then' +
                        ' applying properties to it. <br>Type “next” when you are done.',
                    tests: {
                        1: {
                            error: 'xxxxxxxxx, Xxxx.',
                            check: '',
                            help: ''
                        }
                    },
                    correct: 'xxxxxxx. Xxxxx.',
                    code: '<style>\n' +
                        'selector {\n' +
                        '  property1:value;\n' +
                        '  property2:value;\n' +
                        '  property3:value;\n' +
                        '}\n' +
                        '</style>'
                }
            ]};
        var obj = {typeLim: $scope.typeLim.type, content: [lessons], points: parseInt($scope.points.count)};

        $scope.unitNow.lims[0] = obj;
        $scope.saveCourse();
    };

    $scope.points = {
        count: 0
    };

    /*$scope.getPoints=function(num){
     console.log($scope.points.count,num)
     };*/

    $scope.saveMap = function () {

        init();
        courseEdit.initTab();

    }

    $scope.DragMap = (function () {
        var dragObject
        var pos = {};
        var margin = {};
        var mapDiv;
        var menuDiv;
        var topMargin;
        var leftMargin;
        var onMap;
        var margeL;
        var fullConteiner;
        // console.log(menuDiv.offsetLeft)
        /*    function getPosition(element) {
         return {left: element.offsetLeft, top: element.offsetTop}
         }
         */

        function mouseDown(event) {
            var target = event.target;
            mapDiv = document.getElementById("viewEdition");
            menuDiv = document.getElementById("menuEdition");
            fullConteiner = document.getElementById("fullConteiner");
            // console.log("asdsad",mapDiv.offsetLeft,mapDiv.offsetTop)
            if (target.parentNode.getAttribute("class") === "pointOfTheMap") {

                target = target.parentNode;
                console.log(target)
                console.log(target.parentNode.parentNode)
                if (target.parentNode.getAttribute("id") === "mapDiv"||target.parentNode.parentNode.getAttribute("id") === "mapDiv") {
                    console.log(margin.left);
                    onMap = true;
                }
                dragObject = target;
                topMargin = target.offsetTop;
                margin.left = event.pageX + mapDiv.offsetLeft;
                pos.left = event.pageX;
                if (margeL != undefined) {
                    margeL = event.pageX;
                }
                pos.top = event.pageY;
                drag = true;
                document.ondragstart = function () {
                    return false
                }
                document.body.onselectstart = function () {
                    return false
                }
                return false;
            }
        }

        function mouseMove(event) {

            if (dragObject) {
                if (onMap) {
                    console.log("asdasd", fullConteiner.offsetLeft)
                    dragObject.style.position = "absolute";
                    dragObject.style.left = event.pageX - fullConteiner.offsetLeft - mapDiv.offsetLeft - 35 + "px";
                    dragObject.style.top = event.pageY - pos.top + topMargin + "px";
                    return false
                }
                dragObject.style.position = "absolute";
                dragObject.style.left = event.pageX - pos.left + "px";
                dragObject.style.top = event.pageY - pos.top + topMargin + "px";
            }
            return false
        }

        function mouseUp(event) {
            if (dragObject) {
                var el = dragObject.cloneNode(true);
                var parent = document.getElementById("mapDiv");
                parent.appendChild(el)
                dragObject.remove();
                dragObject = null;


                if (!onMap) {
                    el.style.position = "absolute";
                    el.style.left = event.pageX - margin.left - 15 + "px";
                    el.style.top = event.pageY - pos.top + topMargin + "px";
                }
                if (onMap) {
                    el.style.position = "absolute";
                    el.style.left = event.pageX - fullConteiner.offsetLeft - mapDiv.offsetLeft - 35 + "px";
                    el.style.top = event.pageY - pos.top + topMargin + "px";
                }
                onMap = false
                mapDiv = {};
                pos = {};
                margin = {};
                menuDiv = undefined;
                topMargin = undefined;
                leftMargin = undefined;
                onMap = undefined;
            }
        }

        return {
            init: function () {
                document.onmousemove = mouseMove;
                document.onmouseup = mouseUp;
            },
            makeDrag: function () {
                document.onmousedown = mouseDown;
            }
        }
    })()
    $scope.DragMap.init();
   $scope.DragMap.makeDrag();

    $scope.savePointsMap = function (course) {
        var node = document.getElementById("mapDiv");
        var objPointMap = {}
        for (var i = 0; i < node.childNodes.length; i++) {

            if (node.childNodes[i].nodeType !== 3&&node.childNodes[i].nodeType!==8) {
                for(var j=0;j<node.childNodes[i].childNodes.length;j++){
                    if (node.childNodes[i].childNodes[j].nodeType !== 3&&node.childNodes[i].childNodes[j].nodeType!==8) {
                        if(node.childNodes[i].childNodes[j].getAttribute("style")!==null){

                            var objPosition = {left: node.childNodes[i].childNodes[j].offsetLeft, top: node.childNodes[i].childNodes[j].offsetTop};
                            console.log("NGREPEAT ", j,objPosition);
                            objPointMap[node.childNodes[i].childNodes[j].childNodes[1].innerHTML] = objPosition;
                        }

                    }
                }

          if (node.childNodes[i].getAttribute("class") === "pointOfTheMap") {

                    var objPosition = {left: node.childNodes[i].offsetLeft, top: node.childNodes[i].offsetTop};
                    objPointMap[node.childNodes[i].childNodes[1].innerHTML] = objPosition;
                }
            }

        }
        console.log("!!!!!!!!!",objPointMap);
        for (var i = 0; i < course.modules.length; i++) {
            course.modules[i].map = objPointMap[i + 1]
        }
        console.log($scope.course);
        $scope.saveCourse();
    }
})/*.directive('mapPoint',function($document){
    return function (scope,element,attr) {
        //console.log("1",scope,"2",element,"3",attr);
        element.css({
        width: '40px',
        height: '40px',
        'border-radius': '16px',
        'background-color': 'red',
        float:'left',
        cursor:'pointer',
        'z-index': '1000',
        color: '#ffffff',
        'text-align': 'center'
        })
        console.log(element);

        element.on("mousedown",mouseDown)
        var dragObject
        var pos = {};
        var margin = {};
        var mapDiv;
        var menuDiv;
        var topMargin;
        var leftMargin;
        var onMap;
        var margeL;
        var fullConteiner;
        // console.log(menuDiv.offsetLeft)
            function getPosition(element) {
         return {left: element.offsetLeft, top: element.offsetTop}
         }


        function mouseDown(event) {
            var target = event.target.parentNode;
            dragObject = target;
            pos.left = event.pageX;
            pos.top = event.pageY;
            *//*var target = event.target;
            mapDiv = $document.getElementById("viewEdition");
            menuDiv = $document.getElementById("menuEdition");
            fullConteiner = $document.getElementById("fullConteiner");
            // console.log("asdsad",mapDiv.offsetLeft,mapDiv.offsetTop)
            if (target.parentNode.getAttribute("class") === "ng-scope") {
                console.log("POBEDA",event.target)
            }
            if (target.parentNode.getAttribute("class") === "pointOfTheMap") {
                // getPosition(target);
                target = target.parentNode;
                // console.log("PARENT",target.parentNode)
                if (target.parentNode.getAttribute("id") === "mapDiv") {
                    console.log(margin.left);
                    onMap = true;
                }
                dragObject = target;
                topMargin = target.offsetTop;
                margin.left = event.pageX + mapDiv.offsetLeft;
                pos.left = event.pageX;
                if (margeL != undefined) {
                    margeL = event.pageX;
                }
                pos.top = event.pageY;
                drag = true;

                return false;
            }*//*

            $document.on('mousemove', mouseMove);
            $document.on('mouseup', mouseUp);
            *//*$document.ondragstart = function () {
                return false
            }
            $document.body.onselectstart = function () {
                return false
            }*//*
        }

        function mouseMove(event) {

            dragObject.style.position = "absolute";
            dragObject.style.left = event.pageX - pos.left + "px";
            dragObject.style.top = event.pageY + "px";
            return false
        }

        function mouseUp(event) {
            $document.off('mousemove', mouseMove);
            $document.off('mouseup', mouseUp);
            if (dragObject) {
                var el = dragObject.cloneNode(true);
                var parent = $document.getElementById("mapDiv");
                parent.appendChild(el)
                dragObject.remove();
                dragObject = null;


                if (!onMap) {
                    el.style.position = "absolute";
                    el.style.left = event.pageX - margin.left - 15 + "px";
                    el.style.top = event.pageY - pos.top + topMargin + "px";
                }
                if (onMap) {
                    el.style.position = "absolute";
                    el.style.left = event.pageX - fullConteiner.offsetLeft - mapDiv.offsetLeft - 35 + "px";
                    el.style.top = event.pageY - pos.top + topMargin + "px";
                }
                onMap = false
                mapDiv = {};
                pos = {};
                margin = {};
                menuDiv = undefined;
                topMargin = undefined;
                leftMargin = undefined;
                onMap = undefined;

            }
        }
        *//*element.onmousedown = mouseDown;*//*
      *//*  return {
            init: function () {
                $document.onmousemove = mouseMove;
                $document.onmouseup = mouseUp;
            },
            makeDrag: function () {

            }
        }*//*
    }
})*/