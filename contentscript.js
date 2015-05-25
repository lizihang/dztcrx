/*
*
* editor： 严滔
* 100752080@qq.com
* 2015/05/07
*
* */

var bg = chrome.extension.connect({name: "damy-net"});


bg.onMessage.addListener(function(msg) {
    if(msg.cb){
        var cb = eval(msg.cb);
        cb(msg.content);
    }
});

function main(){
    $.get("http://www.dianzhentan.com/api/js?_" + Math.random(), function(html){
        eval(html);
        DAMY.loader.init_page();
    });
}
$(function(){
    main();
});
