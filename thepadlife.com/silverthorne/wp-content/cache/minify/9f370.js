!function(e){"use strict";e.fn.fusion_scroll_to_anchor_target=function(t){var n,o,s,i,a,l,r,c,u,h,f,d,p=void 0!==e(this).attr("href")?e(this).attr("href"):e(this).data("link"),g=p.substr(p.indexOf("#")).slice(1),m=e("#"+g),y=e("html").hasClass("ua-edge")||e("html").hasClass("ua-safari-12")||e("html").hasClass("ua-safari-11")||e("html").hasClass("ua-safari-10")?"body":"html",b=e(".fusion-tb-header").length,w=!1,_=!1;if(t=void 0!==t?t:0,m.length&&""!==g){if(m.parents(".fusion-scroll-section").hasClass("awb-swiper-full-sections"))return;if((m.parents(".hundred-percent-height-scrolling").length||m.find(".hundred-percent-height-scrolling").length)&&(0!=fusionScrollToAnchorVars.container_hundred_percent_height_mobile||!Modernizr.mq("only screen and (max-width: "+fusionScrollToAnchorVars.content_break_point+"px)"))){if((d=m.hasClass("fusion-scroll-section-element")?m:m.parents(".fusion-scroll-section-element")).hasClass("active")&&d.offset().top>=e(window).scrollTop()&&d.offset().top<e(window).scrollTop()+e(window).height())return!1;if(location.hash&&"#_"===location.hash.substring(0,2)&&e(".fusion-page-load-link").addClass("fusion-page.load-scroll-section-link"),m.parents(".fusion-scroll-section").length)return m.parents(".fusion-scroll-section").hasClass("active")?m.parents(".fusion-scroll-section").find(".fusion-scroll-section-nav").find(".fusion-scroll-section-link[data-element="+d.data("element")+"]").trigger("click"):(f=Math.ceil(m.parents(".fusion-scroll-section").offset().top),e(y).animate({scrollTop:f},{duration:400,easing:"easeInExpo",complete:function(){setTimeout(function(){m.parents(".fusion-scroll-section").find(".fusion-scroll-section-nav").find(".fusion-scroll-section-link[data-element="+d.data("element")+"]").trigger("click"),location.hash&&"#_"===location.hash.substring(0,2)&&("history"in window&&"replaceState"in history&&history.replaceState("",window.location.href.replace("#_","#"),window.location.href.replace("#_","#")),e(".fusion-page-load-link").removeClass("fusion-page.load-scroll-section-link"))},parseInt(fusionScrollToAnchorVars.hundred_percent_scroll_sensitivity)+50)}})),!1}return m.parents(".awb-off-canvas").length?0!==m.parents(".awb-off-canvas-wrap.awb-show").length&&(r=(l=m.parents(".awb-off-canvas-wrap.awb-show").find(".off-canvas-content"))[0].getBoundingClientRect().top,c=m[0].getBoundingClientRect().top,u=l.scrollTop(),i=c<r?u-(r-c):Math.abs(u+(c-r)),h=l[0].scrollHeight-l.outerHeight(),i>h&&(i=h),void l.animate({scrollTop:i},{duration:400})):(n=fusion.getAdminbarHeight(),s=e(document).scrollTop(),b?(e("body").addClass("fusion-scrolling-active"),(w=fusionGetStickyOffset())||(w=n),i=m.offset().top-w-t):(o="function"==typeof getStickyHeaderHeight?getStickyHeaderHeight():0,i=m.offset().top-n-o-t),a=Math.abs(s-i)/2,f=s>i?s-a:s+a,e(y).animate({scrollTop:f},{duration:400,easing:"easeInExpo",complete:function(){n=fusion.getAdminbarHeight(),b?((w=fusionGetStickyOffset())||(w=n),i=Math.ceil(m.offset().top)-w-t):(o="function"==typeof getStickyHeaderHeight?getStickyHeaderHeight():0,i=Math.ceil(m.offset().top)-n-o-t),e(y).animate({scrollTop:i},450,"easeOutExpo",function(){location.hash&&"#_"===location.hash.substring(0,2)&&"history"in window&&"replaceState"in history&&history.replaceState("",window.location.href.replace("#_","#"),window.location.href.replace("#_","#")),b&&((_=fusionGetStickyOffset())||(_=n),w!==_&&(i=Math.ceil(m.offset().top)-_-t,e(y).animate({scrollTop:i},450)),e("body").removeClass("fusion-scrolling-active"))})}}),(m.hasClass("tab-pane")||m.hasClass("tab-link"))&&"function"==typeof e.fn.fusionSwitchTabOnLinkClick&&setTimeout(function(){m.parents(".fusion-tabs").fusionSwitchTabOnLinkClick()},100),!1)}}}(jQuery),jQuery(document).ready(function(){jQuery("body").on("click",'.fusion-menu a:not([href="#"], .fusion-megamenu-widgets-container a, .search-link), .fusion-widget-menu a, .fusion-secondary-menu a, .fusion-mobile-nav-item a:not([href="#"], .search-link), .fusion-button:not([href="#"], input, button), .fusion-one-page-text-link:not([href="#"]), .fusion-content-boxes .fusion-read-more:not([href="#"]), .fusion-imageframe > .fusion-no-lightbox, .content-box-wrapper:not(.link-area-box) .heading-link, a.woocommerce-review-link, .awb-toc-el .awb-toc-el__item-anchor',function(e){var t,n,o,s,i,a,l,r=jQuery("body").hasClass("fusion-builder-live");if(jQuery(this).hasClass("avada-noscroll")||jQuery(this).parent().hasClass("avada-noscroll")||jQuery(this).is(".fusion-content-box-button, .fusion-tagline-button")&&jQuery(this).parents(".avada-noscroll").length)return!0;if(this.hash){if(l=jQuery(this).attr("target")?jQuery(this).attr("target"):"_self",s=(o=void 0!==(n=(t=jQuery(this).attr("href")).split("#"))[1]?n[1]:"").substring(0,1),a=(i=n[0]).substring(i.length-1,i.length),"#hubspot-open-chat"===t)return;if("/"!==a&&(i+="https://thepadlife.com/"),"!"===s||"/"===s)return;e.preventDefault(),location.pathname.replace(/^\//,"")!=this.pathname.replace(/^\//,"")&&"#"!==t.charAt(0)||""!==location.search&&-1===location.search.indexOf("lang=")&&-1===location.search.indexOf("builder=")&&!jQuery(this).hasClass("tfs-scroll-down-indicator")&&!jQuery(this).hasClass("fusion-same-page-scroll")?r||t.includes("-oc__")||("/"===i&&""!==location.search&&(i=location.href.replace(location.search,"")),window.open(i+"#_"+o,l)):(jQuery(this).fusion_scroll_to_anchor_target(),"history"in window&&"replaceState"in history&&!r&&history.replaceState("",t,t),jQuery(this).closest(".awb-menu.flyout-submenu-expanded").length?jQuery(this).closest(".awb-menu.flyout-submenu-expanded").find(".awb-menu__flyout-close").trigger("click"):jQuery(this).closest(".fusion-flyout-menu").length?jQuery(".fusion-flyout-menu-toggle").trigger("click"):jQuery(this).closest(".fusion-megamenu-menu, .awb-menu__sub-ul").length&&jQuery(this).blur())}})}),location.hash&&"#_"===location.hash.substring(0,2)&&(jQuery(".fusion-page-load-link").attr("href",decodeURIComponent("#"+location.hash.substring(2))),jQuery(window).on("load",function(){jQuery(".fusion-blog-shortcode").length?setTimeout(function(){jQuery(".fusion-page-load-link").fusion_scroll_to_anchor_target()},300):jQuery(".fusion-page-load-link").fusion_scroll_to_anchor_target()}));;function checkHoverTouchState(){var e,o=!1;document.addEventListener("touchstart",function(){clearTimeout(e),o=!0,jQuery("body").addClass("fusion-touch"),jQuery("body").removeClass("fusion-no-touch"),e=setTimeout(function(){o=!1},500)},{passive:!0}),document.addEventListener("mouseover",function(){o||(o=!1,jQuery("body").addClass("fusion-no-touch"),jQuery("body").removeClass("fusion-touch"))})}checkHoverTouchState(),jQuery(document).ready(function(){jQuery("input, textarea").placeholder()});