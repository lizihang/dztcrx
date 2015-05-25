/*
*
* editor： 严滔
* 100752080@qq.com
* 2015/05/07
*
* */
var tmp_html = '<li><div class="logo53">'+
				'<div class="menu_img news"></div></div>'+
			    '<div class="url-list news-list">'+
			    '<a href="-url-">-title-</a></div></li>';

function load_msg(content){
    if(content){
        content = JSON.parse(content);
        if(content.url){
            var html = tmp_html.replace(/-url-/g,content.url);
            html = tmp_html.replace(/-title-/g,content.title);
            $('.dzt-ext-menu').prepend(html);
        }
        $('#kc_title').html(content.m);
        $('#kc_time').html(content.t);
    }
}

$(function(){
    var content = chrome.extension.getBackgroundPage();
    content.load_msg(load_msg)

});



