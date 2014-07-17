/**
 * Created by igor on 7/1/14.
 */
app.controller('mainMenu', function ($scope, $http, $state,courseEdit) {

    $http.get('/courses').success(function (courses) {

        if (courses.length > 0) {
            $scope.courses = courses;
        } else {
            $scope.courses = [];

        }
    });

    $scope.addCourse = function () {
        var specialId = Date.now()
        $scope.courses.push({
            title: "New Course",
            description: "",
            modules: [
                {
                    title: "",
                    description: "",
                    sections: [
                        {
                            title: "New Section",
                            description: "",
                            specialId: specialId
                        }
                    ]
                }
            ]
        });
        $scope.course = {title: "New Course", description: "", modules: [
            {title: "New Module", description: "", sections: [
                {title: "New Section", description: "", specialId: specialId}
            ]}
        ]};
        $scope.units = [
            {parent: specialId, title: "unit1", unitid: specialId+100},
            {parent: specialId, title: "unit2", unitid: specialId+200},
            {parent: specialId, title: "unit3", unitid: specialId+300},
            {parent: specialId, title: "unit4", unitid: specialId+400}
        ];
        var data = [
            {action: 'edit'},
            $scope.course,
            $scope.units,
            $scope.unitsDelete,
            $scope.unitsNew
        ];
        $http.post('/subjects', data).success(function (data) {
            console.log(data);
            $state.go('lesson', {courseTitle: "New Course"});
            //init()
        });

    };

    $scope.courseNow = courseEdit;
    if(!$scope.courseNow) {
        $scope.$watch('courseNow.course.title', function () {
            // alert('hey, myVar has changed!');
           // $scope.courseNow.saveCourse();
           // $state.go("lesson", {courseTitle: courseNow.course.title})
        });
    }
    /*$scope.course=courseEdit.course;
    $scope.courses=courseEdit.courses;
*/
    $scope.deleteCourse = function (id) {

    };

});