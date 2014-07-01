/**
 * Created by igor on 7/1/14.
 */
module.exports=function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint:{
            options:grunt.file.read('.jshintrc'),
            src:['public/js/**/*js','models/*js','controller/*js','config/*js','routes/*js']
        },
        concat: {  //описываем работу плагина конкатенации
            dist: {
                src: ['public/js/app.js','public/js/**/*.js'],  // какие файлы конкатенировать
                dest: 'public/javascripts/front.js'  // куда класть файл, который получиться после процесса конкатенации
            }
        },
        uglify:{
            build:{
                src:'public/javascripts/front.js',
                dest:'public/javascripts/front.min.js'
            }
        }
    });
    //подгружаем необходимые плагины
   grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   // grunt.loadNpmTasks('grunt-contrib-cssmin');
   // grunt.loadNpmTasks('grunt-contrib-watch');
   // grunt.loadNpmTasks('grunt-remove-logging');


    //регистрируем задачу
    grunt.registerTask('default', ['concat','uglify','jshint']);
}