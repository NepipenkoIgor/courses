/*
 * Created by Игорь on 19.06.2014.
 */

var app = angular.module("userprofile",[]);

app.controller('profile',function($http){
  'user strict';
  var self=this;

  $http.get('/user').success(function(data){
    if(!data.username) data.username='guest';
    console.log(data.username);
    if(!data.firstname){
      data.firstname='';
    }
    if(!data.lastname){
      data.lastname='';
    }
    if(!data.phone){
      data.phone='';
    }
    self.userdata=data;

  });
 this.postProfile=function(data){

   $http.post('/main',data).success(function(data){
     console.log("my callback data =", data);
     console.log("good request");
   });

 };
 this.flag=false;

  this.editProfile=function(){
    console.log( this.flag);
   if( this.flag===false) {
     this.flag=true;
     return ;
   }
    this.flag=false;

  };

});


app.controller('maintab',function(){

    this.tab=1;

    this.showTab=function(num){
        this.tab=num;
    };

    this.activeTab=function(num){
        if(num===this.tab){
            return true
        };
        return false
    };

    this.classActive=function(num){
        if(num===this.tab){
            return "active";
        };
        return;
    }

});

app.controller('mainMenu',function(){

    this.menus=[
        {
            menuName:'Math',
            color:{
                'background-color':'olive'
},
            subjects:[
                "Math1",
                "Math2",
                "Math3"
            ]
        },
        {
            menuName:'Science',
                color:{
                    'background-color':'green'
                },
            subjects:[
                "Science1",
                "Science2",
                "Science3"
            ]

        },
        {
            menuName:'Humanties',
                color:{
                    'background-color':'teal'
},
            subjects:[
            "Humanties1",
            "Humanties2",
            "Humanties3"
        ]

        },
        {
            menuName:'Economics and Finance',
                color:{
                    'background-color':'grey'
},
            subjects:[
                "Economics and Finance1",
                "Economics and Finance2",
                "Economics and Finance3"
            ]

        },
        {
            menuName:'Computing',
                color:{
                    'background-color':'gold'
},
            subjects:[
                "Computing1",
                "Computing2",
                "Computing3"
            ]

        }

    ]




})