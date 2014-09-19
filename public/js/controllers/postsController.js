/**
 * Created by igor on 7/2/14.
 */
app.controller('posts', function ($scope, $http, $sce, $state, $location, courseEdit) {
    'user strict';

    /****************config post**********************/
    $scope.triggerBool = true;
    $scope.comment = "";
    $scope.postdata = [];


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
                }
                courseEdit.searchPosts(searchObj);
            }
            $scope.countUserComments = function () {
                var count = 0;
                if ($scope.postdata !== undefined) {
                    for (var i = 0; i < courseEdit.postdata.length; i++) {
                        for (var j = 0; j < courseEdit.postdata[i].comments.length; j++) {
                            if (courseEdit.postdata[i].comments[j] !== 0) {
                                if (courseEdit.postdata[i].comments[j].creator === courseEdit.userdata._id && courseEdit.postdata[i].typePost !== "question") {
                                    count++;
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
            $scope.countUserAnswers = function () {
                var count = 0;
                if ($scope.postdata !== undefined) {
                    for (var i = 0; i < courseEdit.postdata.length; i++) {
                        for (var j = 0; j < courseEdit.postdata[i].comments.length; j++) {
                            if (courseEdit.postdata[i].comments[j] !== 0) {
                                if (courseEdit.postdata[i].comments[j].creator === courseEdit.userdata._id && courseEdit.postdata[i].typePost === "question") {
                                    count++;
                                }
                            }
                        }
                    }
                }
                if (count === 50) {
                    courseEdit.userHasBadge(courseEdit.listOfBadges[2], courseEdit.userdata);
                }
                if (count === 100) {
                    // courseEdit.userHasBadge(courseEdit.listOfBadges[9], courseEdit.userdata);
                }
                // console.log("count",count);
                return count;
            };
            $scope.countUserAnswers();
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
    $scope.deleteComment = function (comment, id, card,action) {
        if (confirm("Are you sure you wish to delete this?")) {
            for (var j = 0; j < card.comments.length; j++) {

                if (card.comments[j].postId === comment.postId) {

                    var commentt = card.comments.splice(j, 1);
                    var data = {"_id": id, "comments": card.comments,action:action};

                    $http.post('/comment/new', data).success(function () {
                        reqPosts();
                        reqUsers();
                    });
                }
            }
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

    $scope.comment={}
    $scope.addComment = function (idPost, creator, card, action) {
console.log($scope.comment[action])
        var comment=$scope.comment[action];
        if (card._id === idPost && this.comment !== "") {
            var date = Date.now();
            var newDate = new Date();
            card.comments.push({content: comment, creator: creator, postId: date, dataReg: dataReg(newDate), likes: []});

            var data = {"_id": idPost, "comments": card.comments, creator: card.creator, creatorComment: creator, typePost: card.typePost, action: action};
            $http.post('/comment/new', data).success(function () {
                if ($location.$$path.split("/")[1] === 'profile') {
                    //$scope.postdata = data.data;
                    return;
                }
                reqPosts();
                reqUsers();
                $scope.comment[action]=undefined;
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
    $scope.updateCard=function(post){
        $http.post("/post/update", post).success(function (data) {

        });
    }

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
            console.log("num", num)
        });
    };
    $scope.commentLike = function (index, user, likes, userId, post, action) {
        var likes = post.comments[index].likes;
        if (likes.indexOf(user) == (-1)) {
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
            $scope.answer.content=undefined;
            $scope.answerInputval = undefined;
            return;
        }
        $scope.answer.content=undefined;
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
        $scope.answer.content=undefined;
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
        var answerObj = {answerChecked: answer._id}
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
            $scope.comment.answer=undefined;
            $scope.change.answerNowComment = undefined;
            return;
        }
        $scope.comment.answer=undefined;
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
            $scope.comment.posts=undefined;
            $scope.change.postNowComment = undefined;
            return;
        }
        $scope.comment.posts=undefined;
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
        $scope.comment.posts=undefined;
        $scope.change.postNowComment = undefined;
        return;
    };

    $scope.sendFlagMail=function(post,content){
        $http.post("/notify/send/mail",[post,content]).success(function(){

        })
    }


});

