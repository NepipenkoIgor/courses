/**
 * Created by igor on 7/15/14.
 */
app.controller('lessonController', function ($scope, $http,$stateParams) {

var init=function() {
    $http.get('/courses').success(function (courses) {
        $scope.courses = courses;
//console.log( $scope.courses);
        if(!$scope.courses){
            var specialId=Date.now();
            $scope.courses={title:"New Module",description:"",sections:[{title:"New Section",description:"",specialId:specialId}
        }

        }
        for (var i = 0; i < $scope.courses.length; i++) {
            if ($scope.courses[i].title === $stateParams.courseTitle) {
                $scope.course = $scope.courses[i];
            }
        }
    });
    $http.get('/units').success(function (units) {
        $scope.units = units;

        $scope.showUnits = function (id) {
            var arrUnits = [];
            for (var i = 0; i < $scope.units.length; i++) {
                if ($scope.units[i].parent === id) {
                    arrUnits.push($scope.units[i]);
                }
                ;
            }
            ;
            return arrUnits;
        };


        console.log($scope.units)
    });

};
    init();
    $scope.unitsNew=[];



    $scope.saveCourse=function(){
        data=[{action:'edit'},$scope.course,$scope.units,$scope.unitsDelete,$scope.unitsNew];
      console.log($scope.units)
      $http.post('/subjects', data).success(function (data) {
          // console.log(data.data.id);
           // $scope.resCourseSubject._id=data.data.id;
            //$scope.getInventory();
          $scope.unitsNew=null;
           console.log(data)
         init()
       });
    };

    $scope.deleteUnit=function(parent,unitTitle){

        var unitsDelete=[];
        var unitTitle=unitTitle||"all";
        if(unitTitle==="all"){
            for(var i=0;i<$scope.units.length;i++){
                if($scope.units[i].parent===parent){
                    unitsDelete.push($scope.units[i]._id);
                    $scope.unitsDelete=unitsDelete;
                    $scope.units.splice(i,1);
                };
            };
            return
        }
        for(var i=0;i<$scope.units.length;i++){
            if($scope.units[i].parent===parent&&$scope.units[i].title===unitTitle){
                unitsDelete.push($scope.units[i]._id);
                $scope.unitsDelete=unitsDelete;
                $scope.units.splice(i,1);
            };
        };
    };



    $scope.deleteModule=function(id){
        console.log($scope.course.modules)
        for(var i=0;i<$scope.course.modules.length;i++){
            if($scope.course.modules[i]._id===id){
                for(var j=0;j<$scope.course.modules[i].sections.length;j++){
                    $scope.deleteUnit($scope.course.modules[i].sections[j].specialId);
                }
                $scope.course.modules.splice(i,1);
            }
        }


        console.log($scope.course.modules)
    }


    $scope.deleteSection=function(moduleTitle,sectionTitle){
        for(var i=0;i<$scope.course.modules.length;i++){
            if($scope.course.modules[i].title===moduleTitle){
                for(var j= 0,l=$scope.course.modules[i].sections.length;j<l;j++){
                    if($scope.course.modules[i].sections[j].title===sectionTitle){
                        $scope.deleteUnit($scope.course.modules[i].sections[j].specialId)
                        $scope.course.modules[i].sections.splice(j,1);
                        j++;
                    }

                }
                //$scope.course.modules.splice(i,1);
            }
        }
    };




    $scope.addModule=function(name,position){

        for(var i= 0,l=$scope.course.modules.length;i<l;i++){
            //console.log($scope.course.modules[i].title===name)
           if($scope.course.modules[i].title===name){
                console.log(position==='after')
               if(position==='after'){
                   //console.log(l)
                   var specialId=Date.now();
                    $scope.course.modules.splice(i+1,0,{title:"New Module",description:"",sections:[{title:"New Section",description:"",specialId:specialId}]})
                   // console.log( $scope.course.modules);
                   $scope.units.push({parent:specialId,title:"New Unit",description:"",lims:[]});
                   $scope.saveCourse();
                   return;
                }
               if(position==='before'){
                  // console.log(l)
                   var specialId=Date.now();
                 $scope.course.modules.splice(i,0,{title:"New Module",description:"",sections:[{title:"New Section",description:"",specialId:specialId}]})
                  // console.log( $scope.course.modules);
                   $scope.units.push({parent:specialId,title:"New Unit",description:"",lims:[]});
                   $scope.saveCourse();
                   return;
               }
            }
        }
    }


    $scope.addSection=function(name,position){
        for(var i= 0;i<$scope.course.modules.length;i++){
              for(var j= 0,l=$scope.course.modules[i].sections.length;j<l;j++){
                if($scope.course.modules[i].sections[j].title===name){
                    if(position==='after'){
                        var specialId=Date.now();
                        $scope.course.modules[i].sections.splice(j+1,0,{title:"New Section",description:"",specialId:specialId});
                        // console.log( $scope.course.modules);
                        $scope.units.push({parent:specialId,title:"New Unit",description:"",lims:[]});
                        $scope.saveCourse();
                        return;
                    }
                    if(position==='before'){
                        var specialId=Date.now();
                        $scope.course.modules[i].sections.splice(j,0,{title:"New Section",description:"",specialId:specialId});
                        console.log( $scope.course.modules[i].sections);
                        $scope.units.push({parent:specialId,title:"New Unit",description:"",lims:[]});
                      //  $scope.unitsNew.push
                        console.log($scope.units)
                        $scope.saveCourse();
                        return;
                    }
                }
            }
        }
    }

    $scope.addUnit=function(sectionTitle,unitsTitle,position){
        for(var i= 0;i<$scope.course.modules.length;i++){
            for(var j= 0,l=$scope.course.modules[i].sections.length;j<l;j++){
                if($scope.course.modules[i].sections[j].title===sectionTitle){
                    var specialId=$scope.course.modules[i].sections[j].specialId;
                  //  for(var l=0;l< $scope.units)
                    if(position==='after'){

                        //$scope.course.modules[i].sections[j].splice(j+1,0,{title:"New Section",description:"",specialId:specialId});
                        // console.log( $scope.course.modules);
                        $scope.units.push(l-1,0,{parent:specialId,title:"New Unit",description:"",lims:[]});
                       // $scope.saveCourse();
                        return;
                    }
                    if(position==='before'){

                       // $scope.course.modules[i].sections.splice(j,0,{title:"New Section",description:"",specialId:specialId});
                        console.log( $scope.course.modules[i].sections);
                        $scope.units.splice(0,1,{parent:specialId,title:"New Unit",description:"",lims:[]});
                        //  $scope.unitsNew.push
                        console.log($scope.units);
                       // $scope.saveCourse();
                        return;
                    }
                }
            }
        }

    }




})