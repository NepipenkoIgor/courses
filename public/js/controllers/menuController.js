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
        var specialId = Date.now();
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
            {parent: specialId, title: "unit1", unitId: specialId+100},
            {parent: specialId, title: "unit2", unitId: specialId+200},
            {parent: specialId, title: "unit3", unitId: specialId+300},
            {parent: specialId, title: "unit4", unitId: specialId+400}
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
            $state.go('adminlab.lesson.module', {courseTitle: "New Course"});
            courseEdit.initTab();
            //init()
        });

    };

    $scope.courseNow = courseEdit;



});