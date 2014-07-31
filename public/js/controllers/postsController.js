/**
 * Created by igor on 7/2/14.
 */
app.controller('posts', function ($scope, $http, $sce) {
    'user strict';
    $scope.comment = "";
    function reqPosts() {
        $http.get('/posts').success(function (data) {
            $scope.postdata = data;
            // console.log($scope.postdata);
            // $scope.likes=data.likes||[];
        });

    }

    reqPosts();
    function reqUsers() {
        $http.get('/users').success(function (data) {
            $scope.postUsersdata = data;
        });

    }

    reqUsers();
    $scope.postAvatar = function (id) {
        for (var i; i < $scope.postUsersdata.length; i++) {
            if ($scope.postUsersdata[i]._id === id) {
                var userPostAvatar = $scope.postUsersdata[i].avatar;
            }
        }
        var url = userPostAvatar || 'http://karalmik.com/wp-content/uploads/2013/03/29-150x150.jpg';

        return $sce.trustAsResourceUrl(url);
    };


    $scope.deletePost = function (id) {

        for (var i = 0; i < $scope.postdata.length; i++) {
            if ($scope.postdata[i]._id === id) {
                // console.log("kyky");
                $scope.postdata.splice(i, 1);
                //console.log(id)
                var id = {"_id": id};
                $http.post('/post/delete', id).success(function () {
                    console.log("good  delete request");
                });
            }

        }
    };
    $scope.deleteComment = function (comment, id) {
        console.log(comment);

        for (var i = 0; i < $scope.postdata.length; i++) {

            if ($scope.postdata[i]._id === id) {
                //  console.log($scope.postdata[i]._id);
                for (var j = 0; j < $scope.postdata[i].comments.length; j++) {
                    //console.log($scope.postdata[i].comments[j])
                    if ($scope.postdata[i].comments[j] === comment) {
                        $scope.postdata[i].comments.splice(j, 1);
                        var data = {"_id": id, "comments": $scope.postdata[i].comments};
                        $http.post('/comment/new', data).success(function () {
                            //console.log("good  comment request");
                        });
                    }


                }

            }

        }

    };
    $scope.addComment = function (idPost, creator) {
        // console.log(this.comment);

        for (var i = 0; i < $scope.postdata.length; i++) {
            if ($scope.postdata[i]._id === idPost && this.comment !== "") {

                $scope.postdata[i].comments.push({content: this.comment, creator: creator});
                //  console.log($scope.postdata[i].comments);
                var data = {"_id": idPost, "comments": $scope.postdata[i].comments};
                $http.post('/comment/new', data).success(function () {
                    console.log("good  comment request");
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
        var newQuestion = {title: $scope.title, content: $scope.content, tags: $scope.tags, creator: creator, unit: unit};
        $http.post('/post/new', newQuestion).success(function (data) {

            console.log(data);
            reqPosts();
        });

    };

    $scope.getCreator = function (id) {
        //console.log("id",id);
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
        // console.log("tyty",postId,unitId);
        if (postId === unitId) {
            return true;
        }
        return false;
    };
    $scope.postAvatar = function () {
        var img = "http://karalmik.com/wp-content/uploads/2013/03/29-150x150.jpg";
        // console.log("img", img);
        return img;
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
    $scope.like = function (userId, arrayLikes,postId) {
        if (arrayLikes.indexOf(userId) === (-1)) {
            arrayLikes.push(userId);
            $scope.updateLikes(postId,arrayLikes);
            return;
        }
        for (var i = 0; i < arrayLikes.length; i++) {
            console.log(arrayLikes[i], userId);
            if (arrayLikes[i] === userId) {
                //console.log(arrayLikes[i]);
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
});