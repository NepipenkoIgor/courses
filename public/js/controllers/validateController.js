/**
 * Created by igor on 8/12/14.
 */
app.controller('validateController', function ($scope, $http) {
    'use strict'
    $scope.name = {};
    var text = /[a-zA-Z]/;
    var textCaps = /[A-Z]/;
    var notextnum = /[^\w\-]/;
    var num = /\d/;
    var validmail = /([\w\-]{1,20}\.)*([\w\-]{1,20})\@([\w\-]{1,20}\.)*([\w\-]{1,20})\.([a-z]{2,5})$/;

    $("#submitSignUp").removeClass("btn-primary").addClass("button-bad").addClass("disabled");

    $("#formsign div").removeClass("has-success");
    $("#formsign span").removeClass("glyphicon-remove");

    $("#formsign").keypress(function(event){
        if(event.keyCode===13){
            if(!!$scope.firstname&&!!$scope.lastname&&!!$scope.email&&!!$scope.password&&!!$scope.comfpassword&&!!$scope.code){
                return;
            }
            event.preventDefault();
        }
    });
    $scope.trueValidate=function(){
        console.log(!!$scope.firstname&&!!$scope.lastname&&!!$scope.email&&!!$scope.password&&!!$scope.comfpassword&&!!$scope.code)
    if(!!$scope.firstname&&!!$scope.lastname&&!!$scope.email&&!!$scope.password&&!!$scope.comfpassword&&!!$scope.code){
        $("#submitSignUp").removeClass("button-bad").removeClass("disabled").addClass("btn-primary");
        return;
    }
        $("#submitSignUp").removeClass("btn-primary").addClass("button-bad").addClass("disabled");
        return;
    };
    $scope.nullSubmit=function(){
        $("#submitSignUp").removeClass("btn-primary").addClass("button-bad").addClass("disabled");
        return;
    };
    var reqCode = function (data,event,name) {
        $http.post("/true/code", {"code": data}).success(function (promisedate) {
            if (promisedate.success === true) {
                //console.log($(event.currentTarget).next().show());
               // $(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
                $(event.currentTarget).parent().removeClass("has-error").addClass("has-success");
                $(event.currentTarget).next().removeClass("glyphicon-remove").addClass("glyphicon-ok");
                $scope.name[name] = "success validation";
                $scope.code=true;
                $scope.trueValidate();
                return;
            }
            //$(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
            $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
            $scope.name[name] = "this code not true";
            $scope.code=false;
            $scope.trueValidate();
            return;
        });
    };
    var deferredCode = _.debounce(reqCode, 300);
    $scope.validCode=function(event,name){
        deferredCode(event.currentTarget.value,event,name);
    };

    var req = function (data,event,name) {
        $http.post("/true/email", {"email": data}).success(function (promisedate) {
            if (promisedate.length === 0) {
                //console.log($(event.currentTarget).next().show());
                //$(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
                $(event.currentTarget).parent().removeClass("has-error").addClass("has-success");
                $(event.currentTarget).next().removeClass("glyphicon-remove").addClass("glyphicon-ok");
                $scope.name[name] = "success validation";
                $scope.email=true;
                $scope.trueValidate();
                return;
            }
            //$(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
            $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
            $scope.name[name] = "this email already exists";
            $scope.email=false;
            $scope.trueValidate();
            return;
        });
    };
    var deferredReq = _.debounce(req, 300);
    $scope.validMail = function (event, name) {
        if (event.currentTarget.value.length === 0) {
            //$(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
            $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
            $scope.name[name] = "email can not be zero length";
            $scope.email=false;
            $scope.trueValidate();
            return;
        }
     if(validmail.test(event.currentTarget.value)!==true){
            //$(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
         $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
         $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
            $scope.name[name] = "email can be domenname@hostname.zone";
         $scope.email=false;
         $scope.trueValidate();
            return;
        }
 if(validmail.test(event.currentTarget.value)===true){
     deferredReq(event.currentTarget.value,event,name);
 }


    };
   $scope.validName = function (event, name) {

        if (event.currentTarget.value.length === 0) {
           // $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
            $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
            $scope.name[name] = "name can not be zero length";
            $scope[name]=false;
            $scope.trueValidate();
            return;
        }
        if (num.test(event.currentTarget.value) === true || notextnum.test(event.currentTarget.value) === true) {
            //$(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $(event.currentTarget).parent().removeClass("has-success").addClass("has-error");
            $(event.currentTarget).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
            $scope.name[name] = "name can only contain letters";
            $scope[name]=false;
            $scope.trueValidate();
            return;
        }
        if (text.test(event.currentTarget.value)) {
            //$(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
            $(event.currentTarget).parent().removeClass("has-error").addClass("has-success");
            $(event.currentTarget).next().removeClass("glyphicon-remove").addClass("glyphicon-ok");
            $scope.name[name] = "success validation";
            $scope[name]=true;
            $scope.trueValidate();
            return;
        }


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
})