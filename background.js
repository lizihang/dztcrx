/*
*
* editor： 严滔
* 100752080@qq.com
* 2015/05/07
*
* */



 if (!chrome.cookies) {
    chrome.cookies = chrome.experimental.cookies;
}
//
function get_url(cookie) {
    var prefix = cookie.secure ? "https://" : "http://";
    if (cookie.domain.charAt(0) == ".")
        prefix += "www";

    return prefix + cookie.domain + cookie.path;
}

function get_suffix(url) {
    var cookiestr = '';
    var domain = url.replace('http://', '').replace('https://').split('/')[0];
    var segs = domain.split('.');
    if(segs.length < 2) {
        return null;
    }

    var suffix = '.' + [segs[segs.length-2], segs[segs.length-1]].join('.');
    return suffix;
}

function get_domain(url){
    var domain = url.replace('http://', '').replace('https://').split('/')[0];
    return domain;
}

function clear_cookie(url, callback) {
    chrome.cookies.getAll({}, function(cookies) {
        var suffix = get_suffix(url);
        var sub_domain = get_domain(url);

        for (var i in cookies) {
            if(cookies[i].domain == suffix || cookies[i].domain == sub_domain) {
                chrome.cookies.remove({url: get_url(cookies[i]), name: cookies[i].name}, function() {});
            }
            //console.log(get_url(cookies[i]));
        }

        callback('');

    });
}


function get_cookie(url, callback) {

    chrome.cookies.getAll({}, function(cookies) {

        var cookiestr = '';
        var suffix = get_suffix(url);
        var sub_domain = get_domain(url);
        var subcookie = '';

        for (var i in cookies) {
            if(cookies[i].domain == suffix) {
                cookiestr += (cookies[i].name + '=' + cookies[i].value + ';');
            }else if(cookies[i].domain == sub_domain){
                subcookie += (cookies[i].name + '=' + cookies[i].value + ';');
            }

        }
        callback({'suffix': cookiestr, 'subdomain': subcookie});

    });

}


function getAjax(url, cb){
    console.debug(url,cb);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            msg_cache = xhr.responseText;
            cb(xhr.responseText);
        }
    };
    xhr.send();
}

function postAjax(url, data, cb){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            msg_cache = xhr.responseText;
            cb(xhr.responseText);
        }
    };
    xhr.send(data);
}

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
      if(msg.act == 'get'){
          getAjax(msg.url, function(data){
              port.postMessage({content: data, cb: msg.cb});
          });
      }else if(msg.act == 'post'){
          postAjax(msg.url, msg.data, function(data){
              port.postMessage({content: data, cb: msg.cb});
          });
      }else if(msg.act == 'ver'){
          port.postMessage({content: chrome.app.getDetails().version, cb: msg.cb});
      }
      else if(msg.act == 'get_cookie'){
          get_cookie(msg.url, function(data){
                port.postMessage({content: data, cb: msg.cb});
          });
      }
      else if(msg.act == 'clear_cookie'){
          clear_cookie(msg.url, function(data){
                port.postMessage({content: data, cb: msg.cb});
          });
      }else{
          console.debug('error msg');
      }
  });
});