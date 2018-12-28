// ==UserScript==
// @name        龙腾网
// @namespace   https://github.com/forjk/tampermonkey
// @version     1.0.1
// @include     http://www.ltaaa.com/bbs/*
// @include     http://www.ltaaa.com/
// @include     http://translate.ltaaa.com/*
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant       none
// ==/UserScript==

jQuery.noConflict();
jQuery(document).ready(function ($) {

    setTimeout(function(){
        $("body").removeAttr("oncontextmenu");
        $("body").removeAttr("ondragstart");
        $("body").removeAttr("onselectstart");
        $("body").removeAttr("onselect");
        $("body").removeAttr("oncopy");
        $("body").removeAttr("onbeforecopy");

    }, 1000);

    $('#frameechxKu a').each(function () {
        var url = $(this).attr('href');
        var id = url.substring(url.indexOf('-') + 1, url.lastIndexOf('-'));
        url = 'forum.php?mod=forumdisplay&fid=' + id + '&filter=author&orderby=dateline';
        $(this).attr('href', url);
        $(this).attr('target', '_self');
    });

    $('.hNav ul li').eq(1).find('a').each(function () {
        var url = $(this).attr('href');
        var id = url.substring(url.indexOf('-') + 1, url.lastIndexOf('-'));
        url = '/bbs/forum.php?mod=forumdisplay&fid=' + id + '&filter=author&orderby=dateline';
        $(this).attr('href', url);
        $(this).attr('target', '_self');
    });
});
