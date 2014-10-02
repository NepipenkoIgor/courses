/**
 * Created by igor on 10/2/14.
 */
app.controller("settings",function($scope,$http,courseEdit){

    $scope.email=courseEdit.userdata.email;
    $scope.name = {};
    var text = /[a-zA-Z]/;
    var textCaps = /[A-Z]/;
    var notextnum = /[^\w\-]/;
    var num = /\d/;
    var validmail = /([\w\-]{1,20}\.)*([\w\-]{1,20})\@([\w\-]{1,20}\.)*([\w\-]{1,20})\.([a-z]{2,5})$/;

    $("#ChangePasswordForm").keypress(function(event){
        if(event.keyCode===13){
             if(!!$scope.oldPassword&&!!$scope.password&&!!$scope.comfpassword){
             return;
             }
            event.preventDefault();
          //  console.log(event.keyCode)
        }
    });

    $scope.trueValidate=function(){
       
        if(!!$scope.oldPassword&&!!$scope.password&&!!$scope.comfpassword){
            $("#submitNewPass").removeClass("button-bad").removeClass("disabled").addClass("btn-primary");
            return;
        }
        $("#submitNewPass").removeClass("btn-primary").addClass("button-bad").addClass("disabled");
        return;
    };


    var reqPass = function (data,event,name) {
        $http.post("/true/oldpass", {"pass": data,email:$scope.email}).success(function (promisedate) {
           // console.log(promisedate)
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


});