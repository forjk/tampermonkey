// ==UserScript==
// @name        javgod
// @namespace   https://github.com/forjk/tampermonkey
// @include     http://javgod.net/*
// @version     1.0
// @require     http://apps.bdimg.com/libs/jquery/1.11.3/jquery.js
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @connect     115.com
// @connect     btsow.pw
// ==/UserScript==

var reg = /[0-9]{3,}_?-?[0-9]{1,}_?-?[0-9]{1,}/;

$(".wrap").width("100%");
$(".wrap").css("max-width", "100%");

$("#primary").width("68%");
$("#secondary").width("26%");

$("#left").remove();
$("#right").remove();
$("#main-shift").css("margin-right", "0px").css("margin-left", "0px");

$(".entry-title a").removeAttr("href").removeAttr("title");

$(".entry-content p > img").attr("width", "1024").attr("height", "");
$(".entry-content a img").each(function () {
    var url = $(this).attr("src");
    url = url.replace("small", "big");
    $(this).attr("src", url);
    $(this).parent().attr("href", url);
    $(this).parent().attr("target", "blank");
});

$(".entry-title a").each(function () {
    var next = $(this).parent().next();
    var text = $(this).text();
    if (text.indexOf("FC2") != -1 || text.indexOf("Caribbeancom") != -1 || text.indexOf("1Pondo") != -1 || text.indexOf("10musume") != -1 || text.indexOf("Pacopacomama") != -1 || text.indexOf("XXX-AV") != -1 || text.indexOf("HEYZO") != -1) {
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
                    obj.css("color", "blue");

                    GM_xmlhttpRequest({
                        url: "https://btsow.pw/search/" + key[0],
                        method: "GET",
                        onload: function (data) {
                            $(".info").append('<p class="header">BTSO:</p>');

                            $(data.responseText).find(".data-list a").each(function (i) {
                                var url = $(this).attr("href");
                                url = url.substring(url.lastIndexOf("/") + 1);
                                url = "http://115.com/web/lixian/?ct=lixian&ac=add_task_url&url=magnet:?xt=urn:btih:" + url;

                                var title = $(this).attr("title");
                                var size = $(this).next().html();
                                var date = $(this).nextAll().last().html();

                                var color = "";
                                if (title.indexOf(".mp4") > 0 || title.indexOf(".wmv") > 0 || title.indexOf(".avi") > 0) {
                                    color = "color:blue;";
                                }

                                title = title + " [" + date + "]" + " [" + size + "] ";
                                next.append('<br/><a style="' + color + '" target="_blank" href="' + url + '">' + title + '</a>');

                                next.find("a").last().on("click", function () {
                                    var href = $(this).attr("href");
                                    GM_xmlhttpRequest({
                                        url: href,
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
                                            //history.pushState({ }, "test",$(this).attr("href"));
                                        }
                                    });
                                    return false;
                                });

                            });
                        }
                    });


                }
            }
        });


    }
});


