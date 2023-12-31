"use strict";
//Wrapping all JavaScript code into a IIFE function for prevent global variables creation
(function($) {

    var $body = $('body');
    var $window = $(window);

    function putPlaceholdersToInputs() {
        $('select').wrap('<div class="select-wrap"></div>');

        //for categories
        $('select[name="cat"]').on('change', function() {
            var $form = $(this).closest('form');
            if ($form.length) {
                $form.trigger('submit');
            }
        });

        $('label[for]').each(function() {
            var $label = $(this);
            var $input = $('#' + $label.attr('for'));
            if (!$input.attr('placeholder')) {
                if (!$input.is('[type="radio"]') && !$input.is('[type="checkbox"]') && !$input.is('select')) {
                    $input.attr('placeholder', $label.text());
                    $label.css({
                        'display': 'none'
                    });
                }
            }
        })
    }

    //hidding menu elements that do not fit in menu width
    //processing center logo
    function menuHideExtraElements() {

        if ($body.hasClass('header_show_all_menu_items') && !$body.find('.header_logo_center').length) {
            return;
        }
        //cleaning changed elements
        $('.sf-more-li, .sf-logo-li').remove();
        var windowWidth = $('body').innerWidth();

        $('.sf-menu').each(function() {
            var $thisMenu = $(this);
            var $menuWraper = $thisMenu.closest('.top-nav');
            $menuWraper.attr('style', '');
            if (windowWidth > 1199) {
                //grab all main menu first level items
                var $menuLis = $menuWraper.find('.sf-menu > li');
                $menuLis.removeClass('sf-xl-hidden');

                var $headerLogoCenter = $thisMenu.closest('.header_logo_center');
                var logoWidth = 0;
                var summaryLiWidth = 0;

                if ($headerLogoCenter.length) {
                    var $logo = $headerLogoCenter.find('.logo');
                    // 30/2 - left and right margins
                    logoWidth = $logo.outerWidth(true) + 70;
                }

                // var wrapperWidth = $('.sf-menu').width();
                var wrapperWidth = $menuWraper.outerWidth(true);
                $menuLis.each(function(index) {
                    //4 - 4px additional width for inline-block LI element
                    var elementWidth = $(this).outerWidth() + 4;
                    summaryLiWidth += elementWidth;
                    if (summaryLiWidth >= (wrapperWidth - logoWidth)) {
                        var $newLi = $('<li class="sf-more-li"><a>...</a><ul></ul></li>');
                        $($menuLis[index - 1]).before($newLi);
                        var newLiWidth = $($newLi).outerWidth(true);
                        var $extraLiElements = $menuLis.filter(':gt(' + (index - 2) + ')');
                        $extraLiElements.clone().appendTo($newLi.find('ul'));
                        $extraLiElements.addClass('sf-xl-hidden');
                        return false;
                    }
                });

                //processing center logo
                if ($headerLogoCenter.length) {
                    var $menuLisVisible = $headerLogoCenter.find('.sf-menu > li:not(.sf-xl-hidden)');
                    var menuLength = $menuLisVisible.length;
                    var summaryLiVisibleWidth = 0;
                    $menuLisVisible.each(function() {
                        summaryLiVisibleWidth += $(this).outerWidth();
                    });

                    var centerLi = Math.floor(menuLength / 2);
                    if ((menuLength % 2 === 0)) {
                        centerLi--;
                    }
                    var $liLeftFromLogo = $menuLisVisible.eq(centerLi);
                    $liLeftFromLogo.after('<li class="sf-logo-li"><a href="#">&nbsp;</a></li>');
                    $headerLogoCenter.find('.sf-logo-li').width(logoWidth);
                    var liLeftRightDotX = $liLeftFromLogo.offset().left + $liLeftFromLogo.outerWidth();
                    var logoLeftDotX = windowWidth / 2 - logoWidth / 2;
                    var menuLeftOffset = liLeftRightDotX - logoLeftDotX;
                    $menuWraper.css({
                        'left': -menuLeftOffset
                    })
                }

            } // > 991
        }); //sf-menu each
    } //menuHideExtraElements

    function initMegaMenu(timeOut) {
        var $megaMenu = $('.top-nav .mega-menu');
        if ($megaMenu.length) {
            setTimeout(function() {

                var windowWidth = $('body').innerWidth();
                if (windowWidth > 991) {
                    $megaMenu.each(function() {
                        var $thisMegaMenu = $(this);
                        //temporary showing mega menu to proper size calc
                        $thisMegaMenu.css({
                            'display': 'block',
                            'left': 'auto'
                        });

                        //checking for sticked side header
                        var stickedSideHeaderWidth = 0;
                        var $stickedSideHeader = $('.header_side_sticked');
                        if ($stickedSideHeader.length && $stickedSideHeader.hasClass('active-slide-side-header')) {
                            stickedSideHeaderWidth = $stickedSideHeader.outerWidth(true);
                            if ($stickedSideHeader.hasClass('header_side_right')) {
                                stickedSideHeaderWidth = -stickedSideHeaderWidth;
                            }
                            windowWidth = windowWidth - stickedSideHeaderWidth;
                        }
                        var thisWidth = $thisMegaMenu.outerWidth();
                        var thisOffset = $thisMegaMenu.offset().left - stickedSideHeaderWidth;
                        var thisLeft = (thisOffset + (thisWidth / 2)) - windowWidth / 2;
                        $thisMegaMenu.css({
                            'left': -thisLeft,
                            'display': 'none'
                        });
                        if (!$thisMegaMenu.closest('ul').hasClass('nav')) {
                            $thisMegaMenu.css('left', '');
                        }
                    });
                }
            }, timeOut);

        }
    }

    //NOTE: affixed sidebar works bad with side headers
    function initAffixSidebar() {
        var $affixAside = $('.affix-aside');
        if ($affixAside.length) {

            $window = $(window);

            //on stick and unstick event
            $affixAside.on('affix.bs.affix', function(e) {
                var affixWidth = $affixAside.width() - 1;
                var affixLeft = $affixAside.offset().left;
                $affixAside
                    .width(affixWidth)
                    .css("left", affixLeft);

            }).on('affix-bottom.bs.affix', function(e) {
                var affixWidth = $affixAside.width() - 1;
                //if sticked left header
                var stickedSideHeaderWidth = 0;
                var $stickedSideHeader = $('.header_side_sticked');
                if ($stickedSideHeader.length && $stickedSideHeader.hasClass('active-slide-side-header') && !$stickedSideHeader.hasClass('header_side_right')) {
                    stickedSideHeaderWidth = $stickedSideHeader.outerWidth(true);
                }
                var affixLeft = $affixAside.offset().left - stickedSideHeaderWidth - $('#box_wrapper').offset().left;;

                $affixAside
                    .width(affixWidth)
                    .css("left", affixLeft);
            }).on('affix-top.bs.affix', function(e) {
                $affixAside.css({
                    "width": "",
                    "left": ""
                });
            });

            //counting offset
            var offsetTopAdd = 10;
            var offsetBottomAdd = 150;
            var offsetTop = $affixAside.offset().top - $('.page_header').height();
            //note that page_footer and page_copyright sections must exists - else this will cause error in last jQuery versions
            var offsetBottom = $('.page_footer').outerHeight(true) + $('.page_copyright').outerHeight(true);

            $affixAside.affix({
                offset: {
                    top: offsetTop - offsetTopAdd,
                    bottom: offsetBottom + offsetBottomAdd
                },
            });

            $window.on('resize', function() {
                //returning sidebar in top position if it is sticked because of unexpected behavior
                $affixAside.removeClass("affix affix-bottom").addClass("affix-top").trigger('affix-top.bs.affix');

                var offsetTopSectionsArray = [
                    '.page_topline',
                    '.page_toplogo',
                    '.page_header',
                    '.page_title',
                    '.blog_slider',
                    '.blog-featured-posts'
                ];
                var offsetTop = 0;

                offsetTopSectionsArray.map(function(val) {
                    offsetTop += $(val).outerHeight(true) || 0;
                });
                //note that page_footer and page_copyright sections must exists - else this will cause error in last jQuery versions
                var offsetBottom = $('.page_footer').outerHeight(true) +
                    $('.page_copyright').outerHeight(true);

                $affixAside.data('bs.affix').options.offset.top = offsetTop - offsetTopAdd;
                $affixAside.data('bs.affix').options.offset.bottom = offsetBottom + offsetBottomAdd;

                $affixAside.affix('checkPosition');

            });

            $affixAside.affix('checkPosition');

        } //eof checking of affix sidebar existing
    }

    //photoSwipe gallery plugin
    function initPhotoSwipe() {
        if (typeof PhotoSwipe !== 'undefined') {

            //adding prettyPhoto for backward compatibility. Deprecated.
            //will leave only .photoswipe-link later
            var gallerySelectors = '.photoswipe-link, a[data-gal^="prettyPhoto"], [data-thumb] a';
            var $galleryLinks = $(gallerySelectors);
            if ($galleryLinks.length) {

                //adding photoswipe gallery markup
                if (!($('.pswp').length)) {
                    $body.append('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><a class="pswp__button pswp__button--close" title="Close (Esc)"></a><a class="pswp__button pswp__button--share" title="Share"></a><a class="pswp__button pswp__button--fs" title="Toggle fullscreen"></a><a class="pswp__button pswp__button--zoom" title="Zoom in/out"></a><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div> </div><a class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></a><a class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></a><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
                    //if function already was called - return (all listeners was setted and .pswp gallery container was added)
                } else {
                    return;
                }
                //adding prettyPhoto for backward compatibility. Deprecated.
                $('body').on('click', gallerySelectors, function(e) {
                    e.preventDefault();

                    var $link = $(this);
                    var $linksParentContainer = $link.closest('.photoswipe-container, .isotope-wrapper, .owl-carousel, .flickr_ul, .images');
                    var $links = $linksParentContainer.find(gallerySelectors);

                    //if no container only adding this link
                    if (!$links.length) {
                        $links.push($link);
                    }
                    var items = [];

                    var options = {
                        bgOpacity: 0.7,
                        showHideOpacity: true,
                        history: false,
                        shareEl: false,
                        index: 0
                    };
                    var gallery = $('.pswp')[0];
                    //building items array
                    var counter = 0;
                    var clonedClick = false;
                    var clonedRealIndex = 0;
                    $links.each(function(i) {
                        var $this = $(this);
                        //if cloned element (owl or flexslider thumbs) - continue
                        if ($this.closest('.clone, .cloned').length) {
                            if (($link[0] === $this[0])) {
                                clonedClick = true;
                                clonedRealIndex = parseInt($this.data('index'), 10);
                                options.index = clonedRealIndex;
                            }
                            return;
                        }
                        var item = {};
                        //start slide from clicked element
                        if (($link[0] === $this[0])) {
                            options.index = counter;
                        }

                        //video or image
                        if ($this.data('iframe')) {
                            var autoplay = ($links.length > 1) ? '' : '&autoplay=1';
                            item.html = '<div class="embed-responsive embed-responsive-16by9">';
                            //for wordpress - iframe tag is escaped
                            if ($this.data('iframe').indexOf('src=') !== -1) {
                                item.html += $this.data('iframe').replace(/&amp/g, '&').replace(/$lt;/g, '<').replace(/&gt;/g, '>').replace(/$quot;/g, '"');

                                //for html - building iframe manually
                            } else {
                                //autoplay only if 1 iframe in gallery
                                item.html += '<iframe class="embed-responsive-item" src="' + $(this).data('iframe') + '?rel=0' + autoplay + '&enablejsapi=1&api=1"></iframe>';
                            }
                            // item.html += '<iframe class="embed-responsive-item" src="'+ $(this).data('iframe') + '?rel=0&autoplay=1'+ '"></iframe>';
                            item.html += '</div>';
                        } else {
                            item.src = $this.attr('href');
                            //default values
                            var width = 1170;
                            var height = 780;
                            //template data on A element
                            var data = $this.data();
                            //image data in Woo
                            var dataImage = $this.find('img').first().data();
                            if (data.width) {
                                width = data.width;
                            }
                            if (data.height) {
                                height = data.height;
                            }
                            if (typeof dataImage !== 'undefined') {
                                if (dataImage.large_image_width) {
                                    width = dataImage.large_image_width;
                                }
                                if (dataImage.large_image_height) {
                                    height = dataImage.large_image_height;
                                }
                            }
                            item.w = width;
                            item.h = height;
                        }
                        items.push(item);
                        counter++;
                    });

                    var pswpGallery = new PhotoSwipe(gallery, PhotoSwipeUI_Default, items, options);
                    pswpGallery.init();

                    //pausing video on close and on slide change
                    pswpGallery.listen('afterChange', function() {
                        $(pswpGallery.container).find('iframe').each(function() {
                            //"method":"pause" - form Vimeo, other - for YouTube
                            $(this)[0].contentWindow.postMessage('{"method":"pause","event":"command","func":"pauseVideo","args":""}', '*')
                        });
                    });
                    pswpGallery.listen('close', function() {
                        $(pswpGallery.container).find('iframe').each(function() {
                            //"method":"pause" - form Vimeo, other - for YouTube
                            $(this)[0].contentWindow.postMessage('{"method":"pause","event":"command","func":"pauseVideo","args":""}', '*')
                        });
                    });

                });
            }

        }
    }

    //helper functions to init elements only when they appears in viewport (jQUery.appear plugin)
    function initAnimateElement(self, index) {
        var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
        var animationDelay = !self.data('delay') ? 150 : self.data('delay');
        setTimeout(function() {
            self.addClass("animated " + animationClass);
        }, index * animationDelay);
    }

    function initCounter(self) {
        if (self.hasClass('counted')) {
            return;
        } else {
            self.countTo().addClass('counted');
        }
    }

    function initProgressbar(el) {
        el.progressbar({
            transition_delay: 300
        });
    }

    function initChart(el) {
        var data = el.data();
        var size = data.size ? data.size : 270;
        var line = data.line ? data.line : 20;
        var bgcolor = data.bgcolor ? data.bgcolor : '#ffffff';
        var trackcolor = data.trackcolor ? data.trackcolor : '#c14240';
        var speed = data.speed ? data.speed : 3000;

        el.easyPieChart({
            barColor: trackcolor,
            trackColor: bgcolor,
            scaleColor: false,
            scaleLength: false,
            lineCap: 'butt',
            lineWidth: line,
            size: size,
            rotate: 0,
            animate: speed,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });
    }


    //function that initiating template plugins on window.load event
    function documentReadyInit() {
        ////////////
        //mainmenu//
        ////////////
        if ($().scrollbar) {
            $('[class*="scrollbar-"]').scrollbar();
            //fix for firefox on mac
            if (/mac/i.test(navigator.platform) && /firefox/i.test(navigator.userAgent)) {
                jQuery('[class*="scrollbar-"]').addClass('scroll-content').wrap('<div class="scroll-wrapper firefox-on-macos"></div>');
            }
        }
        if ($().superfish) {
            $('ul.sf-menu').superfish({
                popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
                delay: 700,
                animation: {
                    opacity: 'show',
                    marginTop: 0
                },
                animationOut: {
                    opacity: 'hide',
                    marginTop: 5
                },
                speed: 200,
                speedOut: 200,
                disableHI: false,
                cssArrows: true,
                autoArrows: true,
                onInit: function() {
                    var $thisMenu = $(this);
                    $thisMenu.find('.sf-with-ul').after('<span class="sf-menu-item-mobile-toggler"/>');
                    $thisMenu.find('.sf-menu-item-mobile-toggler').on('click', function(e) {
                        var $parentLi = $(this).parent();
                        if ($parentLi.hasClass('sfHover')) {
                            $parentLi.superfish('hide');
                        } else {
                            $parentLi.superfish('show');
                        }
                    });
                    //for wp - add .active on li
                    $thisMenu.find('.current-menu-parent, .current-menu-item').addClass('active');
                }

            });
            $('ul.sf-menu-side').superfish({
                popUpSelector: 'ul:not(.mega-menu ul), .mega-menu ',
                delay: 500,
                animation: {
                    opacity: 'show',
                    height: 100 + '%'
                },
                animationOut: {
                    opacity: 'hide',
                    height: 0
                },
                speed: 400,
                speedOut: 300,
                disableHI: false,
                cssArrows: true,
                autoArrows: true
            });
        }


        //toggle mobile menu
        $('.page_header .toggle_menu, .page_toplogo .toggle_menu').on('click', function() {
            $(this)
                .toggleClass('mobile-active')
                .closest('.page_header')
                .toggleClass('mobile-active')
                .end()
                .closest('.page_toplogo')
                .next()
                .find('.page_header')
                .toggleClass('mobile-active');
            $body.toggleClass('overflow-hidden-lg');
        });

        $('.sf-menu a').on('click', function() {
            var $this = $(this);
            //If this is a local link or item with sumbenu - not toggling menu
            if (($this.hasClass('sf-with-ul')) || !($this.attr('href').charAt(0) === '#')) {
                return;
            }
            $this
                .closest('.page_header')
                .toggleClass('mobile-active')
                .find('.toggle_menu')
                .toggleClass('mobile-active');
            $body.toggleClass('overflow-hidden-lg');
        });

        //side header processing
        var $sideHeader = $('.page_header_side');
        // toggle sub-menus visibility on menu-click
        $('ul.menu-click').find('li').each(function() {
            var $thisLi = $(this);
            //toggle submenu only for menu items with submenu
            if ($thisLi.find('ul').length) {
                $thisLi
                    .append('<span class="toggle_submenu color-darkgrey"></span>')
                    //adding anchor
                    .find('.toggle_submenu, > a')
                    .on('click', function(e) {
                        var $thisSpanOrA = $(this);
                        //if this is a link and it is already opened - going to link
                        if (($thisSpanOrA.attr('href') === '#') || !($thisSpanOrA.parent().hasClass('active-submenu'))) {
                            e.preventDefault();
                        }
                        if ($thisSpanOrA.parent().hasClass('active-submenu')) {
                            $thisSpanOrA.parent().removeClass('active-submenu');
                            return;
                        }
                        $thisLi.addClass('active-submenu').siblings().removeClass('active-submenu');
                    });
            } //eof sumbenu check
        });
        if ($sideHeader.length) {
            $('.toggle_menu_side').on('click', function() {
                var $thisToggler = $(this);
                $thisToggler.toggleClass('active');
                if ($thisToggler.hasClass('header-slide')) {
                    $sideHeader.toggleClass('active-slide-side-header');
                } else {
                    if ($thisToggler.parent().hasClass('header_side_right')) {
                        $body.toggleClass('active-side-header slide-right');
                    } else {
                        $body.toggleClass('active-side-header');
                    }
                    $body.parent().toggleClass('html-active-push-header');
                }
                //fixing mega menu and aside affix on toggling side sticked header
                if ($thisToggler.closest('.header_side_sticked').length) {
                    initMegaMenu(600);
                    var $affixAside = $('.affix-aside');
                    if ($affixAside.length) {
                        $affixAside.removeClass("affix affix-bottom").addClass("affix-top").css({
                            "width": "",
                            "left": ""
                        }).trigger('affix-top.bs.affix');
                        setTimeout(function() {
                            $affixAside.removeClass("affix affix-bottom").addClass("affix-top").css({
                                "width": "",
                                "left": ""
                            }).trigger('affix-top.bs.affix');
                        }, 10);
                    }
                }
            });
            //hidding side header on click outside header
            $body.on('mousedown touchstart', function(e) {
                if (!($(e.target).closest('.page_header_side').length) && !($sideHeader.hasClass('header_side_sticked'))) {
                    $sideHeader.removeClass('active-slide-side-header');
                    $body.removeClass('active-side-header slide-right');
                    $body.parent().removeClass('html-active-push-header');
                    var $toggler = $('.toggle_menu_side');
                    if (($toggler).hasClass('active')) {
                        $toggler.removeClass('active');
                    }
                }
            });
        } //sideHeader check

        //1 and 2/3/4th level offscreen fix
        var MainWindowWidth = $window.width();
        $window.on('resize', function() {
            MainWindowWidth = $(window).width();
        });
        //2/3/4 levels
        $('.top-nav .sf-menu').on('mouseover', 'ul li', function() {
            // $('.mainmenu').on('mouseover', 'ul li', function(){
            if (MainWindowWidth > 991) {
                var $this = $(this);
                // checks if third level menu exist
                var subMenuExist = $this.find('ul').length;
                if (subMenuExist > 0) {
                    var subMenuWidth = $this.find('ul, div').first().width();
                    var subMenuOffset = $this.find('ul, div').first().parent().offset().left + subMenuWidth;
                    // if sub menu is off screen, give new position
                    if ((subMenuOffset + subMenuWidth) > MainWindowWidth) {
                        var newSubMenuPosition = subMenuWidth + 0;
                        $this.find('ul, div').first().css({
                            left: -newSubMenuPosition,
                        });
                    } else {
                        $this.find('ul, div').first().css({
                            left: '100%',
                        });
                    }
                }
            }
            //1st level
        }).on('mouseover', '> li', function() {
            if (MainWindowWidth > 991) {
                var $this = $(this);
                var subMenuExist = $this.find('ul').length;
                if (subMenuExist > 0) {
                    var subMenuWidth = $this.find('ul').width();
                    var subMenuOffset = $this.find('ul').parent().offset().left;
                    // if sub menu is off screen, give new position
                    if ((subMenuOffset + subMenuWidth) > MainWindowWidth) {
                        var newSubMenuPosition = MainWindowWidth - (subMenuOffset + subMenuWidth);
                        $this.find('ul').first().css({
                            left: newSubMenuPosition,
                        });
                    }
                }
            }
        });

        /////////////////////////////////////////
        //single page localscroll and scrollspy//
        /////////////////////////////////////////
        var navHeight = $('.page_header').outerHeight(true);
        //if sidebar nav exists - binding to it. Else - to main horizontal nav
        if ($('.mainmenu_side_wrapper').length) {
            $body.scrollspy({
                target: '.mainmenu_side_wrapper',
                offset: navHeight ? navHeight : 50
            });
        } else if ($('.top-nav').length) {
            $body.scrollspy({
                target: '.top-nav',
                offset: navHeight
            })
        }
        if ($().localScroll) {
            $('.top-nav > ul, .mainmenu_side_wrapper > ul, #land,  .comments-link').localScroll({
                duration: 900,
                easing: 'easeInOutQuart',
                offset: navHeight ? -navHeight + 40 : -20
            });
        }

        //background image teaser and sections with half image bg
        //put this before prettyPhoto init because image may be wrapped in prettyPhoto link
        $(".bg_teaser, .cover-image").each(function() {
            var $element = $(this);
            var $image = $element.find("img").first();
            if (!$image.length) {
                $image = $element.parent().find("img").first();
            }
            if (!$image.length) {
                return;
            }
            var imagePath = $image.attr("src");
            $element.css("background-image", "url(" + imagePath + ")");
            var $imageParent = $image.parent();
            //if image inside link - adding this link, removing gallery to preserve duplicating gallery items
            if ($imageParent.is('a')) {
                $element.prepend($image.parent().clone().html(''));
                $imageParent.attr('data-gal', '');
            }
        });

        //video images preview - from WP
        $('.embed-placeholder').each(function() {
            $(this).on('click', function(e) {
                var $thisLink = $(this);
                // if prettyPhoto popup with YouTube - return
                if ($thisLink.hasClass('photoswipe-link')) {
                    return;
                }
                e.preventDefault();
                if ($thisLink.attr('href') === '' || $thisLink.attr('href') === '#') {
                    $thisLink.replaceWith($thisLink.data('iframe').replace(/&amp/g, '&').replace(/$lt;/g, '<').replace(/&gt;/g, '>').replace(/$quot;/g, '"')).trigger('click');
                } else {
                    $thisLink.replaceWith('<iframe class="embed-responsive-item" src="' + $thisLink.attr('href') + '?rel=0&autoplay=1' + '"></iframe>');
                }
            });
        });

        //toTop
        if ($().UItoTop) {
            $().UItoTop({
                easingType: 'easeInOutQuart'
            });
        }

        //parallax
        if ($().parallax) {
            $('.s-parallax').parallax("50%", 0.01);
        }

        //prettyPhoto
        if ($().prettyPhoto) {
            $("a[data-gal^='prettyPhoto']").prettyPhoto({
                hook: 'data-gal',
                theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
            });
        }
        initPhotoSwipe();

        ////////////////////////////////////////
        //init Bootstrap JS components//
        ////////////////////////////////////////

        //video in bootstrap tabs
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            if (typeof(e.relatedTarget) !== 'undefined') {
                var iframe = $(e.relatedTarget.hash).find('iframe');
                var src = iframe.attr('src');
                iframe.attr('src', '');
                iframe.attr('src', src);
            }
        });


        //bootstrap carousel
        if ($().carousel) {
            $('.carousel').carousel();
        }

        //bootstrap collapse - show first tab
        $('.panel-group').each(function() {
            $(this).find('a').first().filter('.collapsed').trigger('click');
        });
        //tooltip
        if ($().tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }

        //comingsoon counter
        if ($().countdown) {
            var $counter = $('#comingsoon-countdown, .comingsoon-countdown');
            $counter.each(function() {
                var $this = $(this);
                //today date plus month for demo purpose
                var date = ($this.data('date') !== 'undefined') ? $this.data('date') : false;
                if (date) {
                    date = new Date(date);
                } else {
                    date = new Date();
                    date.setMonth(date.getMonth() + 1);
                }
                $this.countdown({
                    until: date
                });
            });
        }

        /////////////////////////////////////////////////
        //PHP widgets - search//
        /////////////////////////////////////////////////

        //search modal
        $(".search_modal_button").on('click', function(e) {
            e.preventDefault();
            $('#search_modal').modal('show').find('input').first().focus();
        });

        //placeholders to inputs
        putPlaceholdersToInputs();
    }

    //function that initiating template plugins on window.load event
    function windowLoadInit() {
        //////////////
        //flexslider//
        //////////////
        if ($().flexslider) {
            //Team Slider Shortcode
            $('.flexslider.theme-slider').flexslider({
                directionNav: false,
                manualControls: ".flex-control-nav-1 li.menu__item"
            });
            var $introSlider = $(".page_slider .flexslider");
            $introSlider.each(function(index) {
                var $currentSlider = $(this);
                var data = $currentSlider.data();
                var nav = (data.nav !== 'undefined') ? data.nav : true;
                var dots = (data.dots !== 'undefined') ? data.dots : true;
                var speed = (data.speed !== 'undefined') ? data.speed : 7000;

                $currentSlider.flexslider({
                    animation: "fade",
                    pauseOnHover: true,
                    useCSS: true,
                    controlNav: dots,
                    directionNav: nav,
                    prevText: "",
                    nextText: "",
                    smoothHeight: false,
                    slideshowSpeed: speed,
                    animationSpeed: 600,
                    start: function(slider) {
                        slider.find('.intro_layers').children().css({
                            'visibility': 'hidden'
                        });
                        slider.find('.flex-active-slide .intro_layers').children().each(function(index) {
                            var self = $(this);
                            var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                            setTimeout(function() {
                                self.addClass("animated " + animationClass);
                            }, index * 250);
                        });
                    },
                    after: function(slider) {
                        slider.find('.flex-active-slide .intro_layers').children().each(function(index) {
                            var self = $(this);
                            var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                            setTimeout(function() {
                                self.addClass("animated " + animationClass);
                            }, index * 250);
                        });
                    },
                    end: function(slider) {
                        slider.find('.intro_layers').children().each(function() {
                            var self = $(this);
                            var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                            self.removeClass('animated ' + animationClass).css({
                                'visibility': 'hidden'
                            });
                            // $(this).attr('class', '');
                        });
                    },

                })
                //wrapping nav with container - uncomment if need
            }); //flex slider

            $(".flexslider").each(function(index) {
                var $currentSlider = $(this);
                //exit if intro slider already activated
                if ($currentSlider.find('.flex-active-slide').length) {
                    return;
                }
                $currentSlider.flexslider({
                    animation: "fade",
                    useCSS: true,
                    controlNav: true,
                    directionNav: false,
                    prevText: "",
                    nextText: "",
                    smoothHeight: false,
                    slideshowSpeed: 5000,
                    animationSpeed: 800,
                })
            });
        }

        ////////////////
        //owl carousel//
        ////////////////
        if ($().owlCarousel) {
            $('.owl-carousel').each(function() {
                var $carousel = $(this);
                $carousel.find('> *').each(function(i) {
                    $(this).attr('data-index', i);
                });
                var data = $carousel.data();

                var loop = data.loop ? data.loop : false,
                    margin = (data.margin || data.margin === 0) ? data.margin : 30,
                    nav = data.nav ? data.nav : false,
                    navPrev = data.navPrev ? data.navPrev : '<i class="fa fa-chevron-left">',
                    navNext = data.navNext ? data.navNext : '<i class="fa fa-chevron-right">',
                    dots = data.dots ? data.dots : false,
                    themeClass = data.themeclass ? data.themeclass : 'owl-theme',
                    center = data.center ? data.center : false,
                    items = data.items ? data.items : 4,
                    autoplay = data.autoplay ? data.autoplay : false,
                    responsiveXs = data.responsiveXs ? data.responsiveXs : 1,
                    responsiveXsm = data.responsiveXsm ? data.responsiveXsm : 1,
                    responsiveSm = data.responsiveSm ? data.responsiveSm : 2,
                    responsiveMd = data.responsiveMd ? data.responsiveMd : 3,
                    responsiveLg = data.responsiveLg ? data.responsiveLg : 4,
                    draggable = (data.draggable === false) ? data.draggable : true,
                    syncedClass = (data.syncedClass) ? data.syncedClass : false,
                    filters = data.filters ? data.filters : false;

                if (filters) {
                    $carousel.after($carousel.clone().addClass('owl-carousel-filter-cloned'));
                    $(filters).on('click', 'a', function(e) {
                        //processing filter link
                        e.preventDefault();
                        if ($(this).hasClass('selected')) {
                            return;
                        }
                        var filterValue = $(this).attr('data-filter');
                        $(this).siblings().removeClass('selected active');
                        $(this).addClass('selected active');

                        //removing old items
                        for (var i = $carousel.find('.owl-item').length - 1; i >= 0; i--) {
                            $carousel.trigger('remove.owl.carousel', [1]);
                        };

                        //adding new items
                        var $filteredItems = $($carousel.next().find(' > ' + filterValue).clone());
                        $filteredItems.each(function() {
                            $carousel.trigger('add.owl.carousel', $(this));
                            $(this).addClass('scaleAppear');
                        });

                        $carousel.trigger('refresh.owl.carousel');

                        //reinit prettyPhoto in filtered OWL carousel
                        if ($().prettyPhoto) {
                            $carousel.find("a[data-gal^='prettyPhoto']").prettyPhoto({
                                hook: 'data-gal',
                                theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
                            });
                        }
                    });

                } //filters

                $carousel.owlCarousel({
                        loop: loop,
                        margin: margin,
                        nav: nav,
                        autoplay: autoplay,
                        dots: dots,
                        themeClass: themeClass,
                        center: center,
                        navText: [navPrev, navNext],
                        mouseDrag: draggable,
                        touchDrag: draggable,
                        items: items,
                        responsive: {
                            0: {
                                items: responsiveXs
                            },
                            575: {
                                items: responsiveXsm
                            },
                            767: {
                                items: responsiveSm
                            },
                            992: {
                                items: responsiveMd
                            },
                            1200: {
                                items: responsiveLg
                            }
                        },
                    })
                    .addClass(themeClass);
                if (center) {
                    $carousel.addClass('owl-center');
                }

                $window.on('resize', function() {
                    $carousel.trigger('refresh.owl.carousel');
                });

                //topline two synced carousels
                if ($carousel.hasClass('owl-news-slider-items') && syncedClass) {
                    $carousel.on('changed.owl.carousel', function(e) {
                        var indexTo = loop ? e.item.index + 1 : e.item.index;
                        $(syncedClass).trigger('to.owl.carousel', [indexTo]);
                    })
                }

            });

        } //eof owl-carousel

        $(document).ready(function() {
            //jQuery UI slider for owl carousel
            if (jQuery().slider) {
                var $slider = jQuery(".owl-carousel-slider");
                $slider.each(function() {
                    var $this = jQuery(this);
                    var data = $this.data();
                    $this.slider({
                        range: "min",
                        value: 0,
                        min: 0,
                        max: data.itemsCount,
                        step: 1,
                        slide: function(event, ui) {
                            jQuery(data.carousel).trigger('to.owl.carousel', [ui.value, 500])
                        }
                    });
                })
            }
        });

        ////////////////////
        //header processing/
        ////////////////////
        //stick header to top
        //wrap header with div for smooth sticking
        var $header = $('.page_header').first();
        var boxed = $header.closest('.boxed').length;
        var headerSticked = $('.header_side_sticked').length;
        var headerStickedDisabled = ($body.hasClass('header_disable_affix_xl') && $body.hasClass('header_disable_affix_xs')) ? true : false;
        if ($header.length) {
            //hiding main menu 1st levele elements that do not fit width
            menuHideExtraElements();
            //mega menu
            initMegaMenu(1);

            if (!headerStickedDisabled) {

                //wrap header for smooth stick and unstick
                var headerHeight = $header.outerHeight();
                //wrap header only if it not inside .header_absolute class
                // if( !($header.closest('.header_absolute')).length) {
                $header.wrap('<div class="page_header_wrapper"></div>');
                // }
                var $headerWrapper = $('.page_header_wrapper');
                if (!boxed) {
                    $headerWrapper.css({
                        height: headerHeight
                    });
                }

                //headerWrapper background - same as header
                if ($header.hasClass('ls')) {
                    $headerWrapper.addClass('ls');
                    if ($header.hasClass('ms')) {
                        $headerWrapper.addClass('ms');
                    }
                } else if ($header.hasClass('ds')) {
                    $headerWrapper.addClass('ds');
                    if ($header.hasClass('bs')) {
                        $headerWrapper.addClass('bs');
                    }
                    if ($header.hasClass('ms')) {
                        $headerWrapper.addClass('ms');
                    }

                } else if ($header.hasClass('cs')) {
                    $headerWrapper.addClass('cs');
                    if ($header.hasClass('cs2')) {
                        $headerWrapper.addClass('cs2');
                    }
                    if ($header.hasClass('cs3')) {
                        $headerWrapper.addClass('cs3');
                    }
                } else if ($header.hasClass('gradient-background')) {
                    $headerWrapper.addClass('gradient-background');
                }

                //get offset
                var headerOffset = 0;
                //check for sticked template headers
                if (!boxed && !($headerWrapper.css('position') === 'fixed')) {
                    headerOffset = $header.offset().top;
                }

                //for boxed layout - show or hide main menu elements if width has been changed on affix
                $header.on('affixed-top.bs.affix affixed.bs.affix affixed-bottom.bs.affix', function(e) {
                    if ($header.hasClass('affix-top')) {
                        $headerWrapper.removeClass('affix-wrapper affix-bottom-wrapper').addClass('affix-top-wrapper');
                        //cs to ls when affixed
                        // if($header.hasClass('cs')) {
                        // 	$header.removeClass('ls');
                        // }
                    } else if ($header.hasClass('affix')) {
                        $headerWrapper.removeClass('affix-top-wrapper affix-bottom-wrapper').addClass('affix-wrapper');
                        //cs to ls when affixed
                        // if($header.hasClass('cs')) {
                        // 	$header.addClass('ls');
                        // }
                    } else if ($header.hasClass('affix-bottom')) {
                        $headerWrapper.removeClass('affix-wrapper affix-top-wrapper').addClass('affix-bottom-wrapper');
                    } else {
                        $headerWrapper.removeClass('affix-wrapper affix-top-wrapper affix-bottom-wrapper');
                    }

                    //calling this functions disable menu items animation when going from affix to affix-top with centered logo inside
                    //in boxed layouts header is always fixed
                    if (boxed && !($header.css('position') === 'fixed')) {
                        menuHideExtraElements();
                        initMegaMenu(1);
                    }
                    if (headerSticked) {
                        initMegaMenu(1);
                    }

                });

                //if header has different height on afixed and affixed-top positions - correcting wrapper height
                $header.on('affixed-top.bs.affix', function() {
                    // $headerWrapper.css({height: $header.outerHeight()});
                });

                //fixing auto affix bug - toggle affix on click when page is at the top
                $header.on('affix.bs.affix', function() {
                    if (!$window.scrollTop()) return false;
                });

                $header.affix({
                    offset: {
                        top: headerOffset,
                        bottom: -10
                    }
                });
            } //headerStickedDisabled
        } //$header.length if check

        //aside affix
        initAffixSidebar();

        $body.scrollspy('refresh');

        //appear plugin is used to elements animation, counter, pieChart, bootstrap progressbar
        if ($().appear) {
            //animation to elements on scroll
            var $animate = $('.animate');
            $animate.appear();

            $animate.filter(':appeared').each(function(index) {
                initAnimateElement($(this), index);
            });

            $body.on('appear', '.animate', function(e, $affected) {
                $($affected).each(function(index) {
                    initAnimateElement($(this), index);
                });
            });

            //counters init on scroll
            if ($().countTo) {
                var $counter = $('.counter');
                $counter.appear();

                $counter.filter(':appeared').each(function() {
                    initCounter($(this));
                });
                $body.on('appear', '.counter', function(e, $affected) {
                    $($affected).each(function() {
                        initCounter($(this));
                    });
                });
            }

            //bootstrap animated progressbar
            if ($().progressbar) {
                var $progressbar = $('.progress .progress-bar');
                $progressbar.appear();

                $progressbar.filter(':appeared').each(function() {
                    initProgressbar($(this));
                });
                $body.on('appear', '.progress .progress-bar', function(e, $affected) {
                    $($affected).each(function() {
                        initProgressbar($(this));
                    });
                });
                //animate progress bar inside bootstrap tab
                $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                    initProgressbar($($(e.target).attr('href')).find('.progress .progress-bar'));
                });
                //animate progress bar inside bootstrap dropdown
                $('.dropdown').on('shown.bs.dropdown', function(e) {
                    initProgressbar($(this).find('.progress .progress-bar'));
                });
            }

            //circle progress bar
            if ($().easyPieChart) {
                var $chart = $('.chart');

                $chart.appear();

                $chart.filter(':appeared').each(function() {
                    initChart($(this));
                });
                $body.on('appear', '.chart', function(e, $affected) {
                    $($affected).each(function() {
                        initChart($(this));
                    });
                });

            }

        } //appear check

        //Flickr widget
        // use http://idgettr.com/ to find your ID
        if ($().jflickrfeed) {
            var $flickr = $("#flickr, .flickr_ul");
            if ($flickr.length) {
                if (!($flickr.hasClass('flickr_loaded'))) {
                    $flickr.jflickrfeed({
                        flickrbase: "http://api.flickr.com/services/feeds/",
                        limit: 4,
                        qstrings: {
                            id: "131791558@N04"
                        },
                        itemTemplate: '<a href="{{image_b}}" class="photoswipe-link"><li><img alt="{{title}}" src="{{image_m}}" /></li></a>'
                        //complete
                    }, function(data) {
                        initPhotoSwipe();
                    }).addClass('flickr_loaded');
                }
            }
        }

        // init Isotope
        $('.isotope-wrapper').each(function(index) {
            var initial_items = 6;
            var next_items = 4;
            var showMore = $('#show-more');
            var $container = $(this);
            var layoutMode = ($container.hasClass('masonry-layout')) ? 'masonry' : 'fitRows';
            var columnWidth = ($container.children('.col-md-3').length) ? '.col-md-3' : false;
            var $grid = $container.isotope({
                percentPosition: true,
                layoutMode: layoutMode,
                masonry: {
                    columnWidth: columnWidth
                }
            });

            var $filters = $container.attr('data-filters') ? $($container.attr('data-filters')) : $container.prev().find('.filters');
            // bind filter click
            if ($filters.length) {
                $filters.on('click', 'a', function(e) {
                    e.preventDefault();
                    var $thisA = $(this);
                    var filterValue = $thisA.attr('data-filter');
                    $container.isotope({
                        filter: filterValue
                    });
                    $thisA.siblings().removeClass('selected active');
                    $thisA.addClass('selected active');
                });

                //for works on select
                $filters.on('change', function(e) {
                    e.preventDefault();
                    var filterValue = $(this).val();
                    $container.isotope({
                        filter: filterValue
                    });
                });
            }
            // bind filter button click
            $filters.on('click', 'button', function() {
                var filterValue = $(this).attr('data-filter');
                // use filterFn if matches value
                $grid.isotope({
                    filter: filterValue
                });
                updateFilterCounts();
            });

            function updateFilterCounts() {
                // get filtered item elements
                var itemElems = $grid.isotope('getFilteredItemElements');

                var count_items = $(itemElems).length;
                // $('#show-more').length
                if (count_items > initial_items) {
                    showMore.show();
                } else {
                    showMore.hide();
                }
                if ($('.col-12').hasClass('visible_item')) {
                    $(this).removeClass('visible_item');
                }
                var index = 0;

                $(itemElems).each(function() {
                    if (index >= initial_items) {
                        $(this).addClass('visible_item');
                    }
                    index++;
                });
                $grid.isotope('layout');
            }
            // change is-checked class on buttons
            $('.filters').each(function(i, buttonGroup) {
                var $buttonGroup = $(buttonGroup);
                $buttonGroup.on('click', 'button', function() {
                    $buttonGroup.find('.is-checked').removeClass('is-checked');
                    $(this).addClass('is-checked');
                });
            });

            function showNextItems(pagination) {
                var items = $('.visible_item');
                var itemsMax = items.length;
                var itemsCount = 0;
                items.each(function() {
                    if (itemsCount < pagination) {
                        $(this).removeClass('visible_item');
                        itemsCount++;
                    }
                });
                if (itemsCount >= itemsMax) {
                    $('#show-more').hide();
                }
                $grid.isotope('layout');
            }
            // function that hides items when page is loaded
            function hideItems(pagination) {
                var itemsMax = $('.col-12').length;
                var itemsCount = 0;
                $('.col-12').each(function() {
                    if (itemsCount >= pagination && $('#show-more').length) {
                        $(this).addClass('visible_item');
                    }
                    itemsCount++;
                });
                if (itemsCount < itemsMax || initial_items >= itemsMax) {
                    $('#show-more').hide();
                }
                $grid.isotope('layout');
            }
            showMore.on('click', function(e) {
                e.preventDefault();
                showNextItems(next_items);
            });
            hideItems(initial_items);
        });

        //wrap select fields
        jQuery('select').each(function() {
            var s = jQuery(this);
            s.wrap('<div class="select_container"></div>');
        });

        //styles for select
        $('.select-styled').selectpicker();

        //live Chat button
        $('.start-live-chat').on('click', function(e) {
            e.preventDefault();
            $('#wp-live-chat-header').trigger('click');
        });



        //video button play in single video
        var $videoBtn = $('.button-play');
        $videoBtn.on('click', function() {
            document.querySelector('video').play();
            $('.single-video-wrap').addClass('video-play');
        });

        // add class to section with background video
        $('.modal-play').on('click', function() {
            $('.background-video').addClass('show-modal-video');
        });

        /////////
        //SHOP///
        /////////
        $('#toggle_shop_view').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('grid-view');
            $('#products').toggleClass('grid-view list-view');
        });

        //color filter
        $(".color-filters").find("a[data-background-color]").each(function() {
            $(this).css({
                "background-color": $(this).data("background-color")
            });
        });
        ////////////////
        // end of SHOP//
        ///////////////

        //Unyson or other messages modal
        var $messagesModal = $('#messages_modal');
        if ($messagesModal.find('ul').length) {
            $messagesModal.modal('show');
        }

        if (document.querySelector('.form-error, .fw-flash-message')) {
            var coordinate = $('.form-wrapper ').offset().top;
            $body.scrollTo(coordinate - 300, 0);
        }

        //page preloader
        $(".preloader_img, .preloader_css").fadeOut(800);
        setTimeout(function() {
            $(".preloader").fadeOut(800, function() {});
        }, 200);
    } //eof windowLoadInit

    $(function() {
        documentReadyInit();
    });

    $window.on('load', function() {
        windowLoadInit();
    }); //end of "window load" event

    $window.on('resize', function() {

        $body.scrollspy('refresh');

        //header processing
        menuHideExtraElements();
        initMegaMenu(1);
        var headerStickedDisabled = ($body.hasClass('header_disable_affix_xl') && $body.hasClass('header_disable_affix_xs')) ? true : false;
        if (!headerStickedDisabled) {
            var $header = $('.page_header').first();
            //checking document scrolling position
            if ($header.length && !$(document).scrollTop() && $header.first().data('bs.affix')) {
                $header.first().data('bs.affix').options.offset.top = $header.offset().top;
            }
            if (!$header.closest('.boxed').length) {
                var affixed = false;
                if ($header.hasClass('affix')) {
                    affixed = true;
                    //animation duration
                    $header.removeClass('affix');

                    setTimeout(function() {
                        //editing header wrapper height for smooth stick and unstick
                        $(".page_header_wrapper").css({
                            height: $header.first().outerHeight()
                        });
                        $header.addClass('affix');
                    }, 250);
                }

                if (!affixed) {
                    //editing header wrapper height for smooth stick and unstick
                    $(".page_header_wrapper").css({
                        height: $header.first().outerHeight()
                    });
                }
            }
        } //headerStickedDisabled
    });

    //end of IIFE function
})(jQuery);