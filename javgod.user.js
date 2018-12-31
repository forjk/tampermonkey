// ==UserScript==
// @name        javgod
// @namespace   https://github.com/forjk/tampermonkey
// @include     http://javgod.net/*
// @version     1.0.1
// @require     http://apps.bdimg.com/libs/jquery/1.11.3/jquery.js
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @connect     115.com
// @connect     btsow.pw
// @connect     sukebei.nyaa.si
// ==/UserScript==

var reg = /[0-9]{2,}_?-?[0-9]{1,}_?-?[0-9]{1,}/;

$("#page").css("max-width", "1600px");

$("#left").remove();
$("#right").remove();
$("#main-shift").css("margin-right", "0px").css("margin-left", "0px");

$(".entry-title a").removeAttr("href").removeAttr("title");
$(".entry-date a").attr("target", "_blank");

$(".entry-content p > img").attr("width", "1024").attr("height", "");
$(".entry-content a img").each(function () {
    var url = $(this).attr("src");
    url = url.replace("small", "big");
    $(this).attr("src", url);
    $(this).parent().attr("href", url);
    $(this).parent().attr("target", "blank");
});


function addBt(obj, url, title, size, date) {
    url = "http://115.com/web/lixian/?ct=lixian&ac=add_task_url&url=" + url;

    var color = "";
    if (title.indexOf(".mp4") > 0 || title.indexOf(".wmv") > 0 || title.indexOf(".avi") > 0) {
        color = "color:blue;";
    }

    title = title + " [" + date + "]" + " [" + size + "] ";
    obj.append('<br/><a style="' + color + '" target="_blank" href="' + url + '">' + title + '</a>');

    obj.find("a").last().on("click", function () {
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
            }
        });
        return false;
    });
}

function btsow(obj, keyword) {
    GM_xmlhttpRequest({
        url: "https://btsow.pw/search/" + keyword,
        method: "GET",
        onload: function (data) {
            $(data.responseText).find(".data-list a").each(function (i) {
                var url = $(this).attr("href");
                url = url.substring(url.lastIndexOf("/") + 1);
                url = "magnet:?xt=urn:btih:" + url;

                var title = $(this).attr("title");
                var size = $(this).next().html();
                var date = $(this).nextAll().last().html();

                addBt(obj, url, title, size, date);
            });
        }
    });
}

function sukebei(obj, keyword) {
    GM_xmlhttpRequest({
        url: "https://sukebei.nyaa.si/?f=0&c=0_0&s=downloads&o=desc&q=" + keyword,
        method: "GET",
        onload: function (data) {
            $(data.responseText).find(".torrent-list tbody > tr").each(function (i) {
                var url = $(this).find("td:nth-child(3)>a:nth-last-child(1)").attr("href");
                url = url.substring(0, 60);

                var title = $(this).find("td:nth-child(2)>a:nth-child(1)").attr("title");
                var size = $(this).find("td:nth-child(4)").text();
                var date = $(this).find("td:nth-child(5)").text();

                addBt(obj, url, title, size, date);
            });
        }
    });
}

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

                    //btsow(next, key[0]);
                    sukebei(next, key[0]);

                }
            }
        });


    }
});


