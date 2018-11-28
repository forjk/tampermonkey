// ==UserScript==
// @name        btso
// @namespace   https://github.com/forjk/tampermonkey
// @include     https://btso.pw/search/*
// @include     https://btsow.pw/search/*
// @version     1.0
// @require     http://apps.bdimg.com/libs/jquery/1.11.3/jquery.js
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @connect     115.com
// ==/UserScript==

$(".data-list a").attr("target", "blank");

$(".data-list a").each(function () {
    var url = $(this).attr("href");
    url = url.substring(url.lastIndexOf("/") + 1);
    url = "http://115.com/web/lixian/?ct=lixian&ac=add_task_url&url=magnet:?xt=urn:btih:" + url;
    //$(this).attr("href",url);

    $(this).on("click", function () {
        var tmpurl = window.location.href;
        history.pushState({}, "test", $(this).attr("href"));
        history.pushState({}, "test", tmpurl);

        GM_xmlhttpRequest({
            url: url,
            method: "GET",
            responseType: "json",
            onload: function (data) {
                if (data.response.errcode > 0) {
                    GM_notification({
                        text: data.response.error_msg,
                        title: "离线失败！",
                        timeout: 3500
                    });
                } else {
                    GM_notification({
                        text: "离线成功！",
                        title: "离线成功！",
                        timeout: 1500
                    });
                }
            }
        });

        return false;
    });
});
