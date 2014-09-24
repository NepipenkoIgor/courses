/**
 * Created by igor on 9/8/14.
 */
app.controller("refreshController",function($scope,$http,$location,$state,$stateParams,courseEdit) {

/*
    if ($state.current.name==='login'||
        $state.current.name==='signup'||
        $state.current.name==='signupadmin'||
        $state.current.name==='forgot'){
        if (courseEdit.userdata) {
            $state.go("dashboard");
          //  return;
        }
}
   // console.log(courseEdit.userdata)
    if (!courseEdit.userdata) {
       // console.log($state.current.name)
        if ($state.current.name!=='signup'&&
            $state.current.name!=='signupadmin'&&
            $state.current.name!=='forgot') {
            $location.url("/login");
        }
    }
    if ($location.$$path.split("/")[1] === 'adminlab' && courseEdit.userdata) {
        if (!courseEdit.userdata.position) {
            $location.url("/dashboard");
        }
    }*/


    /*if($state.current.name==="unit"){
        var url = $location.$$url;
        url = url.split("/");
        console.log(url)

    }*/

})