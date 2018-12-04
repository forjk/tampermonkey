// ==UserScript==
// @name         thz
// @namespace    https://github.com/forjk/tampermonkey
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://thzthz.cc/forum-181-*.html
// @match        http://thzthz.cc/thread-*
// @require     http://apps.bdimg.com/libs/jquery/1.11.3/jquery.js
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @connect     115.com
// @connect     btsow.pw
// ==/UserScript==

(function () {
    'use strict';

    var reg = /[0-9]{3,}_?-?[0-9]{1,}_?-?[0-9]{1,}/;

    $(".xst").slice(1).each(function () {
        var text = $(this).text().substring(11);
        if (text.indexOf("fc2ppv") == -1) {
            return;
        }

        var key = text.match(reg);
        if (key == null) return true;

        var obj = $(this);

        GM_xmlhttpRequest({
            url: "http://web.api.115.com/files/search?offset=0&limit=115&search_value=" + key[0] + "&date=&aid=1&cid=0&pick_code=&type=&source=&format=json",
            method: "GET",
            responseType: "json",
            onload: function (data) {
                obj.text(data.response.count + "    " + text);
                if (data.response.count == 0) {
                    obj.css("color", "black").css("font-weight", "bold");
                }
            }
        });
    });


    if($("#thread_subject").length == 1){
        var text = $("#thread_subject").text().substring(11);
        var key = text.match(reg);
        if(text.indexOf("fc2ppv") != -1 && key != null ){

            GM_xmlhttpRequest({
                url: "https://btsow.pw/search/" + key[0],
                method  : "GET",
                //responseType : "json",
                onload: function (data) {
                    $("ignore_js_op").eq(0).before(key[0] + "<br/>");

                    $(data.responseText ).find(".data-list a").each(function (i) {
                        var url = $(this).attr("href");
                        url = url.substring(url.lastIndexOf("/") + 1);
                        url = "http://115.com/web/lixian/?ct=lixian&ac=add_task_url&url=magnet:?xt=urn:btih:" + url;

                        var title = $(this).attr("title");
                        var size = $(this).next().html();
                        var date = $(this).nextAll().last().html();

                        var color = "";
                        if(title.indexOf(".mp4") >0 || title.indexOf(".wmv") >0 || title.indexOf(".avi") >0){
                            color = "color:blue;";
                        }

                        title = title + " [" + date + "]" + " [" + size + "] ";
                        $("ignore_js_op").eq(0).before('<a class="btsolink" style="' + color +  '" target="_blank" href="' + url + '">' + title + '</a></br>');
                    });

                    $("ignore_js_op").eq(0).before("<br/><br/>");


                    $(".btsolink").on("click",function(){
                        $(this).css("color","#800080");
                        var href = $(this).attr("href");

                        GM_xmlhttpRequest({
                            url: href,
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
                }
            });
        }
    }

    $('.attnm a').each(function () {
        var href = $(this).attr('href');
        var aid = href.substring(href.lastIndexOf("=") +1);
        href = "forum.php?mod=attachment&aid=" + aid;
        $(this).attr('href', href);
        $(this).attr('onclick', "");
    });

    $('.plhin').eq(0).find("img[lazyloadthumb]").each( function(){
        var src = $(this).attr('file');
        $(this).attr('src', src);
        $(this).removeAttr('file');
        $(this).removeAttr('lazyloadthumb');
        $(this).attr('width', 800);
    });
})();
