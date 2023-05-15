/* -----------------------------------------------
Table of Contents (common js)
--------------------------------------------------
1. userAgent判別
2. URL判別
3. 設定
4. JSファイル読み込み時即実行(Execute JavaScript when the page loaded.)
5. DOM構築後実行(Execute JavaScript when the DOM is fully loaded.)
6. 画像など含めてページ読込み完了後に実行(Execute JavaScript when the Window Object is fully loaded.)
7. 動的コンテンツに対してイベントを設定
8. その他のイベントを設定
9. 関数(プラグイン)複数

// require jQuery JavaScript Library v3.5.1
/* ------------------------------------------------------------
 * [ userAgent ] http://www.useragentstring.com/pages/useragentstring.php
 * ------------------------------------------------------------ */
var ua                   = window.navigator.userAgent;
var appVer               = window.navigator.appVersion;

//PC
var isIE                 = ua.indexOf('MSIE') != -1 || ua.indexOf('Trident') != -1;
var isIE6                = isIE && appVer.indexOf('MSIE 6') != -1;
var isIE7                = isIE && appVer.indexOf('MSIE 7.') != -1;
var isIE8                = isIE && ua.indexOf('Trident/4.') != -1;
var isIE9                = isIE && ua.indexOf('Trident/5.') != -1;
var isIE10               = isIE && ua.indexOf('Trident/6.') != -1;
var isIE11               = ua.indexOf('Trident/7.') != -1;

var isFirefox            = ua.indexOf('Firefox') != -1;
var isChrome             = ua.indexOf('Chrome') != -1;
var isSafari             = ua.indexOf('Safari') != -1;

//Mobile (smartphone + tablet)
var isMobileSafari       = ua.match(/iPhone|iPad|iPod/i) ? true : false;
var isMobileSafariTypeT  = ua.match(/ipad/i) ? true : false;
var isMobileSafariTypeS  = ua.match(/iphone|ipod/i) ? true : false;
var isAndroid            = ua.indexOf('Android') != -1;
var isMobileAndroidTypeT = isAndroid && ua.indexOf('Mobile') == -1;
var isMobileAndroidTypeS = isAndroid && ua.indexOf('Mobile') != -1;
var isAndroidChrome      = isChrome && isAndroid;
var isAndroidFirefox     = isFirefox && isAndroid;
var isMobileFirefox      = isFirefox && ua.indexOf('Mobile') != -1;
var isTabletFirefox      = isFirefox && ua.indexOf('Tablet') != -1;

//PC or Mobile
var isTablet             = isMobileSafariTypeT || isMobileAndroidTypeT || isTabletFirefox;
var isSmartPhone         = isMobileSafariTypeS || isMobileAndroidTypeS || isMobileFirefox;
var isMobile             = isTablet || isSmartPhone || isAndroidChrome || isAndroidFirefox;
var isPC                 = !isMobile;



/* ------------------------------------------------------------
 * [ Location ]
 * ------------------------------------------------------------ */
var  locationHref     = window.location.href,     // http://www.google.com:80/search?q=demo#test
     locationProtocol = window.location.protocol, // http:
     locationHostname = window.location.hostname, // www.google.com
     locationHost     = window.location.host,     // www.google.com:80
     locationPort     = window.location.port,     // 80
     locationPath     = window.location.pathname, // /search
     locationSearch   = window.location.search,   // ?q=demo
     locationHash     = window.location.hash;     // #test

/* ============================================================
* IE11 Fixed element problems
* ============================================================ */
if(isIE11) {
	document.body.addEventListener("mousewheel", function(event) {
		event.preventDefault();
		var weelDelta = event.wheelDelta;
		var currentOffset = window.pageYOffset;
		window.scrollTo(0, currentOffset - weelDelta);
	});
}
/* ============================================================
* Common Script
* ============================================================ */
var Common = (function () {
	function Common() {
		this.onInit();
	}
	
	/**
	* 初期化
	*/
	Common.prototype.onInit = function () {
		var _this = this;
		_this.addAgentClass();
		_this.globalNavButton();
		_this.initGlobalNav();
		_this.jsMatchHeight();
		_this.fullBackground();
		_this.smoothScroll();
		_this.jsSwiper();
	}

	/**
	* initLocomotive SmoothScroll
	*/
	Common.prototype.initLocomotive = function () {
		var _this = this;
		_this.scroller = new LocomotiveScroll({
			el: document.querySelector('[data-scroll-container]'),
			smooth: true,
			reloadOnContextChange: true,
			tablet: {
				breakpoint: 768
			}
		});
		$(window).on('load', function(){
			_this.scroller.update();
		});
	}

	/**
	* userAgent Classes to <html>
	*/
	Common.prototype.addAgentClass = function(){
		if (isTablet) {
			$('html').addClass('is-tablet');
		}
		if (isSmartPhone) {
			$('html').addClass('is-sp');
		}
		if (isPC) {
			$('html').addClass('is-pc');
		}
		if (isMobile) {
			$('html').addClass('is-mobile');
		}
		if (isIE) {
			$('html').addClass('is-ie');
		}
		if (isIE11) {
			$('html').addClass('is-ie11');
		}

		var vh = window.innerHeight * 0.01;
		var vw = window.innerWidth * 0.01;
		var resizeTimerVh = false;
		document.documentElement.style.setProperty('--vh', vh + 'px');
		document.documentElement.style.setProperty('--vw', vw + 'px');
		$(window).on('resize', function(){
			if(resizeTimerVh) clearTimeout(resizeTimerVh);
			resizeTimerVh = setTimeout(function(){
				var vh = window.innerHeight * 0.01;
				var vw = window.innerWidth * 0.01;
				document.documentElement.style.setProperty('--vh', vh + 'px');
				document.documentElement.style.setProperty('--vw', vw + 'px');
			}, 200);
		});
	}

	/**
	* smoothScroll
	*/
	Common.prototype.smoothScroll = function(){
		$('body').on('click', 'a[href^="#"]:not([href="#top"])',function(){
			var href= $(this).attr('href');
			var target = $(href === '#' || href === '' ? 'html' : href);
			var position = target.offset().top;
			$('body,html').animate({scrollTop:position}, 500, 'swing');
			return false;
		});
	}

	//Global menu
	Common.prototype.globalNavButton = function () {
		var menuBtn = $(".nav-global-menu");
		var header = $("#header");
		var globalNav = $(".nav-global-wrap");
		menuBtn && menuBtn.on('click', function(e){
			e.preventDefault();
			if(menuBtn.hasClass('is-active')){
				menuBtn.removeClass('is-active');
				header.removeClass('is-hover');
				globalNav.removeClass('is-active');
				$('html').removeClass('is-opened-menu');
				disableBodyScroll(false, globalNav.get(0));
			} else{
				menuBtn.addClass('is-active');
				header.addClass('is-hover');
				globalNav.addClass('is-active');
				$('html').addClass('is-opened-menu');
				disableBodyScroll(true, globalNav.get(0));
			}
		});		
	}

	/**
	* グローバリゼーション
	*/
	Common.prototype.initGlobalNav = function () {
		var _this = this;
		var globalNavItem = $(".nav-global > li");
		var globalNavSub = $(".nav-global__sub > li");
		var header = $("#l-header");
		if(isPC){
			globalNavItem.each(function(i, elem){
				var timer = false;
				var elem = $(elem);
				elem.on('mouseenter', function(){
					if(timer) clearTimeout(timer);
					elem.addClass('is-hover');
				});
				elem.on('mouseleave', function(){
					timer = setTimeout(function(){
						elem.removeClass('is-hover');
					}, 50)
				});
			});
			globalNavSub.each(function(i, elem){
				var elem = $(elem);
				var subNav = elem.find(".nav-global__sub__child");
				if(subNav.length){
					elem.addClass('has-sub');
					var globalNav = elem.closest('.nav-parent');
					elem.on('mouseenter', function(){
						var subNavHeight = subNav.get(0).clientHeight;
						if(subNavHeight > 0 && globalNav != null){
							globalNav.get(0).style.minHeight = subNavHeight + 'px';
						}
					});
					elem.on('mouseleave', function(){
						globalNav.get(0).style.minHeight = 0 + 'px';
					});
				}
			});


			var subTitle = $(".nav-global__sub__title");
			subTitle.each(function(i, item){
				item = $(item);
				var subNav = item.closest('li');
				var subNavWrap = subNav.find(".nav-global__sub__child");
				var globalNav = item.closest('.nav-parent');
				item.on('click', function(e){
					if(window.innerWidth <= 768){
						e.preventDefault();
						if(!subNav.hasClass('is-active')){
							subTitle.each(function(i, elem){
								var subNav1 = $(elem).closest('li');
								subNav1.removeClass('is-active');
							});
							subNav.addClass('is-active');
							var subNavHeight = subNav.get(0).clientHeight;
							if(subNavHeight > 0 && globalNav != null){
								globalNav.get(0).style.minHeight = subNavHeight + 'px';
							}
						} else{
							subNav.removeClass('is-active');
						}
					}
				})
			});
		} else{
			globalNavItem.each(function(i, elem){
				var elem = $(elem);
				var anchor = elem.find('.nav-item');
				var navParent = elem.find(".nav-parent-wrap");
				if(navParent){
					anchor.on('click', function(e){
						if(window.innerWidth > 768){
							if(elem.hasClass('is-hover')){
								elem.removeClass('is-hover');
								header.removeClass('is-hover');
							} else{
								e.preventDefault();
								globalNavItem.removeClass('is-hover');
								header.addClass('is-hover');
								elem.addClass('is-hover');
							}
						}
					});
				}
			});
			$(document).on('click', function(e){
				if(!$(e.target).closest('.nav-global') && !$(e.target).closest('#l-header')){
					globalNavItem.removeClass('is-hover');
					header.removeClass('is-hover');
				}
			});

			var subTitle = $(".nav-global__sub__title");
			subTitle.each(function(i, item){
				var item = $(item);
				var subNav = item.closest('li');
				var subNavWrap = subNav.find(".nav-global__sub__child");
				var globalNav = item.closest('.nav-parent');
				subNav.addClass('has-sub');
				item.on('click', function(e){
					e.preventDefault();
					if(!subNav.hasClass('is-active')){
						subTitle.each(function(i, elem){
							var subNav1 = $(elem).closest('li');
							subNav1.removeClass('is-active');
						});
						subNav.addClass('is-active');
						var subNavHeight = subNavWrap.get(0).clientHeight;
						if(subNavHeight > 0 && globalNav != null){
							globalNav.get(0).style.minHeight = subNavHeight + 'px';
						}
					} else{
						subNav.removeClass('is-active');
					}
				})
			});
		}
	}

	/**
	* jsFullBackground
	*/
	Common.prototype.fullBackground = function(){
		$('.js-fullbg').jsFullBackground();
	}

	/**
	* matchHeight
	*/
	Common.prototype.jsMatchHeight = function(){
		$('.js-matchheight').matchHeight();
		$('.js-matchheight02').matchHeight();
	}

	/**
	* Swiper
	*/
	Common.prototype.jsSwiper = function(){
	
		const swiper = new Swiper('.js-slider', {
			slidesPerView: 3,
			spaceBetween: 40,
		  
			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});
	}
	return Common;
}());


/* ============================================================
 * Plugin
 * ============================================================ */

/*
* jquery-match-height 0.7.2 by @liabru
* http://brm.io/jquery-match-height/
* License MIT
*/
!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=-1,o=-1,n=function(t){return parseFloat(t)||0},a=function(e){var o=1,a=t(e),i=null,r=[];return a.each(function(){var e=t(this),a=e.offset().top-n(e.css("margin-top")),s=r.length>0?r[r.length-1]:null;null===s?r.push(e):Math.floor(Math.abs(i-a))<=o?r[r.length-1]=s.add(e):r.push(e),i=a}),r},i=function(e){var o={
	byRow:!0,property:"height",target:null,remove:!1};return"object"==typeof e?t.extend(o,e):("boolean"==typeof e?o.byRow=e:"remove"===e&&(o.remove=!0),o)},r=t.fn.matchHeight=function(e){var o=i(e);if(o.remove){var n=this;return this.css(o.property,""),t.each(r._groups,function(t,e){e.elements=e.elements.not(n)}),this}return this.length<=1&&!o.target?this:(r._groups.push({elements:this,options:o}),r._apply(this,o),this)};r.version="0.7.2",r._groups=[],r._throttle=80,r._maintainScroll=!1,r._beforeUpdate=null,
	r._afterUpdate=null,r._rows=a,r._parse=n,r._parseOptions=i,r._apply=function(e,o){var s=i(o),h=t(e),l=[h],c=t(window).scrollTop(),p=t("html").outerHeight(!0),u=h.parents().filter(":hidden");return u.each(function(){var e=t(this);e.data("style-cache",e.attr("style"))}),u.css("display","block"),s.byRow&&!s.target&&(h.each(function(){var e=t(this),o=e.css("display");"inline-block"!==o&&"flex"!==o&&"inline-flex"!==o&&(o="block"),e.data("style-cache",e.attr("style")),e.css({display:o,"padding-top":"0",
	"padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),l=a(h),h.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||"")})),t.each(l,function(e,o){var a=t(o),i=0;if(s.target)i=s.target.outerHeight(!1);else{if(s.byRow&&a.length<=1)return void a.css(s.property,"");a.each(function(){var e=t(this),o=e.attr("style"),n=e.css("display");"inline-block"!==n&&"flex"!==n&&"inline-flex"!==n&&(n="block");var a={
	display:n};a[s.property]="",e.css(a),e.outerHeight(!1)>i&&(i=e.outerHeight(!1)),o?e.attr("style",o):e.css("display","")})}a.each(function(){var e=t(this),o=0;s.target&&e.is(s.target)||("border-box"!==e.css("box-sizing")&&(o+=n(e.css("border-top-width"))+n(e.css("border-bottom-width")),o+=n(e.css("padding-top"))+n(e.css("padding-bottom"))),e.css(s.property,i-o+"px"))})}),u.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||null)}),r._maintainScroll&&t(window).scrollTop(c/p*t("html").outerHeight(!0)),
	this},r._applyDataApi=function(){var e={};t("[data-match-height], [data-mh]").each(function(){var o=t(this),n=o.attr("data-mh")||o.attr("data-match-height");n in e?e[n]=e[n].add(o):e[n]=o}),t.each(e,function(){this.matchHeight(!0)})};var s=function(e){r._beforeUpdate&&r._beforeUpdate(e,r._groups),t.each(r._groups,function(){r._apply(this.elements,this.options)}),r._afterUpdate&&r._afterUpdate(e,r._groups)};r._update=function(n,a){if(a&&"resize"===a.type){var i=t(window).width();if(i===e)return;e=i;
	}n?o===-1&&(o=setTimeout(function(){s(a),o=-1},r._throttle)):s(a)},t(r._applyDataApi);var h=t.fn.on?"on":"bind";t(window)[h]("load",function(t){r._update(!1,t)}),t(window)[h]("resize orientationchange",function(t){r._update(!0,t)})});

/**
* Full background
*/
$.fn.jsFullBackground = function(config){
	var defaults = {
			position : 'center center',
			bgsize: 'cover',
			repeat: 'no-repeat'
		};
	var config = $.extend({}, defaults, config);
	return this.each(function() {
		var $this = $(this);
		var $img = $this.children('img').first();
		if (!$img.length) return false;
		var src = $img.attr('src');
		var position = config.position;
		var bgsize = config.bgsize;
		var repeat = config.repeat;
		if ($this.data('position')) {
			position = $this.data('position');
		}
		if ($this.data('bgsize')) {
			bgsize = $this.data('bgsize');
		}
		if ($this.data('repeat')) {
			repeat = $this.data('repeat');
		}
		$this.css({
			backgroundSize: bgsize,
			backgroundImage: 'url(' + src + ')',
			backgroundRepeat: repeat,
			backgroundPosition: position
		});
		$img.hide();
	});
}

/**
* Disable Body Scrolling on iOS
*/
var disableBodyScroll = (function () {
	var _selector = false,
	_element = false,
	_clientY = false;
	var preventBodyScroll = function (event) {
		if (false === _element || $(event.target).closest(_selector).length == 0) {
			event.preventDefault();
		}
	};
	var captureClientY = function (event) {
		if (event.targetTouches.length === 1) { 
			_clientY = event.targetTouches[0].clientY;
		}
	};
	var preventOverscroll = function (event) {
		if (event.targetTouches.length !== 1) {
			return;
		}
		var clientY = event.targetTouches[0].clientY - _clientY;
		if (_element.scrollTop === 0 && clientY > 0) {
			event.preventDefault();
		}
		if ((_element.scrollHeight - _element.scrollTop <= _element.clientHeight) && clientY < 0) {
			event.preventDefault();
		}
	};
	
	return function (allow, selector) {
		if (typeof selector !== "undefined") {
			_selector = selector;
			if(typeof selector != 'object'){
				_element = document.querySelector(selector);
			} else{
				_element = selector;
			}
		}
		if (true === allow) {
			if (false !== _element) {
				_element.addEventListener('touchstart', captureClientY, {passive: false});
				
				_element.addEventListener('touchmove', preventOverscroll, {passive: false});
			}
			document.body.addEventListener("touchmove", preventBodyScroll, {passive: false});
		} else {
			if (false !== _element) {
				_element.removeEventListener('touchstart', captureClientY, {passive: false});
				_element.removeEventListener('touchmove', preventOverscroll, {passive: false});
			}
			document.body.removeEventListener("touchmove", preventBodyScroll, {passive: false});
		}
	};
}());


/* ============================================================
 * Execute JavaScript when the DOM is fully loaded.
 * ============================================================ */
var commonJS;
function eventHandler(){
	commonJS = new Common();
}
if(document.readyState !== 'loading') {
	eventHandler();
} else {
	document.addEventListener('DOMContentLoaded', eventHandler);
}


$(window).scroll(() => {
	var head = $('.js-animation-head');
	var headOffset = head.offset().top;
	var topOffset = $(window).scrollTop();
	var mvHeight = $('.mainVisual').outerHeight();

	(topOffset > mvHeight - head.outerHeight()) ? head.addClass('is-animate') : head.removeClass('is-animate');

})

let slideIndex = 0;
showMvCont();

function showMvCont(){
	var mvCont = document.querySelectorAll(".mainVisual__cont");
	for(i = 0; i < mvCont.length; i++) {
		mvCont[i].className = mvCont[i].className.replace(" active", "");
	}
	slideIndex++;
	if (slideIndex > mvCont.length) {slideIndex = 1}
	mvCont[slideIndex-1].style.opacity = 1;
	mvCont[slideIndex-1].className += " active";
	
	setTimeout(showMvCont, 7000);
	
}

$(window).on('load', function () {
	setTimeout(function(){
		$('#l-loading').fadeOut(1000);
	},3000);
})





