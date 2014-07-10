/**
 * Created by igor on 7/8/14.
 */


app.controller('editcourses', function ($stateParams, $location, $http, $scope) {

    $scope.newSubject={}
    $http.get('/subject').success(function (subject) {
        $scope.loadSubjects = subject;

    });
    //$scope.newSubject={}
    $http.get('/modulelesson').success(function (module) {
        $scope.loadModule = module;

    });

    $scope.resCourseSubject={};
    $scope.resCourseSubject.subjects=[];
    $scope.resModuleLesson={};
    $scope.resModuleLessonArray=[];
    $scope.course={};

    $scope.addCourse=function(){
        $scope.resCourseSubject.num=$scope.course.num;
        $scope.resCourseSubject.color={'background-color':$scope.course.color};
        $scope.resCourseSubject.menuName=$scope.course.menuName;
        $scope.resCourseSubject.description=$scope.course.description;
    };
    $scope.addSubject=function(){
        var subObj={};
        subObj.subjectName=$scope.course.subjectName;
        subObj.description=$scope.course.subjectDescription;
        subObj.subSubjects=[];
        $scope.resCourseSubject.subjects.push(subObj);
    };
    $scope.addsubSubject=function(){
      //
        var subObj={};
        subObj.subSubjectName=$scope.course.subSubjectName;
        subObj.description=$scope.course.subSubjectDescription;
        subObj.specialId=Date.now();
        subObj.module=[];

       for(var i=0;i<$scope.resCourseSubject.subjects.length;i++){
          console.log($scope.resCourseSubject.subjects[i].subjectName)
         if($scope.resCourseSubject.subjects[i].subjectName===$scope.subjectParrent){
             console.log($scope.resCourseSubject.subjects[i])
                $scope.resCourseSubject.subjects[i].subSubjects.push(subObj);
            };
        };
       /* $scope.resModuleLesson.steps=[];
        for(var i=0;i<$scope.resCourseSubject.subjects.length;i++){
        if($scope.resCourseSubject.subjects.subjectName===$scope.subjectParrent){
            $scope.resCourseSubject.subjects[i]..push($scope.resModuleLesson._id);
        }
        }*/

    };
    $scope.addModule=function(){
       // $scope.subjectParrent
       // $scope.resModuleLesson._id=Date.now()+"";
        var moduleObj={};
        //$scope.resModuleLesson.moduleName=$scope.course.moduleName;
       // $scope.resModuleLesson.description=$scope.course.moduleDescription;
       // $scope.resModuleLesson.steps=[];

        moduleObj.moduleName=$scope.course.moduleName;
        moduleObj.description=$scope.course.moduleDescription;
        moduleObj.steps=[];

        for(var i=0;i<$scope.resCourseSubject.subjects.length;i++){
            for(var j=0;j<$scope.resCourseSubject.subjects[i].subSubjects.length;j++){
                if($scope.resCourseSubject.subjects[i].subSubjects[j].subSubjectName===$scope.subSubjectParrent){
                   // $scope.resModuleLesson.parent= $scope.resCourseSubject.subjects[i].subSubjects[j].specialId;
                    moduleObj.parent= $scope.resCourseSubject.subjects[i].subSubjects[j].specialId;
                        $scope.resModuleLessonArray.push(moduleObj);
                    console.log("igor",$scope.resModuleLessonArray);
                    //}

                   // $scope.resCourseSubject.subjects[i].subSubjects[j].module.push($scope.resModuleLesson._id);
                };
            };

        };
       // console.log($scope.resCourseSubject)
    };
    $scope.addStep=function(){
        var stepObj={};
        stepObj.stepName=$scope.course.stepName;
        stepObj.typeStep=$scope.course.typeStep;
        stepObj.content=$scope.course.content;
        //stepObj.resModuleLesson.steps.push(subObj);
       // console.log("module",$scope.resModuleLesson);
        for(var i=0;i<$scope.resModuleLessonArray.length;i++){
           // console.log($scope.resCourseSubject.subjects[i].subjectName)
            if($scope.resModuleLessonArray[i].moduleName===$scope.moduleParrent){
                //console.log($scope.resCourseSubject.subjects[i])
                $scope.resModuleLessonArray[i].steps.push(stepObj);
            };
        };
    };
    $scope.saveCurse=function(){
        console.log($scope.resModuleLessonArray)
        var data=[$scope.resCourseSubject,$scope.resModuleLessonArray];
        $http.post('/subject',data).success(function (data) {
          console.log(data.data.id);
            $scope.resCourseSubject._id=data.data.id;
        });
    };

    $scope.showModule=function(id){
        var showModule=[];
        for(var i=0;i<$scope.resModuleLessonArray.length;i++){
            if($scope.resModuleLessonArray[i].parent===id){
                showModule.push($scope.resModuleLessonArray[i]);
            };
        };
        return showModule;
    };
 $scope.deleteSubject=function(name){
        for(var i=0;i<$scope.resCourseSubject.subjects.length;i++){
            if($scope.resCourseSubject.subjects[i].subjectName===name){
                for(var j=0;j<$scope.resCourseSubject.subjects[i].subSubjects.length;j++){
                    $scope.deleteSubSubject($scope.resCourseSubject.subjects[i].subSubjects[j].subSubjectName);
                };
                $scope.resCourseSubject.subjects.splice(i,1);
            };

        };
    };
    $scope.deleteSubSubject=function(name){
        for(var i=0;i<$scope.resCourseSubject.subjects.length;i++){
            for(var j=0;j<$scope.resCourseSubject.subjects[i].subSubjects.length;j++){
            if($scope.resCourseSubject.subjects[i].subSubjects[j].subSubjectName===name) {
                $scope.deleteModuleOnParent($scope.resCourseSubject.subjects[i].subSubjects[j].specialId);
              $scope.resCourseSubject.subjects[i].subSubjects.splice(j, 1);
            };
            };

        };
    };
    $scope.deleteModule=function(name){

        for(var i=0;i<$scope.resModuleLessonArray.length;i++){
            if($scope.resModuleLessonArray[i].moduleName===name){
                $scope.resModuleLessonArray.splice(i,1);
                i=i-1;
            };

        };
        //$scope.resModuleLessonArray=localArr;
    };
    $scope.deleteStep=function(name){

        for(var i=0;i<$scope.resModuleLessonArray.length;i++){
            for(var j=0;j<$scope.resModuleLessonArray[i].steps.length;j++) {
                if ($scope.resModuleLessonArray[i].steps[j].stepName === name) {
                    $scope.resModuleLessonArray[i].steps.splice(j, 1);
                    j=j-1;
                };
            };
        };
    };
    $scope.deleteModuleOnParent=function(id){

        for(var i=0;i<$scope.resModuleLessonArray.length;i++){
            if($scope.resModuleLessonArray[i].parent===id){
                $scope.resModuleLessonArray.splice(i,1);
               i=i-1;
            }
        }
    };
    $scope.changeCourse=function(name){
        //loadModule
        for(var i=0;i<$scope.loadSubjects.length;i++){
            if($scope.loadSubjects[i].menuName===name){
                $scope.resCourseSubject=$scope.loadSubjects[i];
                $scope.resModuleLessonArray=$scope.loadModule;
            }
        }
    };
});