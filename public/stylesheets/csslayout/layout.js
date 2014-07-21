$( document ).ready(function() {
    $('li').tooltip();
    $('a').tooltip();
    
    var editor = ace.edit("editor");
        editor.setTheme("ace/theme/chaos");
        editor.getSession().setMo/de("ace/mode/javascript");
    
});
