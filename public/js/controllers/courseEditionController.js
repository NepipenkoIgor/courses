/**
 * Created by igor on 7/14/14.
 */
app.controller('courseEdition', function ($state,$stateParams, $location, $http, $scope, $q, courseEdit) {

    var load = function() {
      return  $q.all([
            courseEdit.loadSubjects(),
            courseEdit.loadModule()
        ]).then(function(result) {
            $scope.loadSubjects=result[0].data;
            $scope.loadModule=result[1].data;

        });
    };
    load().then(function(){
        if($stateParams.course){
            $scope.changeCourse($stateParams.course);
            $scope.courseNow=courseEdit.resCourseSubject;
        };
    }).then(function(){
        if($stateParams.subject){
            $scope.changeSubject($stateParams.subject);
            $scope.subjectNow=courseEdit.resSubject;
        };
    }).then(function(){
        if($stateParams.subSubject){
            $scope.changeSubSubject($stateParams.subSubject);
            $scope.subSubjectNow=courseEdit.resSubSubject;
            $scope.modulesNow=courseEdit.modulesOfThisSubSubject;
        };
    }).then(function(){
        if($stateParams.module){
            $scope.changeModule($stateParams.module);
            $scope.moduleNow=courseEdit.moduleNow;
        };
    })


    $scope.resCourseSubject={};
    $scope.resCourseSubject.subjects=[];
    $scope.resModuleLessonArray=[];
    console.log(courseEdit);


    $scope.changeCourse=function(name){
        for(var i=0;i<$scope.loadSubjects.length;i++){
            if($scope.loadSubjects[i].menuName===name){
                $scope.resCourseSubject=$scope.loadSubjects[i];
               // $scope.resModuleLessonArray=$scope.loadModule;
                courseEdit.resCourseSubject=$scope.resCourseSubject;
                courseEdit.resModuleLessonArray=$scope.resModuleLessonArray;
               //$state.go('coursesedition');
console.log(courseEdit.resSubject)
                 if(courseEdit.resSubject){
                     courseEdit.resSubject=null;
                    // $scope.courseNow=courseEdit.resCourseSubject;
                     $state.go('coursesedition');
                 }
console.log($scope.courseNow)
            }
        }
    };
    $scope.courseNow=courseEdit.resCourseSubject;

    $scope.changeSubject=function(name){

        for(var i=0;i<$scope.courseNow.subjects.length;i++){

            if($scope.courseNow.subjects[i].subjectName===name){
               $scope.resSubject=$scope.courseNow.subjects[i];
                courseEdit.resSubject=$scope.resSubject;

            }
        }
    }

    $scope.subjectNow=courseEdit.resSubject;


    $scope.changeSubSubject=function(name){

        for(var i=0;i<$scope.subjectNow.subSubjects.length;i++){
            if($scope.subjectNow.subSubjects[i].subSubjectName===name){
                $scope.resSubSubject=$scope.subjectNow.subSubjects[i];
                courseEdit.resSubSubject=$scope.resSubSubject;
                //console.log( courseEdit.resSubject)
                $scope.modulesOfThisSubSubject=[];

               for(var j=0;j<$scope.loadModule.length;j++){

                    if($scope.loadModule[j].parent===$scope.resSubSubject.specialId){

                        $scope.modulesOfThisSubSubject.push($scope.loadModule[j]);
                        courseEdit.modulesOfThisSubSubject=$scope.modulesOfThisSubSubject;
                    }
                }
            }
        }
    }


    $scope.subSubjectNow=courseEdit.resSubSubject;
    $scope.modulesNow=courseEdit.modulesOfThisSubSubject;
console.log($scope.modulesNow)



 $scope.changeModule=function(name){

     for(var i=0;i<$scope.modulesNow.length;i++){

         if($scope.modulesNow[i].moduleName===name){
             $scope.resModule=$scope.modulesNow[i];
             courseEdit.moduleNow= $scope.resModule;
             console.log(courseEdit.moduleNow)
         }
     }
 }

    $scope.moduleNow=courseEdit.moduleNow;


    $scope.changeStep=function(name){

        for(var i=0;i<$scope.moduleNow.steps.length;i++){

            if($scope.moduleNow.steps[i].stepName===name){
                $scope.resStep=$scope.moduleNow.steps[i];
                courseEdit.stepNow= $scope.resStep;

            }
        }
    }

    $scope.stepNow=courseEdit.stepNow;

$scope.obj=function(){
    console.log($scope.courseNow,$scope.modulesNow)
};



    $scope.saveCourse=function(){

        var data=[{action:'edit'},$scope.courseNow,$scope.moduleNow];
        console.log(data);
    $http.post('/subject',data).success(function (data) {
            console.log(data);
          /*  $scope.resCourseSubject._id=data.data.id;
            $scope.getInventory();*/
       });
    };





    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
});