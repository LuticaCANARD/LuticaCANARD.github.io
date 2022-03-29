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
function save_post_loc(name,url){ // 이동및 로딩용 post 저장하기
    var local_path = "../posts/postDB/"+name+".html";
    parseing_JSON = require('./reading_path.json');
    parsedJSON = JSON.parse(parseing_JSON);
    delete parsedJSON['read_point'];
    parsedJSON['read_point'] = local_path
    location.href = url // 이동부
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


