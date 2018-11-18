// ==UserScript==
// @name         thz
// @namespace    https://github.com/forjk/tampermonkey
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://thzbt.co/forum-181-*.html
// @require     http://apps.bdimg.com/libs/jquery/1.11.3/jquery.js
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @connect     115.com
// @connect     btso.pw
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
})();
