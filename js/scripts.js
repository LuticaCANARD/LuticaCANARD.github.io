/*!
* Start Bootstrap - Blog Home v5.0.8 (https://startbootstrap.com/template/blog-home)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-blog-home/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};


var read_post_path = ""
function load_post(name){
    read_post_path = "../posts/postDB/"+name+".html";
}
function load_post_tree (){
    var fs = require('fs');
    fs.Dir("")
}


