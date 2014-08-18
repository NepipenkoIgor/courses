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
//console.log("iam vupoln")
    $("#submit").removeClass("btn-primary").addClass("button-bad").addClass("disabled");
    $("#alertFirstName").hide();
    $("#alertLastName").hide();
    $("#alertEmail").hide();
    $("#alertPassword").hide();
    $("#alertComfPassword").hide();

    $("#formsign").keypress(function(event){
        if(event.keyCode===13){
            event.preventDefault();
        }
    });
    $scope.trueValidate=function(){
    if($scope.firstname&&$scope.lastname&&$scope.email&&$scope.password&&$scope.comfpassword){
        $("#submitSignUp").removeClass("button-bad").removeClass("disabled").addClass("btn-primary");
        return;
    }
        $("#submitSignUp").removeClass("btn-primary").addClass("button-bad").addClass("disabled");
        return;
    };
    var req = function (data,event,name) {
        $http.post("/true/email", {"email": data}).success(function (promisedate) {
            if (promisedate.length === 0) {
                //console.log($(event.currentTarget).next().show());
                $(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
                $scope.name[name] = "success validation";
                $scope.email=true;
                $scope.trueValidate();
                return;
            }
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "this email already exists";
            $scope.email=false;
            $scope.trueValidate();
            return;
        });
    };
    var deferredReq = _.debounce(req, 300);
    $scope.validMail = function (event, name) {
        if (event.currentTarget.value.length === 0) {
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "name can not be zero length";
            $scope.email=false;
            $scope.trueValidate();
            return;
        }
     if(validmail.test(event.currentTarget.value)!==true){
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
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
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "name can not be zero length";
            $scope.firstname=false;
            $scope.trueValidate();
            return;
        }
        if (num.test(event.currentTarget.value) === true || notextnum.test(event.currentTarget.value) === true) {
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "name can only contain letters";
            $scope[name]=false;
            $scope.trueValidate();
            return;
        }
        if (text.test(event.currentTarget.value)) {
            $(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
            $scope.name[name] = "success validation";
            $scope[name]=true;
            $scope.trueValidate();
            return;
        }


    };
    $scope.validPassword = function (event, name) {
        //
        if (event.currentTarget.value.length === 0) {
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "name can not be zero length";
            $scope.password=false;
            $scope.trueValidate();

        }
        if (notextnum.test(event.currentTarget.value) === true) {
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "name can only contain letters and numbers";
            $scope.password=false;
            $scope.trueValidate();
            return;
        }
        if ((text.test(event.currentTarget.value) && num.test(event.currentTarget.value)) === true) {
            $(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
            $scope.name[name] = "success validation";
            $scope.value = event.currentTarget.value;
            $scope.password=true;
            $scope.trueValidate();
            //console.log($scope.value)
            return;
        }
        if (text.test(event.currentTarget.value) === true) {
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "name can't only contain letters ,add numbers";
            $scope.password=false;
            $scope.trueValidate();
            return;
        }
        if (num.test(event.currentTarget.value) === true) {
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "name can't only contain numbers ,add letters";
            $scope.password=false;
            $scope.trueValidate();
            return;
        }
    };
    $scope.comfPassword = function (event, name) {
        if (event.currentTarget.value !== $scope.value || event.currentTarget.value.length === 0) {
            $(event.currentTarget).next().show().removeClass("alert-success").addClass("alert-danger");
            $scope.name[name] = "password fields do not match";
            $scope.comfpassword=false;
            $scope.trueValidate();
            return;
        }
        $(event.currentTarget).next().show().removeClass("alert-danger").addClass("alert-success");
        $scope.name[name] = "success validation";
        $scope.comfpassword=true;
        $scope.trueValidate();
        return;
    };
})