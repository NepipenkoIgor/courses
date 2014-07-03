/**
 * Created by igor on 7/2/14.
 */
app.controller('posts', function ($scope, $http) {
    'user strict';
    $scope.comment="";
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
                console.log("kyky");
                $scope.postdata.splice(i,1);
                console.log(id)
                var id={"_id":id};
               $http.post('/post/delete', id).success(function () {
                    console.log("good  delete request");
                });
            }
            //return $scope.postdata
        }
    };
    $scope.deletComment = function (comment,id) {
        console.log(comment);

    for(var i=0;i< $scope.postdata.length;i++) {

           if ($scope.postdata[i]['_id'] === id) {
               console.log($scope.postdata[i]['_id']);
                for (var j = 0; j<$scope.postdata[i].comments.length; j++) {
                    //console.log($scope.postdata[i].comments[j])
                     if ($scope.postdata[i].comments[j] === comment) {
                       $scope.postdata[i].comments.splice(j, 1);
                         var data={"_id":id,"comments":$scope.postdata[i].comments};
                         $http.post('/comment/new', data).success(function(){
                             console.log("good  comment request");
                         });
                   };

               };
           };
       };
    };
    $scope.addComment = function (id){
        console.log(this.comment);
       //console.log($scope.postdata[0].comments);
        for(var i=0;i< $scope.postdata.length;i++){
            if($scope.postdata[i]['_id']===id&&this.comment!==""){

                $scope.postdata[i].comments.push(this.comment);
                console.log($scope.postdata[i].comments);
                var data={"_id":id,"comments":$scope.postdata[i].comments};
                $http.post('/comment/new', data).success(function(){
                    console.log("good  comment request");
                });
            };
        };
    };
   /* var self=this;
    this.mark=true;*/
    $scope.setId=function(id){
        if(this.id===id){
            this.id="";
            return;
        };
        if(!this.id||this.id!==id) {
            this.id = id;
            return;
        };

    };


});