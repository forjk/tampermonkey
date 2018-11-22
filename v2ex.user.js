// ==UserScript==
// @name         v2ex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.v2ex.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(".item_title a").attr("target", "_blank");
})();
