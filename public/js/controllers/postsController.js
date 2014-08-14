/**
 * Created by igor on 7/2/14.
 */
app.controller('posts', function ($scope, $http, $sce,$state,courseEdit) {
    'user strict';

    /****************config post**********************/

    $scope.comment = "";
    function reqPosts() {
        $http.get('/posts').success(function (data) {

                $scope.postdata = data.reverse();
                // console.log($scope.postdata);
                // $scope.likes=data.likes||[];
                $scope.countUserPost = function(id){
                    var count = 0;
                    if($scope.postdata !== undefined){
                        for(var i=0; i<$scope.postdata.length; i++){
                            if($scope.postdata[i].creator === id){
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
                for (var i=0; i < $scope.postUsersdata.length; i++) {
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
    courseEdit.reqPosts=reqPosts;
    courseEdit.reqUsers=reqUsers;


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
    $scope.deleteComment = function (comment, id) {

        for (var i = 0; i < $scope.postdata.length; i++) {

            if ($scope.postdata[i]._id === id) {

                for (var j = 0; j < $scope.postdata[i].comments.length; j++) {

                    if ($scope.postdata[i].comments[j] === comment) {
                        $scope.postdata[i].comments.splice(j, 1);
                        var data = {"_id": id, "comments": $scope.postdata[i].comments};
                        $http.post('/comment/new', data).success(function () {

                        });
                    }


                }

            }

        }

    };

    /********save post**********/


    $scope.saveNewPost=function(creator){
        courseEdit.userHasBadge(courseEdit.listOfBadges[3], courseEdit.userdata)
        var newPost = {title: $scope.title, content: $scope.content, tags: $scope.tags, creator: creator};
        $http.post('/post/new', newPost).success(function (data) {

            reqPosts();
            $state.go('posts');
        });
    };



    $scope.addComment = function (idPost, creator) {

        for (var i = 0; i < $scope.postdata.length; i++) {
            if ($scope.postdata[i]._id === idPost && this.comment !== "") {

                $scope.postdata[i].comments.push({content: this.comment, creator: creator});
                //  console.log($scope.postdata[i].comments);
                var data = {"_id": idPost, "comments": $scope.postdata[i].comments};
                $http.post('/comment/new', data).success(function () {
                   // console.log("good  comment request");
                    reqPosts();
                    reqUsers();
                    //$scope.setId(idPost);
                });
            }

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
        var tag=courseEdit.positionInCourse.course+"."+courseEdit.positionInCourse.module+"."+courseEdit.positionInCourse.section+"."+courseEdit.positionInCourse.unit;
        var newQuestion = {title: $scope.title, content: $scope.content, tags: tag+","+$scope.tags, creator: creator, unit: unit,typePost:"question"};
        $http.post('/post/new', newQuestion).success(function (data) {
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

    $scope.like = function (userId, arrayLikes,postId) {
        if (arrayLikes.indexOf(userId) === (-1)) {
            arrayLikes.push(userId);
            $scope.updateLikes(postId,arrayLikes);
            return;
        }
        for (var i = 0; i < arrayLikes.length; i++) {
            if (arrayLikes[i] === userId) {
                arrayLikes.splice(i, 1);
                $scope.updateLikes(postId,arrayLikes);
                return;
            }
        }
    };
    $scope.updateLikes=function(postId,likes){
        var date={_id:postId,likes:likes};
        $http.post('/postslikes', date).success(function (num) {
        });
    };

    /********some serch logic other in tabcontroller**************/

    $scope.searchPosts=function(searchObj){
        $http.post('/post/search', searchObj).success(function (data) {
            if(data.data!==undefined){
                $scope.postdata=data.data;
            }

        });
    };
    courseEdit.searchPosts=$scope.searchPosts;
    $scope.searchByTag=function(tag){
        var searchObj={type:"tags",tag:tag};
        courseEdit.searchPosts(searchObj);
    };
    if( document.getElementById("post")&&document.getElementById("question")){
        document.getElementById("post").checked=true;
        document.getElementById("question").checked=false;
    }



    /***triger type of posts**/

    $scope.typeCheck=true;
    $scope.chekNewPost=function(bool){
        if(bool){
            document.getElementById("post").checked=true;
            document.getElementById("question").checked=false;
            $scope.typeCheck=true
            return;
        }
        document.getElementById("post").checked=false;
        document.getElementById("question").checked=true;
        $scope.typeCheck=false;
    };


});

app.directive('masonry', function() {
    return {
        restrict: 'AC',
        controller: function($scope) {
            return $scope.$watch(function(e) {
                $scope.masonry.reloadItems();
                return $scope.masonry.layout();
            });
        },
        link: function(scope, elem, attrs) {
            var container=elem[0];
            var options='';
            return scope.masonry = new Masonry(container,options);
        }
    };

});