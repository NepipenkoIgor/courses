/**
 * Created by igor on 7/2/14.
 */
app.controller('posts', function ($scope, $http) {
    'user strict';
    function reqPosts() {
        $http.get('/posts').success(function (data) {
            $scope.postdata = data;
            console.log($scope.postdata);
        });

    };
    reqPosts();
    $scope.deletPost = function (id) {
        console.log(id);
        console.log($scope.postdata[0]['_id'])
        for(var i=0;i< $scope.postdata.length;i++){
            if($scope.postdata[i]['_id']===id){
                console.log("kyky")
                $scope.postdata.splice(i,1);
                console.log(id)
                var id={"_id":id}
               $http.post('/post/delete', id).success(function () {
                    console.log("good  delete request");
                });
            }
            //return $scope.postdata
        }
    };


});