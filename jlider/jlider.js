/*! 
 * Jlider - Slider plugin by Juskteez
 *
 * Contact me: vhuyphong@gmail.com
 *
 * version: 1.0
 */
(function($) {

    // HTML tag generator
    function tGen(tag,id,cLass,content,custCSS,specAttr) {

        // Create some default variables
        var Aid = '', AcLass = '', cCSS = '', sAttr = '';

        // First get the tag name, if there's no tag name so there will be nothing
        if (tag!=undefined&&tag!='') {
            if (id!=undefined&&id!='') {Aid=' id="'+id+'"';} // Check id availability and add it to the tag
            if (cLass!=undefined&&cLass!='') {AcLass=' class="'+cLass+'"';} // Check class availability and add it to the tag
            if (content==undefined) {content=''} // Check content availability and add it to the tag
            if (!custCSS!=undefined&&!custCSS!='') {custCSS=''} else {cCSS = ' style="'+custCSS+'"'} // Check css availability and add it to the tag
            if (!specAttr!=undefined&&!specAttr!='') {specAttr=''} else {sAttr = ' '+specAttr} // Check custom attributes availability and add it to the tag
            return '<' + tag + Aid + AcLass + cCSS + sAttr + '>' + content + '</' + tag + '>'; // Final tag generated
        } else {
            return ''
        }
    }

    // CSS animation generator for this plugin
    function aGen(name,property,aValue,bValue,css3,aExP,bExP,revert,reVal) {

        // Check availability of basic value
        if (name!=undefined&&name!=''&&property!=undefined&&property!=''&&aValue!=undefined&&aValue!=''&&bValue!=undefined&&bValue!='') {
                    
            // Some default variables
            var pfx = ["-webkit-", "-moz-", "-ms-", "-o-", ""], i, animations = '.jlider li[data-jLFxs="' + name + '"].jactive {\n', xpfx = '';

            if (aExP==undefined) {aExP=''} // Replace undefined extend properties A
            if (bExP==undefined) {bExP=''} // Replace undefined extend properties B

            for (i = 0; i < pfx.length; i++) {
                // Declare animations
                animations += pfx[i] + 'animation: jlider_' + name + ' 0.6s ease;\n';
            }
            animations += '}\n\n'; // Close the declare

            for (i = 0; i < pfx.length; i++) {

                if (css3) {xpfx=pfx[i]} // Determine CSS3 property
                animations += '@' + pfx[i] + 'keyframes jlider_' + name + ' {'; // Open keyframes
                animations += '0% {' + xpfx + property + ':' + aValue + ';' + aExP + '}'; // Start animation
                animations += ' 100% {' + xpfx + property + ':' + bValue + ';' + bExP + '}'; // End animation
                animations += '}\n'; // Close keyframes

            }

            // Create a revert animation if it's needed
            if (revert) {

                animations += '\n.jlider li[data-jLFxs="' + name + '"].justDeactive {\n'; // Open the declare

                for (i = 0; i < pfx.length; i++) {
                    // Declare reverted animations
                    animations += pfx[i] + 'animation: jlider_' + name + '_r 0.6s ease;\n';
                }
                animations += '}\n\n'; // Close the declare
                for (i = 0; i < pfx.length; i++) {

                    if (css3) {xpfx=pfx[i]} // Determine CSS3 property
                    if (reVal) {cValue='-'+aValue} else {cValue = aValue}  // Determine revert value
                    animations += '@' + pfx[i] + 'keyframes jlider_' + name + '_r {'; // Open keyframes
                    animations += '0% {' + xpfx + property + ':' + bValue + ';' + bExP + '}'; // Start animation
                    animations += ' 100% {' + xpfx + property + ':' + cValue + ';' + aExP + '}'; // End animation
                    animations += '}\n'; // Close keyframes

                }
            }
            return animations; // Final animation CSS
        }
    }

    // Animations list
    var jLanis = aGen('fade','opacity','0','1',false)+
                 aGen('slide','left','100%','0%',false,'opacity: 0','opacity: 1',true,true)+
                 aGen('scaleIn','transform','scale(0)','scale(1)',true,'opacity: 0','opacity: 1',true)+
                 aGen('scaleOut','transform','scale(1.4)','scale(1)',true,'opacity: 0','opacity: 1',true)+
                 aGen('flipPersL','transform','perspective(400px) rotateY(-57deg) scale(0.4)','perspective(400px) rotateY(0deg) scale(1)',true,'opacity: 0','opacity: 1',true)+
                 aGen('flipPersR','transform','perspective(400px) rotateY(57deg) scale(0.4)','perspective(400px) rotateY(0deg) scale(1)',true,'opacity: 0','opacity: 1',true)+
                 aGen('flipPersU','transform','perspective(400px) rotateX(57deg) scale(0.4)','perspective(400px) rotateX(0deg) scale(1)',true,'opacity: 0','opacity: 1',true)+
                 aGen('flipPersD','transform','perspective(400px) rotateX(-57deg) scale(0.4)','perspective(400px) rotateX(0deg) scale(1)',true,'opacity: 0','opacity: 1',true)+
                 aGen('rotateL','transform','rotate(180deg) scale(0.4)','rotate(0deg) scale(1)',true,'opacity: 0','opacity: 1',true)+
                 aGen('rotateR','transform','rotate(-180deg) scale(0.4)','rotate(0deg) scale(1)',true,'opacity: 0','opacity: 1',true);

    // Create a style tag in head contain animations created in the list
    $('head').append(tGen('style','jLstyle','',jLanis));


    $.fn.jliderSlide = function(your_val) {

        // Đặt các tham số mặc định cho plugin
        var default_val = {
            slideEffect    : "fade",         // Slide effects [fade | slide | scaleIn | scaleOut | random]
            viewEffect     : "no",           // View effects [no | scaleIn | scaleOut | TransL | TransR | RotL | RotR | random]
            visiTime       : 4000,           // Time between a slide
            visiProgress   : false,          // Show progress bar
            autoPlay       : true,           // Auto play slider
            width          : 600,            // Slider width
            height         : 380,            // Slider height
            photoCaption   : false,          // Text caption for slide
            noCopy         : false,          // No copy photo
            hideControl    : "visible",      // Control buttons visible [visible | hover | hide]
            fullScreen     : true,           // Allow fullscreen slide
            navType        : "dot",          // Navigation type [line | dot | number | preview]
            hoverPause     : false,          // Pause slide when hover slider
            Loaded         : function (curSlide) {}, // Custom functions after all photos loaded
            pressPlay      : function (curSlide) {}, // Custom functions after press Play
            pressPause     : function (curSlide) {}, // Custom functions after press Pause
            pressNext      : function (curSlide) {}, // Custom functions after press Next
            pressPrev      : function (curSlide) {}, // Custom functions after press Prev
            beforeSlide    : function (curSlide) {}, // Custom functions before a slide
            afterSlide     : function (curSlide) {}, // Custom functions after a slide
            goFullscreen   : function (curSlide) {}, // Custom functions after enter fullscreen
            outFullscreen  : function (curSlide) {}, // Custom functions after exit fullscreen


            // Unchanged properties
            fadeTime     : 600               // Slide duration

        };

        // $.extend() sync custom properties set by user and default properties
        var ext_val = $.extend(default_val, your_val);


        return this.each(function (sid) {

            // This return visible in case there are more than 1 jlider in a page
            
            // Add ID for Slider (future use)
            var sID = "",
                possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", // Allowed characters
                autoClass, sIDz; // Basic variables

            // A loop doing a random math
            for( var i=0; i < 5; i++ ) {
                sID += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            // Add style for ID
            sIDz = 'jL_'+sID;

            // This slider (mean ul.jlider)
            var $obj = $(this);

            // Wrapp this slider into a parent tag, called frame
            $obj.wrap('<div class="jlider_frame '+ext_val.hideControl+' jlider_' + ext_val.navType + '" data-jLsID="' + sIDz + '" style="width:'+ext_val.width+'px;height:'+ext_val.height+'px;"></div>');
            
            // li tag by slider, same as $obj.find("li")
            var $item = $("li", $obj), $wrapped = $obj.parent();


            // Add view effects (I will add more in future version) & size for slider
            $obj.addClass(ext_val.viewEffect).css({'width':ext_val.width,'height':ext_val.height});


            // Count slide, I set this for future use
            var last_img = $item.length, img_item = last_img;

            // Create navigation (paging) & control button for slider
            $obj.after(tGen('div','','jlider_control_num') + tGen('button','','jlider_control prev') + tGen('button','','jlider_control next'));

            var autoClass;

            // Check if the autoplay property is true
            if (ext_val.autoPlay) {autoClass = 'play';} else {autoClass = 'paused';}

            // Create play/pause button, fullscreen button, progress bar and loading screen
            $wrapped.prepend(tGen('button','','pause ' + autoClass) + tGen('button','','jlider_fullScreen') + tGen('div','','jlider_progress jlider_pgBar')).append(tGen('div','','jlider_loading',tGen('div','','jLoad_Per','0%')));

            // After structure are created, create variables for quick use
            var $play         = $obj.siblings('.pause'), // Pause/play button
                $fscn         = $obj.siblings('.jlider_fullScreen'), // Fullcsreen button
                $loading      = $obj.siblings('.jlider_loading'), // Loading screen
                $loadPer      = $loading.children('.jLoad_Per'), // Loading percent
                $prev         = $obj.siblings('.prev'), // Prev button
                $next         = $obj.siblings('.next'), // Next button
                $progress     = $obj.siblings('.jlider_progress'), // Progress bar
                $navbutton    = $obj.next('.jlider_control_num'); // Pagination bar

            // Slide effects array
            var sEffect, sEffects = ['fade', 'slide', 'scaleIn', 'scaleOut', 'flipPersL', 'flipPersR', 'flipPersU', 'flipPersD', 'rotateL', 'rotateR'];
            // Default counter value
            var count = 0;
            // Create quick variables
            var theCaption, theFotoU, fotoW, fotoH;

            // Create paging button for each slide
            $item.each(function(index, ele) {

                var navTypeContent = '', // Content of each button
                    navButttonSize = '', // (Null) button size (for line type, line button will resize when you toggle fullscreen mode)
                    ntype = ext_val.navType, // Quick var for button type
                    navButttonMath = 'style="width:' + Math.floor(ext_val.width / last_img) + 'px"'; // Width for each button (line type)
                if (ntype == "preview") {
                    // Fureture use...
                } if (ntype == "number") {
                    // Add number content for each button with sorted (number) button type
                    navTypeContent = (index + 1);
                } if (ntype == "line" || ntype == "preview") {
                    navButttonSize = navButttonMath;
                }

                // Create button with properties above
                $navbutton.append('<button data-index="' + index + '" ' + navButttonSize + '>' + navTypeContent + '</button>');
            });

            // Create a variable for paging buttons
            var $number = $("button", $navbutton);

            function buffPer(element,width,height,percents) {

                // Loaded percent
                loadedPer = Math.round((percents+1)/img_item*100);

                // Show loaded percent
                if (percents < 100) {
                    $loadPer.text(loadedPer + '%');
                } else {
                    $loadPer.text('100%');
                }

                // Determine vertical or horizontial photo
                if (width > height) {
                    element.addClass('joriz');
                } else {
                    element.addClass('jerti');
                }

                // After all photo loaded
                if (count == img_item) {

                    // Play slideshow
                    slideshow();

                    // Hide loading screen
                    $loading.addClass('hide_jLoad').css('z-index',-1);

                    // Run progress
                    if (ext_val.autoPlay) {runProgress(true);}

                    // Active first slide
                    $item.first().addClass('jactive');

                    // Active first paging button
                    $number.first().addClass('jactive');

                    // Callback
                    ext_val.Loaded.call($wrapped, $("li.jactive", $obj));
                }
            }

            // Single slide functions
            $item.each(function(index, ele) {
                
                var $this = $(this);

                // Single Photo Slide
                if ($(this).children().length == 1 && $(this).children('img').length == 1) {

                    var $img = $("img", $this), // Get this item photo
                        theCaption = $img.attr('alt'), // Get photo caption
                        theFotoU = $img.attr('src'), // Get photo URL
                        imWidth = $img.width(), //Get photo width
                        imHeight = $img.height(); // Get photo height

                    if ($img[0].complete) {
                        buffPer($this,imWidth,imHeight,count++);
                    } else {
                        $img.load(function() {
                            buffPer($this,imWidth,imHeight,count++);
                        }).error(function() {
                            buffPer($this,imWidth,imHeight,count++);
                        });
                    }

                    // Create fake photo (this fake photo created for effects)
                    $this.addClass('single_photo').prepend('<div class="fake_photo" style="background-image: url(' + theFotoU + ');"></div>');

                    // Check and create photo caption
                    if (ext_val.photoCaption && theCaption != undefined && theCaption != '') {
                        $this.append('<div class="jLsCaption">' + theCaption + '</div>');
                    }
                }

                // Add ID for single slide
                $this.attr('data-jLiID',sIDz + '_' + index);

                // Add effect attribute for single slide
                if (ext_val.slideEffect != "random") {
                    // Single effect
                    $this.attr("data-jLFxs", ext_val.slideEffect);
                } else {
                    // Random effects
                    sEffect = sEffects[Math.floor(Math.random() * sEffects.length)];
                    $this.attr("data-jLFxs", sEffect);
                }
            });

            // Resize function
            function jlider_resize(newSize) {
                if (ext_val.navType == 'line') {
                    $number.css('width', Math.floor(newSize / last_img));
                }
            }
            // Run function when resize
            $(window).resize(function() {
                jlider_resize($obj.width());
            });

            // Function for changing slide
            var currIndex = function() {
                return parseInt($(".jactive", $navbutton).data("index"), 10);
            };

            // Change slide
            function mover(actions) {

                // Callback
                ext_val.beforeSlide.call($wrapped, $("li.jactive", $obj));

                var nextIndex; // Next slide
                var currentIndex = currIndex();

                // Current slide
                if (actions) {
                    nextIndex = currentIndex + 1;
                    if (nextIndex == last_img) {
                        nextIndex = 0;
                    }
                } else {
                    nextIndex = currentIndex - 1;
                    if (nextIndex == -1) {
                        nextIndex = last_img - 1;
                    }
                }

                // Progress
                runProgress(true);

                // Start changing
                translate(currentIndex, nextIndex);

                // Callback
                ext_val.afterSlide.call($wrapped, $("li.jactive", $obj));

            }

            // Changing slide
            function translate(curr, next) {

                var stEffect = "";

                if (ext_val.slideEffect == "random") {
                    stEffect = sEffects[Math.floor(Math.random() * sEffects.length)];
                } else {
                    stEffect = ext_val.slideEffect;
                }

                $(".jactive", $obj).addClass("justDeactive").attr("data-jLFxs", stEffect).add($number.eq(curr)).removeClass("jactive");
                setTimeout(function () {$(".justDeactive", $obj).removeClass('justDeactive');}, (ext_val.fadeTime));
                $item.eq(next).add($number.eq(next)).addClass('jactive');
            }

            // Interval variable
            var jlider;

            // Play check variable
            var hitPlay;
            function slideshow() {
                // Check autoplay/play status
                if (ext_val.autoPlay || hitPlay == "nowPlay") {
                    jlider = setInterval(function() {
                        // Next slide
                        mover(true)
                    }, ext_val.visiTime);
                }
            }


            function runProgress(actions) {
                // Stop but finish current progress
                $progress.stop(true,true);

                // When progress start
                if (actions&&ext_val.visiProgress) {
                    // Start progress animation
                    $progress.animate({width: '100%'}, ext_val.visiTime, 'linear', function() {
                        // Reset animation at end
                        $progress.css('width',0);
                    });
                }
            }

            // Functions for pause/play
            function pauser(actions) {
                if (actions) {
                    // true value (Play)
                    $play.addClass("play"); // Add class play to determine that slide is play
                    hitPlay = "nowPlay";

                    // Stop current progress to run new progress
                    runProgress(true);

                    slideshow(); // Play slider

                } else {
                    // false valure (Pause)
                    $play.removeClass("play"); // Remove class play to determine that slide is not going to play
                    hitPlay = "nowPause";
                    clearInterval(jlider); // Pause slider

                    // Stop current progress
                    runProgress();

                }
            }

            // Pause slide when hover
            if (ext_val.hoverPause) {
                $wrapped.hover(function() {
                    // If slide is playing
                    if ($play.hasClass('play')) {
                        pauser(); // pause
                        $play.addClass("pauseByhover"); // Determine that slide paused by hovering
                    }
                }, function() {

                    // When mouse out
                    if(!$play.hasClass('play')) {

                        // If the pause/play button is not play but have the paused class (Paused by click) then...
                        if ($play.hasClass('paused')) {
                            pauser(); // Men, you stand right there
                        } else {
                            // But if slide paused by hover (cause it not having the paused class)
                            pauser(true); // Okay then play
                            $play.addClass('play'); // Add class play to determine that it's gonna play
                        }
                    }
                });
            }

            // Change slide type functions
            function changeSlide(type,element) {
                // Choose the action
                if (type == 'next') {
                    mover(true);
                } else if (type == 'prev') {
                    mover();
                } else if (type == 'page' && element != undefined && element != '') {
                    translate(currIndex(), parseInt(element.data("index"), 10));
                }
            }

            // Sliding functions
            function slideAction(type,element) {

                // If the hoverPause is turn on...
                if (ext_val.hoverPause) {

                    // Move
                    changeSlide(type,element);

                    // But also pause the slide
                    pauser();
                } else {

                    // Pause slide first
                    pauser();

                    // Then move
                    changeSlide(type,element);

                    // If the slide is not paused
                    if (!$play.hasClass('paused')) {

                        // Then play it
                        pauser(true);
                    } else {
                        // If not, it won't play. and also stop the progress
                        runProgress();
                    }
                }
            }

            // Functions for next button
            $next.click(function() {

                // Choose action to slide
                slideAction('next');

                // Callback
                ext_val.pressNext.call($wrapped, $("li.jactive", $obj));
            });

            // Functions for previous button
            $prev.click(function() {
                
                // Choose action to slide
                slideAction('prev');

                // Callback
                ext_val.pressPrev.call($wrapped, $("li.jactive", $obj));
            });

            // Function for paging button
            $number.click(function() {
                
                // Choose action to slide
                slideAction('page',$(this));
            });

            // When click on the pause/play button
            $play.click(function(event) {

                // If the button is playing (mean it never paused before - not having class paused) then...
                if (!$play.hasClass("paused")) {
                    pauser(); // Pause slider
                    $(this).addClass("paused"); // Add class paused to determine that the slider has played for the first time
                    if ($(this).hasClass('pauseByhover')) {
                        $(this).removeClass('pauseByhover');
                    }

                    // Callback
                    ext_val.pressPlay.call($wrapped, $("li.jactive", $obj));
                } else {

                    // If the button is not playing (mean it was paused before - having the class paused) then...
                    pauser(true); // Play slider
                    $(this).removeClass("paused"); // The remove paused class to determine that it's not gonna pause (^^^)

                    // Callback
                    ext_val.pressPause.call($wrapped, $("li.jactive", $obj));
                }
            });


            // Fullscreen Callback
            function fsCallback(type) {
                if (type) {
                    // Callback enter fullscreen
                    ext_val.goFullscreen.call($wrapped, $("li.jactive", $obj));
                } else {
                    // Callback exit fullscreen
                    ext_val.outFullscreen.call($wrapped, $("li.jactive", $obj));
                }
            }

            // Require/Exit fullscreen
            function fScreen(type,target) {
                if (type == 'enter' && target != undefined && target != '') {
                    if (target.requestFullscreen) {
                        target.requestFullscreen(); // Require fullscreen on other browser
                    } else if (target.msRequestFullscreen) {
                        target.msRequestFullscreen(); // Require fullscreen on IE
                    } else if (target.mozRequestFullScreen) {
                        target.mozRequestFullScreen(); // Require fullscreen on Firefox
                    } else if (target.webkitRequestFullScreen) {
                        target.webkitRequestFullScreen(); // Require fullscreen on Chrome
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen(); // Exit fullscreen on other browser
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen(); // Exit fullscreen on IE
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen(); // // Exit fullscreen on Firefox
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen(); // // Exit fullscreen on Chrome
                    }
                }
            }

            // When pressed the fullscreen button
            $fscn.click(function() {

                // Browser does not support fullscreen API
                if (document.msFullscreenElement === undefined && document.fullscreenElement === undefined && document.mozFullScreenElement === undefined && document.webkitFullscreenElement === undefined) {
                    $wrapped.toggleClass(function () {
                        if ($wrapped.hasClass("jliderFull")) {
                            fsCallback(true);
                        } else {
                            fsCallback();
                        }
                        return "jliderFull";
                    });
                } else {
                    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                        fScreen('enter', $wrapped[0]); // Require fullscreen

                        // If slide paused by hover
                        if (!$play.hasClass('play') && !$play.hasClass('paused')) {
                            pauser(true); // Play sldier
                        }

                        // Callback
                        fsCallback(true);
                    } else {
                        // If fullscreen is on...
                        fScreen(); // Exit fullscreen

                        // Callback
                        fsCallback();
                    }
                }
            });


            // Stop people from save photo
            if (ext_val.noCopy) {
                $obj.addClass('noCopy');
            }

        });
    };
})(jQuery);