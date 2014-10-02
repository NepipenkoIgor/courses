/**
 * Created by igor on 7/2/14.
 */
app.controller('posts', function ($scope, $http, $sce, $state, $location, $modal,$sce,courseEdit, promiseUser) {
    'user strict';
    if($state.current.name==="posts"||$state.current.name==="editprofile"){
        $(".postLoad").show();
    }

    /****************config post**********************/
    $scope.triggerBool = true;
    $scope.comment = "";
    $scope.postdata = [];

    //console.log("promiseUser", typeof promiseUser.data)
    if (typeof promiseUser.data === "string") {
        // console.log($state.current.name)
        if ($state.current.name !== 'signup' &&
            $state.current.name !== 'signupadmin' &&
            $state.current.name !== 'forgot') {
            $location.url("/login");
        }
        return;
    }
    /*********************req init*****************************/


    function reqPosts() {
        $http.get('/posts').success(function (data) {


            $http.get("/answers").success(function (data) {
                $scope.answerObj = data.data;

                function sortArr(a, b) {

                    if (a.voteNum < b.voteNum) {
                        return 1;
                    }
                    if (a.voteNum > b.voteNum) {
                        return -1;
                    }
                    return 0;
                }

                $scope.postsAnswer = function (card) {
                    var answerObj = [];
                    var trueItem;
                    for (var i = 0; i < $scope.answerObj.length; i++) {
                        if (card._id === $scope.answerObj[i].postId) {
                            if (!$scope.answerObj[i].voteNum) {
                                $scope.answerObj[i].voteNum = 0;
                            }

                            if ($scope.answerObj[i].corectAnswer) {
                                trueItem = $scope.answerObj[i]

                                continue;
                            }
                            answerObj.push($scope.answerObj[i]);
                        }
                    }
                    //console.log(answerObj)
                    answerObj = answerObj.sort(sortArr);
                    // console.log(answerObj)
                    if (trueItem) {
                        answerObj.unshift(trueItem);
                    }
                    // console.log("answerObj",answerObj)
                    return answerObj;
                };


                $scope.countUserAnswers = function () {
                    var count = 0;

                    if ($scope.answerObj !== undefined) {
                        for (var i = 0; i < $scope.answerObj.length; i++) {
                            if ($scope.answerObj[i].creator === courseEdit.userdata._id) {

                                count++;
                            }
                        }
                    }
                    if (count === 50) {

                        courseEdit.userHasBadge(courseEdit.listOfBadges[2], courseEdit.userdata);
                    }
                    if (count === 100) {
                        courseEdit.userHasBadge(courseEdit.listOfBadges[5], courseEdit.userdata);
                    }
                    return count;
                };
                $scope.countUserAnswers();

                $scope.countUserComments = function () {
                    var count = 0;
                    if ($scope.postdata !== undefined) {
                        for (var i = 0; i < courseEdit.postdata.length; i++) {
                            for (var j = 0; j < courseEdit.postdata[i].comments.length; j++) {
                                if (courseEdit.postdata[i].comments[j] !== 0) {
                                    if (courseEdit.postdata[i].comments[j].creator === courseEdit.userdata._id) {
                                        count++;
                                    }
                                }
                            }
                        }
                        if ($scope.answerObj !== undefined) {
                            for (var i = 0; i < $scope.answerObj.length; i++) {
                                for (var j = 0; j < $scope.answerObj[i].comments.length; j++) {
                                    if ($scope.answerObj[i].comments[j] !== 0) {
                                        if ($scope.answerObj[i].comments[j].creator === courseEdit.userdata._id) {
                                            count++;
                                        }
                                    }
                                }
                            }
                        }

                    }
                    if (count === 50) {
                        courseEdit.userHasBadge(courseEdit.listOfBadges[3], courseEdit.userdata);
                    }
                    if (count === 100) {
                        courseEdit.userHasBadge(courseEdit.listOfBadges[8], courseEdit.userdata);
                    }

                    return count;
                };
                $scope.countUserComments();


            });
            //      console.log("postdata",data);
            $scope.postdata = data;//.reverse();
            courseEdit.postdata = $scope.postdata;
            $(".fancybox").fancybox();
            var loc = $location.$$path.split("/");
            if ($location.$$path === "/post/all") {
                var searchObj = {};
                switch ($location.search().type) {
                    case 'allposts':
                        searchObj.type = 'allposts';
                        break;
                    case 'myposts':
                        searchObj.type = 'myposts';
                        searchObj.creator = courseEdit.userdata._id;
                        break;
                    case 'myquestions':
                        searchObj.type = 'myquestions';
                        searchObj.creator = courseEdit.userdata._id;
                        searchObj.typePost = "question";
                        break;
                    case 'questions':
                        searchObj.type = 'questions';
                        searchObj.typePost = "question";
                        break;
                    case 'notifypost':
                        searchObj.type = 'notifypost';
                        searchObj.post = $location.search().post;
                        break;
                    case 'popular':
                        searchObj.type = 'popular';
                        break;
                    case 'tags':
                        searchObj.type = 'allposts';
                        break;
                }
                courseEdit.searchPosts(searchObj);
            }


            $scope.countUserPost = function (id) {
                var count = 0;
                if ($scope.postdata !== undefined) {
                    for (var i = 0; i < courseEdit.postdata.length; i++) {
                        if (courseEdit.postdata[i].creator === id && courseEdit.postdata[i].typePost !== "question") {
                            count++;
                        }
                    }
                }
                if (count === 50) {
                    // courseEdit.userHasBadge(courseEdit.listOfBadges[2], courseEdit.userdata);
                }
                if (count === 100) {
                    courseEdit.userHasBadge(courseEdit.listOfBadges[6], courseEdit.userdata);
                }
                return count;
            };
            $scope.countUserQuestion = function (id) {
                var count = 0;
                if ($scope.postdata !== undefined) {
                    for (var i = 0; i < courseEdit.postdata.length; i++) {
                        if (courseEdit.postdata[i].creator === id && courseEdit.postdata[i].typePost === "question") {
                            count++;
                        }
                    }
                }
                if (count === 50) {
                    courseEdit.userHasBadge(courseEdit.listOfBadges[4], courseEdit.userdata);
                }
                if (count === 100) {
                    courseEdit.userHasBadge(courseEdit.listOfBadges[7], courseEdit.userdata);
                }
                return count;
            };
            courseEdit.countUserPost = $scope.countUserPost;

        });

    }

    courseEdit.reqPosts = reqPosts;

    $scope.triggerView = function (bool) {
        $scope.triggerBool = bool;
    };


    function reqUsers() {
        $http.get('/users').success(function (data) {
            $scope.postUsersdata = data;
            var init = false;
            var loc = $location.$$path.split("/");
            if (loc[1] === 'profile') {
                if (loc[2]) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].username === loc[2]) {
                            if (data[i]._id === $scope.userdata._id) {
                                $scope.userNowView = $scope.userdata;
                                init = true;
                                break;
                            }
                            $scope.userNowView = data[i];
                            $scope.editionType.type = false;
                            init = true;
                            break;
                        }


                    }
                    if (!init) {

                        $state.go('404');
                        init = false;
                    }

                    var searchObj = {};
                    searchObj.type = 'myposts';
                    searchObj.creator = $scope.userNowView._id;
                    courseEdit.searchPosts(searchObj);

                    $scope.viewBadgeOfUser = function (user) {
                        $scope.profileBadge = courseEdit.eqvalBadges(user);

                    };
                }
            }
            $scope.styleName = function (user1, user2) {
                if (user1 !== user2) {
                    // console.log("tytyty")
                    return {'top': '-11px'};
                }
                return {'top': '0px'};
            };
            $scope.postAvatar = function (id) {
                for (var i = 0; i < $scope.postUsersdata.length; i++) {
                    if ($scope.postUsersdata[i]._id === id) {
                        var userPostAvatar = $scope.postUsersdata[i].avatar;
                    }
                }
                var url = userPostAvatar || 'img/user.jpg';

                return $sce.trustAsResourceUrl(url);
            };
        });

    }

    reqPosts();
    reqUsers();
    courseEdit.reqPosts = reqPosts;
    courseEdit.reqUsers = reqUsers;


    /************post and  comment**************/


    $scope.deletePost = function (id) {
        if (confirm("Are you sure you wish to delete this?")) {
            for (var i = 0; i < $scope.postdata.length; i++) {
                if ($scope.postdata[i]._id === id) {

                    var remove = $scope.postdata.splice(i, 1);

                    var obj = {"_id": id, img: remove[0].img};

                    $http.post('/post/delete', obj).success(function () {

                        reqPosts();
                        reqUsers();
                    });
                }

            }
        }

    };
    $scope.deleteComment = function (comment, id, card, action) {
        if (confirm("Are you sure you wish to delete this?")) {
            for (var j = 0; j < card.comments.length; j++) {

                if (card.comments[j].postId === comment.postId) {

                    var commentt = card.comments.splice(j, 1);
                    var data = {"_id": id, "comments": card.comments, action: action};

                    $http.post('/comment/new', data).success(function () {
                        reqPosts();
                        reqUsers();
                    });
                }
            }
        }
    };


    $scope.deleteAnswer=function(card) {
        //console.log(card._id)
        if (confirm("Are you sure you wish to delete this?")) {
            var data = {id:card._id};
            $http.post('/answer/delete', data).success(function () {
                reqPosts();
                reqUsers();
            });
        }
    };
    /********add comment**********/


    $scope.tags = [];


    function dataReg(data) {
        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        var newDataDate = data.getDate();
        var newDataMonth = monthNames[data.getMonth()];
        var newDataYear = data.getFullYear();
        return newDataDate + " " + newDataMonth + " " + newDataYear;
    }

    $scope.comment = {};
    $scope.addComment = function (idPost, creator, card, action) {
        var comment = $scope.comment[action];
        if (card._id === idPost && this.comment !== "") {
            var date = Date.now();
            var newDate = new Date();
            card.comments.push({content: comment, creator: creator, postId: date, dataReg: newDate, likes: []});

            var data = {"_id": idPost, "comments": card.comments, creator: card.creator, creatorComment: creator, typePost: card.typePost, action: action,parentAnswerId:card.postId};
            $http.post('/comment/new', data).success(function () {
                if ($location.$$path.split("/")[1] === 'profile') {
                    //$scope.postdata = data.data;
                    return;
                }
                reqPosts();
                reqUsers();
                $scope.comment[action] = undefined;
            });
        }
    };

    $scope.setId = function (id) {
        if (this.id === id) {
            this.id = "";
            return;

        }

        if (!this.id || this.id !== id) {
            this.id = id;
            return;
        }


    };

    /****************update comment**********************/





    $scope.updateComment = function (post, action) {

        $http.post("/comment/update", [post, action]).success(function (data) {

        });
    };
    $scope.updateCard = function (post) {
        $http.post("/post/update", post).success(function (data) {

        });
    };

    /******************logic differences of posts**********************/
    $scope.getCreator = function (id) {
        var userCreator;
        if ($scope.postUsersdata) {
            for (var i = 0; i < $scope.postUsersdata.length; i++) {
                if ($scope.postUsersdata[i]._id === id) {
                    userCreator = $scope.postUsersdata[i].firstname;
                }
            }
        }
        return userCreator;
    };


    $scope.postsOfUnit = function (postId, unitId) {
        if (postId === unitId) {
            return true;
        }
        return false;
    };
    $scope.ifThisIsAvtor = function (nowUser, AvtorId) {
        if (nowUser.position === true) {
            return true;
        }
        if (nowUser._id === AvtorId) {
            return true;
        }
        return false;
    };


    /****************logic of likes*******************/


    $scope.like = function (userId, arrayLikes, postId, post) {
        if (arrayLikes.indexOf(userId) === (-1)) {
            arrayLikes.push(userId);
            $scope.updateLikes(postId, arrayLikes, userId, post);
            return;
        }
        for (var i = 0; i < arrayLikes.length; i++) {
            if (arrayLikes[i] === userId) {
                arrayLikes.splice(i, 1);
                $scope.updateLikes(postId, arrayLikes);
                return;
            }
        }
    };
    $scope.updateLikes = function (postId, likes, userId, post) {
        var date = {_id: postId, likes: likes, userHowLike: userId, post: post, likesNum: likes.length};
        $http.post('/postslikes', date).success(function (num) {
            // console.log("num", num)
        });
    };
    $scope.commentLike = function (index, user, likes, userId, post, action) {
        var likes = post.comments[index].likes;
        if (likes.indexOf(user) === (-1)) {
            likes.push(user);
            $scope.updateCommentLikes(post, post.comments[index].creator, user, true, action);
        } else {
            likes.splice(likes.indexOf(user), 1);
            $scope.updateCommentLikes(post, post.comments[index].creator, user, false, action);
        }
    };

    $scope.updateCommentLikes = function (post, user, usersHowLike, cillLike, action) {

        $http.post('/commentlikes', [post, user, usersHowLike, cillLike, action]).success(function (num) {
        });
    };


    /***********************search post******************************/


    $scope.searchPosts = function (searchObj) {
        $(".postLoad").show();
        $http.post('/post/search', searchObj).success(function (data) {

            if ($location.$$path.split("/")[1] === 'profile') {
                $scope.postdata = data.data;

                $scope.postdata.push([null]);
                setTimeout(function () {
                    $scope.postdata.splice($scope.postdata.length - 1, 1);
                    $scope.$apply();
                    $(".postLoad").hide();
                }, 4);

                if ($scope.postdata.length === 0) {
                    if (data.type === "myposts") {
                        $scope.postTitle = "user has made no posts and questions";

                        return;
                    }
                    if (data.type === "myquestions") {
                        $scope.postTitle = "user has asked no questions";

                        return;
                    }
                    if (data.type === "onlyposts") {
                        $scope.postTitle = "user has made no posts";

                        return;
                    }
                }
                return;
            }
            if (data.data !== undefined) {

                $scope.postdata = data.data;
                $location.url("/post/all?type=" + data.type);

                if($location.$$url.split("?")[1].split("=")[1]!=="date"){
                    $scope.dtAfter=undefined;
                    $scope.dtBefore=undefined;
                }
                // $scope.chengedSearchIcon=data.type;
                $scope.page = $scope.postdata.length / 10;
                $scope.scrolling = 800;

                $scope.down = false;
                $scope.remove = $scope.postdata.splice(10, $scope.postdata.length);

                if (data.type === "popular") {
                    $scope.postdata.push([null]);
                    setTimeout(function () {
                        $scope.postdata.splice($scope.postdata.length - 1, 1);
                        $scope.$apply();
                        $(".postLoad").hide();
                    }, 4);
                    return;
                }
                $scope.postdata.push([null]);
                setTimeout(function () {
                    $scope.postdata.splice($scope.postdata.length - 1, 1);
                    $scope.$apply();
                    $(".postLoad").hide();
                    $(".fancybox").fancybox();
                }, 4);
                return;
            }

        });
    };
    courseEdit.searchPosts = $scope.searchPosts;

    $scope.searchByTag = function (tag) {
        var searchObj = {type: "tags", tag: tag};
        courseEdit.searchPosts(searchObj);
    };
    if (document.getElementById("post") && document.getElementById("question")) {
        document.getElementById("post").checked = true;
        document.getElementById("question").checked = false;
    }


    $scope.typeCheck = true;
    $scope.chekNewPost = function (bool) {
        if (bool) {
            document.getElementById("post").checked = true;
            document.getElementById("question").checked = false;
            $scope.typeCheck = true;
            return;
        }
        document.getElementById("post").checked = false;
        document.getElementById("question").checked = true;
        $scope.typeCheck = false;
    };


    /********************progress count view***************************/


    $http.get("/units").success(function (list) {
        $scope.list = list;

        $http.get("/user").success(function (user) {

            $scope.user = user;
            var progressCanvas = document.getElementById("progreesCanvas");
            if (progressCanvas) {

                var progressContext = progressCanvas.getContext('2d');

                progressContext.beginPath();
                progressContext.arc(150, 100, 80, 0, 2 * Math.PI);
                progressContext.strokeStyle = '#313F4E';
                progressContext.lineWidth = 20;
                progressContext.stroke();

                courseEdit.totalPointsOfAllCourse();

                var attitude = courseEdit.pointsCalculate($scope.user.progress) / courseEdit.totalPointsOfAllCourse($scope.list);

                if (isNaN(attitude)) {
                    attitude = 0;
                }
                if (attitude > 0.99 && attitude < 1) {
                    attitude = 0.99;
                }
                var progressProcent = Math.round(attitude * 100);
                var arcle = attitude * 2 * Math.PI;

                var rotation;
                if (arcle < 0.5) {
                    rotation = 1.5 * Math.PI + arcle;
                }
                if (arcle > 0.5) {
                    rotation = arcle - 0.5 * Math.PI;
                }

                progressContext.beginPath();

                if (arcle > 6.28) {
                    progressContext.arc(150, 100, 80, 0, 0.5 * Math.PI + rotation);
                } else {
                    progressContext.arc(150, 100, 80, 1.5 * Math.PI, rotation);
                }
                progressContext.strokeStyle = 'green';
                progressContext.lineWidth = 20;
                progressContext.stroke();
                var x, y;

                if (progressProcent < 10) {
                    x = 125;
                    y = 125;
                }
                if (progressProcent > 10) {
                    x = 103;
                    y = 125;
                }
                if (progressProcent === 100) {
                    x = 78;
                    y = 125;
                }
                progressContext.font = ' 70pt Calibri';
                progressContext.fillStyle = 'white';
                progressContext.fillText(progressProcent, x, y);
            }
        });
    });


    /*********************scrolling post***************************/


    $scope.scrolling = 800;

    window.onscroll = function (event) {
        if ($scope.scrolling < window.scrollY) {
            if ($scope.down) {
                return;
            }

            var mass = $scope.remove.splice(10, $scope.remove.length);

            $scope.scrolling += 1200;
            $scope.postdata = $scope.postdata.concat($scope.remove);
            $scope.remove = mass;
            $scope.postdata.push([null]);
            setTimeout(function () {
                $scope.postdata.splice($scope.postdata.length - 1, 1);
                $scope.$apply();
            }, 4);
            if (mass.length === 0) {
                $scope.down = true;
            }
        }

    };

    $scope.postProfileGo = function (id) {

        for (var i = 0; i < $scope.postUsersdata.length; i++) {

            if ($scope.postUsersdata[i]._id === id) {

                $state.go('editprofile', ({username: $scope.postUsersdata[i].username}));
            }
        }

    };
    $scope.postType = function (type) {
        if (type === "question") {
            return {
                'margin-bottom': '15px',
                'border-top': '5px solid #C03F3F'
            };
        }
        return {
            'margin-bottom': '15px',
            'border-top': '5px solid #3FA6C0'
        };
    };
    $scope.answerTrigger = function (type) {

        if (type === "question") {
            return true;
        }
        return false;
    };

    $scope.fafaLikes = function (type) {
        if (type === "question") {
            return "fa fa-arrow-circle-up";
        }
        return "fa fa-plus";
    };
    $scope.answerInputval;

    $scope.showAnswerInput = function (id) {
        if ($scope.answerInputval === id) {
            $scope.answer.content = undefined;
            $scope.answerInputval = undefined;
            return;
        }
        $scope.answer.content = undefined;
        $scope.answerInputval = id;
        return;

    };

    $scope.answer = {};
    $scope.answerInput = function (id) {

        if (id === $scope.answerInputval) {

            return true;
        }
        return false;
    };
    $scope.answerInputClose = function () {
        $scope.answer.content = undefined;
        $scope.answerInputval = undefined;
    };


    $scope.newAnswer = function (userAnswer, card) {

        var dataObj = {creatorAnswer: userAnswer, postAnswered: card._id, content: $scope.answer.content}
        $http.post("/answer/new", dataObj).success(function (data) {

            $scope.answerInputClose();
            courseEdit.reqPosts();
            $state.go('posts').then(function () {
                //$(".postLoad").hide();
                $location.url("/post/all?type=allposts");

            });
        });
    };


    $scope.checkWriteAnswer = function (answer, creator, userWhoCheck, answers) {
        if (creator !== userWhoCheck) {
            return;
        }
        for (var i = 0; i < answers.length; i++) {
            if (answers[i].corectAnswer === true) {
                return;
            }
        }
        var answerObj = {answerChecked: answer._id};
        $http.post("/answer/check", answerObj).success(function (data) {
            courseEdit.reqPosts();
            $state.go('posts').then(function () {
                //$(".postLoad").hide();
                $location.url("/post/all?type=allposts");

            });
        });
    };

    $scope.isChecked = function (answer, element) {
        if (answer.corectAnswer && element) {
            return {"color": "#49D726"};
        }
        if (answer.corectAnswer) {
            return {"border-top": "3px solid #49D726"};
        }
        return {};
    };

    $scope.numVote = function (answer) {
        var vote = 0;
        if (answer.voteNum) {
            vote += answer.voteNum;
        }

        return vote
    };


    $scope.voteUpdate = function (voteObj) {
        $http.post("/answer/vote", voteObj).success(function (data) {
            courseEdit.reqPosts();
            $state.go('posts').then(function () {
                //$(".postLoad").hide();
                $location.url("/post/all?type=allposts");

            });
        });
    };

    $scope.voteUp = function (answer, whoVote) {
        if (answer.votes.indexOf(whoVote) !== (-1)) {
            return;
        }
        var voteObj = {answerId: answer._id, whoVote: whoVote, action: "up"};
        $scope.voteUpdate(voteObj);
    };
    $scope.voteDown = function (answer, whoVote) {
        if (answer.votes.indexOf(whoVote) !== (-1)) {
            return;
        }
        var voteObj = {answerId: answer._id, whoVote: whoVote, action: "down"};
        $scope.voteUpdate(voteObj);
    };

    $scope.dontVote = function (answer, whoVote) {
        if (answer.votes.indexOf(whoVote) !== (-1)) {
            return {"color": "#D5D5D5"};
        }
        return {};
    };

    $scope.change = {};

    $scope.answerCommentsShow = function (answer) {
        // console.log($scope.change.answerNowComment===answer._id);
        if ($scope.change.answerNowComment === answer._id) {
            $scope.comment.answer = undefined;
            $scope.change.answerNowComment = undefined;
            return;
        }
        $scope.comment.answer = undefined;
        $scope.change.answerNowComment = answer._id;
    };

    $scope.whatAnswerCommentShow = function (answer) {
        if (answer._id === $scope.change.answerNowComment) {
            return true;
        }
        return false;
    };


    $scope.postCommentsShow = function (answer) {
        // console.log($scope.change.answerNowComment===answer._id);
        if ($scope.change.postNowComment === answer._id) {
            $scope.comment.posts = undefined;
            $scope.change.postNowComment = undefined;
            return;
        }
        $scope.comment.posts = undefined;
        $scope.change.postNowComment = answer._id;
    };

    $scope.whatPostCommentShow = function (answer) {
        if (answer._id === $scope.change.postNowComment) {
            //$scope.comment.posts=undefined;
            return true;
        }
        //$scope.comment.posts=undefined;
        return false;
    };
    $scope.commentsInputClose = function () {
        $scope.comment.posts = undefined;
        $scope.change.postNowComment = undefined;
        return;
    };

    $scope.sendFlagMail = function (post, content) {
        $http.post("/notify/send/mail", [post, content]).success(function () {

        });
    };

    $scope.borderCommentRadius = function (card, index, answer, type) {


        if ($scope.postsAnswer) {

            if (card.typePost === "question" && $scope.postsAnswer(card).length === 0) {
                if(type==="button"){
                    return {"border-bottom-left-radius": "25px"};
                }
                if($scope.answerInputval===card._id&&type==="commentPostButton"){
                    return {"border-radius": "0 0 0 0"};
                }
                return {"border-radius": "0 0 25px 25px"};
            }


        }

        if (answer && (answer.length - 1) === index) {
            return {"border-radius": "0 0 25px 25px"};
        }
       /* if (type) {
            return;
        }*/
        if (card.typePost !== "question") {
            return {"border-radius": "0 0 25px 25px"};
        }
        return;
    };



/*    $scope.openNewPass = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'myModalNewPass.html',
            controller: ModalNewPassContrl,
            size: size,
            resolve: {
                email: function () {
                    return courseEdit.userdata.email;
                }
            }
        });


    };
    var ModalNewPassContrl = function ($scope, $modalInstance,email) {
        $scope.email=email;
        $scope.name = {};
        var text = /[a-zA-Z]/;
        var textCaps = /[A-Z]/;
        var notextnum = /[^\w\-]/;
        var num = /\d/;
        var validmail = /([\w\-]{1,20}\.)*([\w\-]{1,20})\@([\w\-]{1,20}\.)*([\w\-]{1,20})\.([a-z]{2,5})$/;

        angular.element("#ChangePasswordForm").keypress(function(event){
            if(event.keyCode===13){
                if($scope.password&&!!$scope.comfpassword){
                    return;
                }
                event.preventDefault();
            }
        });

        $scope.trueValidate=function(){
            //console.log(!!$scope.firstname&&!!$scope.lastname&&!!$scope.email&&!!$scope.password&&!!$scope.comfpassword&&!!$scope.code)
            if(!!$scope.oldPassword&&!!$scope.password&&!!$scope.comfpassword){
                $("#submitNewPass").removeClass("button-bad").removeClass("disabled").addClass("btn-primary");
                return;
            }
            $("#submitNewPass").removeClass("btn-primary").addClass("button-bad").addClass("disabled");
            return;
        };


        var reqPass = function (data,event,name) {
            $http.post("/true/oldpass", {"pass": data,email:$scope.email}).success(function (promisedate) {
                console.log(promisedate)
                if (promisedate.success === true) {
                    $(event.currentTarget).parent().removeClass("has-error").addClass("has-success");
                    $(event.currentTarget).next().removeClass("glyphicon-remove").addClass("glyphicon-ok");
                    $scope.name[name] = "success validation";
                    $scope.oldPassword=true;
                    $scope.trueValidate();
                    return;
                }
                //$(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
                $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
                $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
                $scope.name[name] = "this password not true";
                $scope.oldPassword=false;
                $scope.trueValidate();
                return;
            });
        };
        var deferredCode = _.debounce(reqPass, 300);
        $scope.validOldPass=function(event,name){
            deferredCode(event.currentTarget.value,event,name);
        };



        $scope.validPassword = function (event, name) {
            //
            if (event.currentTarget.value.length === 0) {
                //$(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
                $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
                $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
                $scope.name[name] = "password can not be zero length";
                $scope.password=false;
                $scope.trueValidate();

            }
            if (notextnum.test(event.currentTarget.value) === true) {
                // $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
                $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
                $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
                $scope.name[name] = "password can only contain letters and numbers";
                $scope.password=false;
                $scope.trueValidate();
                return;
            }
            if ((text.test(event.currentTarget.value) && num.test(event.currentTarget.value)) === true) {
                //$(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
                $(event.currentTarget).parent().removeClass("has-error").addClass("has-success");
                $(event.currentTarget).next().removeClass("glyphicon-remove").addClass("glyphicon-ok");
                $scope.name[name] = "success validation";
                $scope.value = event.currentTarget.value;
                $scope.password=true;
                $scope.trueValidate();
                //console.log($scope.value)
                return;
            }
            if (text.test(event.currentTarget.value) === true) {
                // $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
                $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
                $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
                $scope.name[name] = "password can't only contain letters ,add numbers";
                $scope.password=false;
                $scope.trueValidate();
                return;
            }
            if (num.test(event.currentTarget.value) === true) {
                // $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
                $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
                $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
                $scope.name[name] = "password can't only contain numbers ,add letters";
                $scope.password=false;
                $scope.trueValidate();
                return;
            }
        };
        $scope.comfPassword = function (event, name) {
            if (event.currentTarget.value !== $scope.value || event.currentTarget.value.length === 0) {
                // $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
                $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
                $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
                $scope.name[name] = "password fields do not match";
                $scope.comfpassword=false;
                $scope.trueValidate();
                return;
            }
            // $(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
            $(event.currentTarget).parent().removeClass("has-error").addClass("has-success");
            $(event.currentTarget).next().removeClass("glyphicon-remove").addClass("glyphicon-ok");
            $scope.name[name] = "success validation";
            $scope.comfpassword=true;
            $scope.trueValidate();
            return;
        };


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
    };*/
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&amp/g, "&;")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    }
  $scope.transformContent=function(content){
      if(content){
          var converter = new Markdown.Converter();

          if($('code')){
              $('code').each(function(i, block) {
                  //console.log(i,)
                 if(!$(block).hasClass('hljs')) {
                      hljs.configure({
                          useBR: true,
                          languages: ['xml', 'javascript']
                      });
                      hljs.highlightBlock(block);
                  }
              });
         }
          var markdown = Markdown.getSanitizingConverter();
          var  text=markdown.makeHtml(content);
          return $sce.trustAsHtml(text);
      }

    };


    $scope.opened={};
    $scope.initDate=Date.now()
    $scope.formatDate = 'dd-MMMM-yyyy';
    $scope.openDate = function($event,position) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened[position] = true;
    };


    $scope.onChengeDate=function(){

        $scope.minDate=$scope.dtAfter;
        $scope.maxDate=$scope.dtBefore;
       // console.log( Date.parse($scope.minDate),Date.parse($scope.maxDate));
        if($scope.dtAfter&&$scope.dtBefore){

            $scope.searchPosts({type:"date",dateAfter:$scope.dtAfter,dateBefore:$scope.dtBefore});
        }
    };
 /*   $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : $scope.dtAfter;
    };
    $scope.toggleMax = function() {
        $scope.maxDate = $scope.maxDate ? null : $scope.dtBefore;
    };*/
    $scope.dataReg=function (data) {
        var data=new Date(data);
        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        var newDataDate = data.getDate();
        var newDataMonth = monthNames[data.getMonth()];
        var newDataYear = data.getFullYear();
        return newDataDate + " " + newDataMonth + " " + newDataYear;
    };
});

