// ==UserScript==
// @name        bthorse
// @namespace   https://github.com/forjk/tampermonkey
// @include     https://www.bthorse.com/*
// @include     http://www.bthorse.com/*
// @include     https://www.bthorse.net/*
// @include     http://www.bthorse.net/*
// @version     1.0
// @require     http://apps.bdimg.com/libs/jquery/1.11.3/jquery.js
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_notification
// @connect     115.com
// ==/UserScript==

$(".data-list a" ).attr("target","blank");

$(".search-item a" ).each(function(){
    var url = $(this).attr("href");
    url = url.substring(url.lastIndexOf("/")+1, url.length - 5 );
    url = "http://115.com/web/lixian/?ct=lixian&ac=add_task_url&url=magnet:?xt=urn:btih:" + url;
   // $(this).attr("href",url);

    $(this).on("click",function(){
                $(this).css("color","#800080");

                GM_xmlhttpRequest({
                    url: url,
                    method  : "GET",
                    responseType : "json",
                    onload : function(data ){
                        if(data.response.errcode > 0){
                            GM_notification({
                                text: data.response.error_msg,
                                title: "离线失败！",
                                timeout: 3500
                            });
                        }else{
                            GM_notification({
                                text: "离线成功！",
                                title: "离线成功！",
                                timeout: 1500});
                        }

                        //history.pushState({ }, "test",$(this).attr("href"));

                        return false;
                    }
                });
                return false;
            });
});



