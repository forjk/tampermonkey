// ==UserScript==
// @name        avsox
// @namespace   https://github.com/forjk/tampermonkey
// @include     https://avsox.net/*
// @include     https://javzoo.com/cn*
// @version     1.0
// @require     http://apps.bdimg.com/libs/jquery/1.11.3/jquery.js
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_notification
// @connect     115.com
// @connect     btsow.pw
// ==/UserScript==


$(".container-fluid .item > a").attr("target", "_blank");

//显示115搜索结果，btso搜索结果
$(".container-fluid .item > a").each(function () {
    var obj = $(this).find("span").eq(0);
    var key = $(this).find("date").eq(0).text();

    GM_xmlhttpRequest({
        url: "http://web.api.115.com/files/search?offset=0&limit=115&search_value=" + key + "&date=&aid=1&cid=0&pick_code=&type=&source=&format=json",
        method  : "GET",
        responseType : "json",
        onload : function(data ){
            obj.append(' / <date> [115] ' + data.response.count + '</date>');
            if(data.response.count == 0){
                obj.css("color","blue");
            }
        }
    });
});

var key = $(".info > p:nth-child(1) > span:nth-child(2)").text();
if (key != "") {
    $(".container").css("width", "1400px");
    $(".col-md-9").css("width", "63%");
    $(".col-md-3").css("width", "37%");

    var bthorseurl = "https://www.bthorse.com/search/" +  key +"/size-1.html";
    $(".info").append('<a class="header" target="_blank" href="' + bthorseurl + '">BTHORSE</a></br>');

    GM_xmlhttpRequest({
        url: "http://web.api.115.com/files/search?offset=0&limit=115&search_value=" + key + "&date=&aid=1&cid=0&pick_code=&type=&source=&format=json",
        method  : "GET",
        responseType : "json",
        onload : function(data ){
            $(".info > p:nth-child(1)").after('<p><span class="header">115:</span> <span style="color:#CC0000;">' + data.response.count + '</span></p>');
        }
    });



    GM_xmlhttpRequest({
        url: "https://btsow.pw/search/" + key,
        method  : "GET",
        //responseType : "json",
        onload: function (data) {
            $(".info").append('<p class="header">BTSO:</p>');

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
                $(".info").append('<p><span class="genre"><a style="' + color +  '" target="_blank" href="' + url + '">' + title + '</a></span></p>');

            });


            $(".info a").slice(1).on("click",function(){
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



