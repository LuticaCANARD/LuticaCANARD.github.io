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


var read_post_path
function load_post(name,url){
    read_post_path = "../posts/postDB/"+name+".html";
    location.href = url
}
function load_post_tree (){
    var fs = require('fs');
    fs.Dir("")
}

function readside_post_load(read_name_path){
    document.getElementById('title_of_this_post').innerText = read_name_path.document.getElementById('title').innerText;
}
function firststep(mainpost_root){
    document.getElementById('0post_pic').src = mainpost_root.document.getElementById('pic').src;
}


