/**
 * Created by igor on 7/1/14.
 */
app.controller('maintab', function () {
    'user strict';

    this.tab = 1;

    this.menus = [
        {
            num: 1,
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
            num: 2,
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
            num: 3,
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
            num: 4,
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
            num: 5,
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

    ];
    var vertical=this.menus.length*90+'px';
    this.tabheight={height:vertical};
    console.log(this.tabheight);

    this.showTab = function (num) {
        this.tab = num;
        this.changTabColor = this.menus[num - 1].color['background-color'];
    };

    this.activeTab = function (num) {
        if (num === this.tab) {
            return true;
        }
        return false;
    };

    /* this.classActive=function(num){
     if(num===this.tab){
     return "active";
     };
     return;
     };*/
    this.colorTab = this.menus[0].color['background-color'];
    this.changTabColor = this.menus[0].color['background-color'];
    this.hover = function (color) {
        if (color) {
            this.colorTab = color;
            return;
        }
        this.colorTab = 'ghostwhite';

    };
    this.color = function (color1, color2, color3) {
        if (color2 === color3) {
            return {'background-color': color2};
        }
        if (color1 === color2) {

            return {'background-color': color1};
        }
        return {'background-color': 'ghostwhite'};
    };


});