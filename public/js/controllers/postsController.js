/**
 * Created by igor on 7/2/14.
 */
app.controller('posts', function ($scope, $http, $sce, $state, $location, courseEdit) {
    'user strict';

    /****************config post**********************/

    $scope.comment = "";
    $scope.postdata = [];
    function reqPosts() {
        $http.get('/posts').success(function (data) {

            //      console.log("postdata",data);
            $scope.postdata = data;//.reverse();
            courseEdit.postdata = $scope.postdata;
            var loc = $location.$$path.split("/")
            if (loc[1] === 'profile') {

                var searchObj = {};
                searchObj.type = 'myposts';
                searchObj.creator = courseEdit.userdata._id;
                courseEdit.searchPosts(searchObj);
            }

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
            $scope.countUserComments=function(){
                var count = 0;
                if ($scope.postdata !== undefined) {
                    for (var i = 0; i < courseEdit.postdata.length; i++) {
                        for (var j = 0; j < courseEdit.postdata[i].comments.length; j++) {
                            if(courseEdit.postdata[i].comments[j]!==0) {
                                if (courseEdit.postdata[i].comments[j].creator === courseEdit.userdata._id && courseEdit.postdata[i].typePost !== "question") {
                                    count++;
                                }
                            }
                        }
                    }
                }
                if(count===50){
                    courseEdit.userHasBadge(courseEdit.listOfBadges[3], courseEdit.userdata);
                }
                if(count===100){
                    courseEdit.userHasBadge(courseEdit.listOfBadges[8], courseEdit.userdata);
                }
               // console.log("count",count);
                return count;
            };
            $scope.countUserComments();
            $scope.countUserAnswers=function(){
                var count = 0;
                if ($scope.postdata !== undefined) {
                    for (var i = 0; i < courseEdit.postdata.length; i++) {
                        for (var j = 0; j < courseEdit.postdata[i].comments.length; j++) {
                            if(courseEdit.postdata[i].comments[j]!==0) {
                                if (courseEdit.postdata[i].comments[j].creator === courseEdit.userdata._id && courseEdit.postdata[i].typePost === "question") {
                                    count++;
                                }
                            }
                        }
                    }
                }
                if(count===50){
                    courseEdit.userHasBadge(courseEdit.listOfBadges[2], courseEdit.userdata);
                }
                if(count===100){
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
                if(count===50){
                   // courseEdit.userHasBadge(courseEdit.listOfBadges[2], courseEdit.userdata);
                }
                if(count===100){
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
                if(count===50){
                    courseEdit.userHasBadge(courseEdit.listOfBadges[4], courseEdit.userdata);
                }
                if(count===100){
                    courseEdit.userHasBadge(courseEdit.listOfBadges[7], courseEdit.userdata);
                }
                return count;
            };
            courseEdit.countUserPost = $scope.countUserPost;

        });

    }


    function reqUsers() {
        $http.get('/users').success(function (data) {
            $scope.postUsersdata = data;

            var loc = $location.$$path.split("/");
            if (loc[1] === 'profile') {
                if (loc[2]) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].username === loc[2]) {
                            if (data[i]._id === $scope.userdata._id) {
                                $scope.userNowView = $scope.userdata;
                                break;
                            }
                            $scope.userNowView = data[i];
                            $scope.editionType.type = false;
                            break;
                        }
                    }
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
                var url = userPostAvatar || 'http://karalmik.com/wp-content/uploads/2013/03/29-150x150.jpg';

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
        if (confirm("you really want to delete?????")) {
            for (var i = 0; i < $scope.postdata.length; i++) {
                if ($scope.postdata[i]._id === id) {

                    $scope.postdata.splice(i, 1);

                    var id = {"_id": id};
                    $http.post('/post/delete', id).success(function () {

                        reqPosts();
                        reqUsers();
                    });
                }

            }
        }

    };
    $scope.deleteComment = function (comment, id, card) {
        for (var j = 0; j < card.comments.length; j++) {

            if (card.comments[j].postId === comment.postId) {

                var commentt = card.comments.splice(j, 1);
                var data = {"_id": id, "comments": card.comments};

                $http.post('/comment/new', data).success(function () {
                    reqPosts();
                    reqUsers();
                });
            }
        }

    };

    /********save post**********/
    $scope.tags = [];

    $scope.saveNewPost = function (creator) {
        console.log($scope.tags)
        courseEdit.userHasBadge(courseEdit.listOfBadges[0], courseEdit.userdata);
        var newPost = {title: $scope.title, content: $scope.content, tags: $scope.tags, creator: creator};
        $http.post('/post/new', newPost).success(function (data) {
           // reqPosts();
            $state.go('posts').then(function () {
                $location.url("/post/all?type=allposts");

            });
        });
    };

    function dataReg(data) {
        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        var newDataDate = data.getDate();
        var newDataMonth = monthNames[data.getMonth()];
        var newDataYear = data.getFullYear();
        return newDataDate + " " + newDataMonth + " " + newDataYear;
    }

    $scope.addComment = function (idPost, creator, card) {


        if (card._id === idPost && this.comment !== "") {
            var date = Date.now();
            var newDate = new Date();
            card.comments.push({content: this.comment, creator: creator, postId: date, dataReg: dataReg(newDate), likes: []});

            var data = {"_id": idPost, "comments": card.comments, creator: card.creator, creatorComment: creator, typePost: card.typePost};
            $http.post('/comment/new', data).success(function () {
                if ($location.$$path.split("/")[1] === 'profile') {
                    //$scope.postdata = data.data;
                    return;
                }
                reqPosts();
                reqUsers();

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
    $scope.saveNewQuestion = function (creator, unit) {
        courseEdit.userHasBadge(courseEdit.listOfBadges[1], courseEdit.userdata);
        $scope.tags.unshift({"text": courseEdit.positionInCourse.course + "." + courseEdit.positionInCourse.module + "." + courseEdit.positionInCourse.section + "." + courseEdit.positionInCourse.unit});
        console.log($scope.tags)
        var newQuestion = {title: $scope.title, content: $scope.content, tags: $scope.tags, creator: creator, unit: unit, typePost: "question"};
        $http.post('/post/new', newQuestion).success(function (data) {
            // $scope.showQuestionBlock=false;
            reqPosts();

        });

    };
/****************update comment**********************/





$scope.updateComment=function(post){
    console.log(post)
    $http.post("/comment/update",post).success(function(data){
        console.log(data)
    })
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
            console.log("num",num)
        });
    };
    $scope.commentLike = function (index, user, likes, userId, post) {
        var likes = post.comments[index].likes;
        if (likes.indexOf(user) == (-1)) {
            likes.push(user);
            $scope.updateCommentLikes(post,post.comments[index].creator,user,true);
        } else {
            likes.splice(likes.indexOf(user), 1);
            $scope.updateCommentLikes(post,post.comments[index].creator,user,false);
        }

      //  console.log(index, likes, userId, post)
    };

    $scope.updateCommentLikes = function (post,user,usersHowLike,cillLike) {
        console.log(post,user,usersHowLike,cillLike)
        //var date = {_id: postId, likes: likes, userHowLike: userId, post: post, likesNum: likes.length};
        $http.post('/commentlikes', [post,user,usersHowLike,cillLike]).success(function (num) {
        });
    };


    $scope.searchPosts = function (searchObj) {
        $http.post('/post/search', searchObj).success(function (data) {

            if ($location.$$path.split("/")[1] === 'profile') {
                $scope.postdata = data.data;
               // console.log( data)
                if($scope.postdata.length===0){
                    if(data.type==="myposts"){
                        $scope.postTitle="user has made no posts and questions";
                       // $scope.$apply();
                        return;
                    }
                    if(data.type==="myquestions"){
                        $scope.postTitle="user has asked no questions";
                       // $scope.$apply();
                        return;
                    }
                    if(data.type==="onlyposts"){
                        $scope.postTitle="user has made no posts";
                        // $scope.$apply();
                        return;
                    }
                }
                return;
            }
            if (data.data !== undefined) {

                $scope.postdata = data.data;
                $location.url("/post/all?type=" + data.type);

                $scope.page = $scope.postdata.length / 10;
                $scope.scrolling = 800;
              //  console.log($scope.postdata.length);
                $scope.down = false;
                $scope.remove = $scope.postdata.splice(10, $scope.postdata.length);

                if (data.type === "popular") {
                    $scope.postdata.push([null])
                    setTimeout(function () {
                        $scope.postdata.splice($scope.postdata.length - 1, 1);
                        $scope.$apply();
                    }, 4);
                    return
                }
                $scope.postdata.push([null])
                setTimeout(function () {
                    $scope.postdata.splice($scope.postdata.length - 1, 1);
                    $scope.$apply();
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
    $http.get("/user").success(function (user) {
        $scope.user = user;

        $http.get("/units").success(function (list) {
            //  console.log(list);
            var progressCanvas = document.getElementById("progreesCanvas");
            if (progressCanvas) {

                var progressContext = progressCanvas.getContext('2d');

                progressContext.beginPath();
                progressContext.arc(150, 100, 80, 0, 2 * Math.PI);
                progressContext.strokeStyle = '#313F4E';
                progressContext.lineWidth = 20;
                progressContext.stroke();

                courseEdit.totalPointsOfAllCourse()
                //console.log(Math.round(courseEdit.pointsCalculate(courseEdit.userdata.progress) / courseEdit.totalPointsOfAllCourse() * 100))
                //  console.log(courseEdit.pointsCalculate($scope.user.progress), courseEdit.totalPointsOfAllCourse(list))
                var attitude = courseEdit.pointsCalculate($scope.user.progress) / courseEdit.totalPointsOfAllCourse(list);
                // console.log(attitude)
                if (isNaN(attitude)) {
                    attitude = 0;
                }
                if (attitude > 0.99 && attitude < 1) {
                    attitude = 0.99
                }
                var progressProcent = Math.round(attitude * 100);
                var arcle = attitude * 2 * Math.PI;
                // console.log("arcle",arcle)
                var rotation;
                if (arcle < 0.5) {
                    rotation = 1.5 * Math.PI + arcle;
                }
                if (arcle > 0.5) {
                    rotation = arcle - 0.5 * Math.PI;
                }

                //  console.log("rotation",rotation)
                //console.log(arcle);
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

    $scope.scrolling = 800;

    window.onscroll = function (event) {
        console.log("after scroll", $scope.postdata.length);
        //console.log(window.scrollY,$scope.down)
        if ($scope.scrolling < window.scrollY) {
            if ($scope.down) {
                return;
            }
            // console.log("tytytyty", $scope.remove)
            var mass = $scope.remove.splice(10, $scope.remove.length);
            //console.log("mass", mass)
            //console.log(event, window.scrollY)
            $scope.scrolling += 1200;
            $scope.postdata = $scope.postdata.concat($scope.remove)
            $scope.remove = mass;
            $scope.postdata.push([null])
            setTimeout(function () {
                $scope.postdata.splice($scope.postdata.length - 1, 1);
                $scope.$apply();
            }, 4);
            if (mass.length === 0) {
                $scope.down = true;
            }
        }

    };
});

