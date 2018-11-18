// ==UserScript==
// @name        bt之家
// @namespace   https://github.com/forjk/tampermonkey
// @include     http://www.btbtt.co/*
// @version     1.0
// @grant       none
// @require     http://apps.bdimg.com/libs/jquery/1.11.3/jquery.js
// ==/UserScript==

$('.attachlist a').each(function () {
  var href = $(this).attr('href');
  href = href.replace('dialog', 'download');
  $(this).attr('href', href);
	}
  );

