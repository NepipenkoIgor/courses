/**
 * Created by igor on 7/1/14.
 */
app.controller('mainMenu', function ($scope,$http) {
  //function reqSubject() {
       $http.get('/subject').success(function (data) {
           $scope.menus = data;

          //  console.log($scope.menus[0]);
        });

    //};
   // reqSubject();
    /*this.menus = [
        {
            menuName: 'Math',
            color: {
                'background-color': 'olive'
            },
            subjects: [
                "Math1",
                "Math2",
                "Math3"
            ]
        },
        {
            menuName: 'Science',
            color: {
                'background-color': 'green'
            },
            subjects: [
                "Science1",
                "Science2",
                "Science3"
            ]

        },
        {
            menuName: 'Humanties',
            color: {
                'background-color': 'teal'
            },
            subjects: [
                "Humanties1",
                "Humanties2",
                "Humanties3"
            ]

        },
        {
            menuName: 'Economics and Finance',
            color: {
                'background-color': 'grey'
            },
            subjects: [
                "Economics and Finance1",
                "Economics and Finance2",
                "Economics and Finance3"
            ]

        },
        {
            menuName: 'Computing',
            color: {
                'background-color': 'gold'
            },
            subjects: [
                "Computing1",
                "Computing2",
                "Computing3"
            ]

        }

    ];*/


});