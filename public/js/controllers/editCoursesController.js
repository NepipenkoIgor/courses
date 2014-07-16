/**
 * Created by igor on 7/8/14.
 */


app.controller('editcourses', function ($stateParams, $location, $http, $scope,courseEdit) {

    $scope.newSubject={};
    $scope.getInventory=function(){
        $http.get('/subject').success(function (subject) {
            $scope.loadSubjects = subject;

        });
        $http.get('/modulelesson').success(function (module) {
            $scope.loadModule = module;

        });
    };
    $scope.getInventory();

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
        $scope.showTree=true;
    };
    $scope.addSubject=function(){
        var subObj={};
        subObj.subjectName=$scope.course.subjectName;
        subObj.description=$scope.course.subjectDescription;
        subObj.subSubjects=[];
        $scope.resCourseSubject.subjects.push(subObj);
    };
    $scope.addsubSubject=function(){

        var subObj={};
        subObj.subSubjectName=$scope.course.subSubjectName;
        subObj.description=$scope.course.subSubjectDescription;
        subObj.specialId=Date.now();
        subObj.module=[];

       for(var i=0;i<$scope.resCourseSubject.subjects.length;i++){
          console.log($scope.resCourseSubject.subjects[i].subjectName);
           console.log($scope.subjectParrent);
         if($scope.resCourseSubject.subjects[i].subjectName===$scope.subjectParrent){
             console.log($scope.resCourseSubject.subjects[i])
                $scope.resCourseSubject.subjects[i].subSubjects.push(subObj);
            };
        };
    };
    $scope.addModule=function(){

        var moduleObj={};

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
            $scope.getInventory();
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
    $scope.hideCourse=function(){
        $scope.resCourseSubject={};
        $scope.resModuleLessonArray=[];
        $scope.resCourseSubject.subjects=[];
        $scope.resModuleLesson={};
        $scope.showTree=false;
        $scope.switchName='Course';
     $scope.getInventory();
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
        for(var i=0;i<$scope.loadSubjects.length;i++){
            if($scope.loadSubjects[i].menuName===name){
                $scope.resCourseSubject=$scope.loadSubjects[i];
                $scope.resModuleLessonArray=$scope.loadModule;
            }
        }
        $scope.showTree=true;
    };
    $scope.switchName='Course';
    $scope.switchEdition=function(name){
 $scope.switchName=name;
    };
    $scope.showEdition=function(name){
        if($scope.switchName===name){
            return true;
        }
        return false;
    };
    $scope.activeClass=function(name){
        if($scope.switchName===name){
            return 'active';
        }
        return " ";
    };
    $scope.showTree=false;

    $scope.deleteCourse=function(){
        console.log($scope.resCourseSubject._id);
        var data={action:"delete",id:$scope.resCourseSubject._id,module:$scope.resModuleLessonArray};
        $http.post('/subject',data).success(function (data) {

            $scope.getInventory();
            $scope.showTree=false;
        });
    };
    $scope.isCourse=function(){
        if($scope.resCourseSubject.menuName||$scope.resCourseSubject.num||$scope.resCourseSubject.color){
            return true;
        };
        return false;
    };
    $scope.isSubject=function(){
        if($scope.resCourseSubject.subjects){
            if($scope.resCourseSubject.subjects.length>0){
                return true;
            };
        };

        return false;
    };
    $scope.isSubSubject=function(){
        if($scope.resCourseSubject.subjects) {
            for (var i = 0; i < $scope.resCourseSubject.subjects.length; i++) {
                if ($scope.resCourseSubject.subjects[i].subSubjects.length > 0) {
                    return true;
                };
            } ;
        };
        return false;
    };
    $scope.isModule=function(){
        if($scope.resModuleLessonArray.length>0){
            return true;
        };
        return false;
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