/**
 * Created by igor on 7/2/14.
 */
app.controller('posts', function ($scope, $http, $sce, $state, $location, courseEdit) {
    'user strict';

    /****************config post**********************/
        // $location.$$path="/post/all?type=question"
//console.log($location)
    $scope.comment = "";
    $scope.postdata = [];
    function reqPosts() {
        $http.get('/posts').success(function (data) {

            //      console.log("postdata",data);
            $scope.postdata = data;//.reverse();


            if ($location.$$path === "/post/all") {
                var searchObj = {};
                // console.log("courseEdit",courseEdit.userdata._id);
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
                }
                // console.log("courseEdit",courseEdit,"searchObj",searchObj);
                courseEdit.searchPosts(searchObj);
            }
            // console.log($scope.postdata);
            // $scope.likes=data.likes||[];
            $scope.countUserPost = function (id) {
                var count = 0;
                if ($scope.postdata !== undefined) {
                    for (var i = 0; i < $scope.postdata.length; i++) {
                        if ($scope.postdata[i].creator === id) {
                            count++;
                        }
                    }
                }
                return count;
            };


        });

    }

    function reqUsers() {
        $http.get('/users').success(function (data) {
            $scope.postUsersdata = data;
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


    $scope.saveNewPost = function (creator) {
        courseEdit.userHasBadge(courseEdit.listOfBadges[3], courseEdit.userdata)
        var newPost = {title: $scope.title, content: $scope.content, tags: $scope.tags, creator: creator};
        $http.post('/post/new', newPost).success(function (data) {

            reqPosts();
            $state.go('posts').then(function () {
                console.log("goood redirect")
                $location.url("/post/all?type=allposts");

            });
        });
    };


    $scope.addComment = function (idPost, creator, card) {


        if (card._id === idPost && this.comment !== "") {
            var date = Date.now();
            card.comments.push({content: this.comment, creator: creator, postId: date});

            var data = {"_id": idPost, "comments": card.comments};
            $http.post('/comment/new', data).success(function () {

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
        courseEdit.userHasBadge(courseEdit.listOfBadges[4], courseEdit.userdata)
        var tag = courseEdit.positionInCourse.course + "." + courseEdit.positionInCourse.module + "." + courseEdit.positionInCourse.section + "." + courseEdit.positionInCourse.unit;
        var newQuestion = {title: $scope.title, content: $scope.content, tags: tag + "," + $scope.tags, creator: creator, unit: unit, typePost: "question"};
        $http.post('/post/new', newQuestion).success(function (data) {
            // $scope.showQuestionBlock=false;
            reqPosts();

        });

    };


    /******************logic differences of posts**********************/
    $scope.getCreator = function (id) {
        var userCreator;
        if ($scope.postUsersdata) {
            for (var i = 0; i < $scope.postUsersdata.length; i++) {
                if ($scope.postUsersdata[i]._id === id) {
                    userCreator = $scope.postUsersdata[i].username;
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

    $scope.like = function (userId, arrayLikes, postId) {
        if (arrayLikes.indexOf(userId) === (-1)) {
            arrayLikes.push(userId);
            $scope.updateLikes(postId, arrayLikes);
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
    $scope.updateLikes = function (postId, likes) {
        var date = {_id: postId, likes: likes};
        $http.post('/postslikes', date).success(function (num) {
        });
    };


    $scope.searchPosts = function (searchObj) {
        $http.post('/post/search', searchObj).success(function (data) {
            if (data.data !== undefined) {
                $scope.postdata = data.data;
                $location.url("/post/all?type=" + data.type);
            }

        });
    };
    courseEdit.searchPosts = $scope.searchPosts;
    $scope.searchByTag = function (tag) {
        //console.log(tag);
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
            $scope.typeCheck = true
            return;
        }
        document.getElementById("post").checked = false;
        document.getElementById("question").checked = true;
        $scope.typeCheck = false;
    };


});

/*app.directive('masonrypost', function() {
 return {
 priority:0,
 restrict: 'AC',
 controller: function($scope) {
 return $scope.$watch(function(e) {
 $scope.masonry.reloadItems();
 return $scope.masonry.layout();
 *//*return $scope.postdata;*//*
 }, function(val) {
 $scope.masonry.reloadItems();
 $scope.masonry.layout();
 });
 },
 link: function(scope, elem, attrs) {
 var container=elem[0];
 var options='';
 return scope.masonry = new Masonry(container,options);
 }
 };

 });*/

/*
 return {
 priority:0,
 restrict: 'AC',
 link: function(scope, elem, attrs) {
 var container=elem[0];
 var options={
 itemSelector: '.postConteiner'
 };
 scope.masonry = new Masonry(container,options);

 scope.masonry.reloadItems();
 scope.masonry.layout();

 scope.$watch(function(e) {
 return scope.postdata;
 }, function(val) {
 scope.masonry.reloadItems();
 scope.masonry.layout();
 });
 }
 };

 });*/
