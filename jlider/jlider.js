/*! 
 * Jlider - Slider plugin by Juskteez
 *
 * Contact me: vhuyphong@gmail.com
 *
 * version: 1.0.1
 */
(function($) {

    // Unchanged variable
    var fadeTime = 600; // Slide duration

    // HTML tag generator
    function tGen(tag, id, cLass, content, custCSS, specAttr) {

        // Create some default variables
        var Aid = '',
            AcLass = '',
            cCSS = '',
            sAttr = '';

        // First get the tag name, if there's no tag name so there will be nothing
        if (tag != undefined && tag != '') {
            if (id != undefined && id != '') {
                Aid = ' id="' + id + '"';
            } // Check id availability and add it to the tag
            if (cLass != undefined && cLass != '') {
                AcLass = ' class="' + cLass + '"';
            } // Check class availability and add it to the tag
            if (content == undefined) {
                content = ''
            } // Check content availability and add it to the tag
            if (!custCSS != undefined && !custCSS != '') {
                custCSS = ''
            } else {
                cCSS = ' style="' + custCSS + '"'
            } // Check css availability and add it to the tag
            if (!specAttr != undefined && !specAttr != '') {
                specAttr = ''
            } else {
                sAttr = ' ' + specAttr
            } // Check custom attributes availability and add it to the tag
            return '<' + tag + Aid + AcLass + cCSS + sAttr + '>' + content + '</' + tag + '>'; // Final tag generated
        } else {
            return ''
        }
    }

    // CSS animation generator for this plugin
    function aGen(name, property, aValue, bValue, css3, aExP, bExP, revert, reVal) {

        // Check availability of basic value
        if (name != undefined && name != '' && property != undefined && property != '' && aValue != undefined && aValue != '' && bValue != undefined && bValue != '') {

            // Some default variables
            var pfx = ["-webkit-", "-moz-", "-ms-", "-o-", ""],
                i, animations = '/* ' + name + ' effect */\n',
                xpfx = '';

            if (aExP == undefined) {
                aExP = ''
            } // Replace undefined extend properties A
            if (bExP == undefined) {
                bExP = ''
            } // Replace undefined extend properties B

            animations += '.jlider li[data-jLFxs="' + name + '"].jactive {\n';

            for (i = 0; i < pfx.length; i++) {
                // Declare animations
                animations += pfx[i] + 'animation: jlider_' + name + ' ' + fadeTime + 'ms ease;\n';
            }
            animations += '}\n\n'; // Close the declare

            for (i = 0; i < pfx.length; i++) {

                if (css3) {
                    xpfx = pfx[i]
                } // Determine CSS3 property
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
                    animations += pfx[i] + 'animation: jlider_' + name + '_r ' + fadeTime + 'ms ease;\n';
                }
                animations += '}\n\n'; // Close the declare
                for (i = 0; i < pfx.length; i++) {

                    if (css3) {
                        xpfx = pfx[i]
                    } // Determine CSS3 property
                    if (reVal) {
                        cValue = '-' + aValue
                    } else {
                        cValue = aValue
                    } // Determine revert value
                    animations += '@' + pfx[i] + 'keyframes jlider_' + name + '_r {'; // Open keyframes
                    animations += '0% {' + xpfx + property + ':' + bValue + ';' + bExP + '}'; // Start animation
                    animations += ' 100% {' + xpfx + property + ':' + cValue + ';' + aExP + '}'; // End animation
                    animations += '}\n'; // Close keyframes

                }
            }
            return animations + '\n'; // Final animation CSS
        }
    }

    // Animations list
    var jLanis = aGen('fade', 'opacity', '0', '1', false) +
        aGen('slide', 'left', '100%', '0%', false, 'opacity: 0', 'opacity: 1', true, true) +
        aGen('scaleIn', 'transform', 'scale(0)', 'scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
        aGen('scaleOut', 'transform', 'scale(1.4)', 'scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
        aGen('flipPersL', 'transform', 'perspective(400px) rotateY(-57deg) scale(0.4)', 'perspective(400px) rotateY(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
        aGen('flipPersR', 'transform', 'perspective(400px) rotateY(57deg) scale(0.4)', 'perspective(400px) rotateY(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
        aGen('flipPersU', 'transform', 'perspective(400px) rotateX(57deg) scale(0.4)', 'perspective(400px) rotateX(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
        aGen('flipPersD', 'transform', 'perspective(400px) rotateX(-57deg) scale(0.4)', 'perspective(400px) rotateX(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
        aGen('rotateL', 'transform', 'rotate(180deg) scale(0.4)', 'rotate(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true) +
        aGen('rotateR', 'transform', 'rotate(-180deg) scale(0.4)', 'rotate(0deg) scale(1)', true, 'opacity: 0', 'opacity: 1', true);

    // Create a style tag in head contain animations created in the list
    $('head').append(tGen('style', 'jLstyle', '', jLanis));


    $.fn.jliderSlide = function(your_val) {

        // Đặt các tham số mặc định cho plugin
        var default_val = {
            slideEffect: "fade", // Slide effects [fade | slide | scaleIn | scaleOut | random]
            viewEffect: "no", // View effects [no | scaleIn | scaleOut | TransL | TransR | RotL | RotR | random]
            visiTime: 4000, // Time between a slide
            visiProgress: false, // Show progress bar
            autoPlay: true, // Auto play slider
            width: "600px", // Slider width
            height: "380px", // Slide height
            ratio: "no", // Frame ratio [no | X:Y]
            responsive: false, // Responsive display
            photoCaption: false, // Text caption for slide
            noCopy: false, // No copy photo
            hideControl: "visible", // Control buttons visible [visible | hover | hide]
            dirType: "arrow", // Direct buttons types [arrow | text | preview]
            fullScreen: true, // Allow fullscreen slide
            navType: "dot", // Navigation types [line | dot | number | preview]
            hoverPause: false, // Pause slide when hover slider
            Loaded: function(curSlide) {}, // Custom functions after all photos loaded
            pressPlay: function(curSlide) {}, // Custom functions after press Play
            pressPause: function(curSlide) {}, // Custom functions after press Pause
            pressNext: function(curSlide) {}, // Custom functions after press Next
            pressPrev: function(curSlide) {}, // Custom functions after press Prev
            beforeSlide: function(curSlide) {}, // Custom functions before a slide
            afterSlide: function(curSlide) {}, // Custom functions after a slide
            goFullscreen: function(curSlide) {}, // Custom functions after enter fullscreen
            outFullscreen: function(curSlide) {}, // Custom functions after exit fullscreen


        };

        // $.extend() sync custom properties set by user and default properties
        var ext_val = $.extend(default_val, your_val);

        return this.each(function(sid) {

            // This return visible in case there are more than 1 jlider in a page

            // Add ID for Slider (future use)
            var sID = "",
                possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", // Allowed characters
                autoClass, sIDz; // Basic variables

            // A loop doing a random math
            for (var i = 0; i < 5; i++) {
                sID += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            // Add style for ID
            sIDz = 'jL_' + sID;

            // This slider (mean ul.jlider)
            var $obj = $(this),
                eWidth = ext_val.width,
                eHeight = ext_val.height,
                directType;

            // Full height size (Full-screen slider)
            if (eHeight == '100%') {

                // Set the set up height
                eHeight = $(window).height() + 'px';
            }

            if (ext_val.responsive) {
                frameSize = 'width:100%;max-width:' + eWidth + ';height:' + eHeight + ';';
            } else {
                frameSize = 'width:' + eWidth + ';height:' + eHeight + ';';
            }

            // Wrapp this slider into a parent tag, called frame
            $obj.wrap('<div class="jlider_frame ' + ext_val.hideControl + ' jlider_' + ext_val.navType + ' jlider_' + ext_val.dirType + '" data-jLsID="' + sIDz + '" style="' + frameSize + '"></div>');

            // li tag by slider, same as $obj.find("li")
            var $item = $("li", $obj),
                $wrapped = $obj.parent();

            // Define slide type
            $item.each(function(index, ele) {
                var $this = $(this),
                    $thisChild = $this.children();
                if ($this.children('img').length == 1 && $thisChild.length == 1) {
                    $this.addClass('jLi_photoSlide');
                } else if ($this.children('video').length == 1 && $thisChild.length == 1) {
                    $this.addClass('jLi_videoSlide').children('video').attr('data-jliframeid',sIDz).attr('width','100%').attr('height','100%');
                }
            });

            // quick slide type variable
            var $vid_item = $("li.jLi_videoSlide", $obj),
                $fto_item = $("li.jLi_photoSlide", $obj);

            // Get fixed default frame size to get ratio
            var dWidth, dHeight, sDratio = ext_val.ratio;

            // Check if ratio is available
            if (sDratio != 'no' && sDratio != '' && sDratio.indexOf(':') > -1) {

                var sDratioR = sDratio.match(/:([^]*)/)[0], // Get replace character
                    sDratioW = sDratio.replace(sDratioR, ''), // Get horizontial ratio
                    sDratioH = sDratio.match(/:([^]*)/)[1], // Get vertical ratio
                    sDratioF = sDratioW / sDratioH, // Get final set up ratio
                    ratioH = $wrapped.width() / sDratioF, // Get frame height by ratio
                    eHeight = ratioH + 'px'; // Get new set up height by ratio

                // Set new height for the frame
                $wrapped.css({
                    'height': ratioH
                });
            }

            // If width and height value is pixel
            if (eWidth.indexOf('px') > -1 && eHeight.indexOf('px') > -1) {

                // Set default size by set up size
                var dWidth = eWidth.replace('px', ''),
                    dHeight = eHeight.replace('px', '');
            } else {

                // Set default size by the display size
                var dWidth = $wrapped.width(),
                    dHeight = $wrapped.height();
            }

            // Get the origin ratio
            var dRatio = dWidth / dHeight,
                dMWidth = $wrapped.width(),
                dMHeight = Math.floor(dMWidth / dRatio),
                eNWidth, eNHeight;

            if (ext_val.responsive && eWidth.indexOf('px') > -1 && eHeight.indexOf('px') > -1) {
                eNWidth = dMWidth;
                eNHeight = dMHeight;
                // Set default resized size
                $wrapped.css({
                    'height': eNHeight
                });
            } else {
                // Set resized size as default size
                eNWidth = eWidth;
                eNHeight = eHeight;
            }

            // Add view effects (I will add more in future version) & size for slider
            $obj.addClass(ext_val.viewEffect).css({
                'width': eNWidth,
                'height': eNHeight
            });

            // Count slide, I set this for future use
            var last_img = $item.length,
                img_item = $fto_item.length,
                htm5vid_item = $item.length,
                dirContent = '';

            // Create a blank preview for preview control type
            if (ext_val.dirType == 'preview'){
                dirContent = tGen('span', '', 'jLi_control_pv') + tGen('span', '', 'jLi_control_pv jLi_c_pr');
            }

            // Create navigation (paging) & control button for slider
            $obj.after(tGen('div', '', 'jlider_control_num') + tGen('button', '', 'jlider_control prev', dirContent) + tGen('button', '', 'jlider_control next', dirContent));

            var autoClass;

            // Check if the autoplay property is true
            if (ext_val.autoPlay) {
                autoClass = 'play';
            } else {
                autoClass = 'paused';
            }

            // Create play/pause button, fullscreen button, progress bar and loading screen
            $wrapped.prepend(tGen('button', '', 'pause ' + autoClass) + tGen('button', '', 'jlider_fullScreen') + tGen('div', '', 'jlider_progress jlider_pgBar')).append(tGen('div', '', 'jlider_loading', tGen('div', '', 'jLoad_Per', '0%')));

            // After structure are created, create variables for quick use
            var $play = $obj.siblings('.pause'), // Pause/play button
                $fscn = $obj.siblings('.jlider_fullScreen'), // Fullcsreen button
                $loading = $obj.siblings('.jlider_loading'), // Loading screen
                $loadPer = $loading.children('.jLoad_Per'), // Loading percent
                $prev = $obj.siblings('.prev'), // Prev button
                $next = $obj.siblings('.next'), // Next button
                $progress = $obj.siblings('.jlider_progress'), // Progress bar
                $navbutton = $obj.next('.jlider_control_num'); // Pagination bar

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
                    jLwidth = $wrapped.width(),
                    navButttonMath = 'style="width:' + Math.floor(jLwidth / last_img) + 'px"'; // Width for each button (line type)

                if (ntype == "preview") {
                    // Fureture use...
                }
                if (ntype == "number") {
                    // Add number content for each button with sorted (number) button type
                    navTypeContent = (index + 1);
                }
                if (ntype == "line" || ntype == "preview") {
                    navButttonSize = navButttonMath;
                }

                // Create button with properties above
                $navbutton.append('<button data-index="' + index + '" ' + navButttonSize + '>' + navTypeContent + '</button>');
                if (ext_val.hideControl == 'hover' && index == (last_img-1)) {
                    $navbutton.css('bottom',-$navbutton.height());
                }
            });

            // Create a variable for paging buttons
            var $number = $("button", $navbutton);

            function buffPer(element, width, height, percents) {

                // Loaded percent
                loadedPer = Math.round((percents + 1) / img_item * 100);

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
                    $loading.addClass('hide_jLoad').css('z-index', -1);

                    // Run progress
                    if (ext_val.autoPlay) {
                        runProgress(true);
                    }

                    // Active first slide
                    $item.first().addClass('jactive');

                    // Get thumbnail for the next slide
                    if ($item.first().next().children('[poster]').size() > 0 && $item.first().next().children('[poster]').attr('poster') != '') {
                        var nextThumb = $item.first().next().children('[poster]').attr('poster');
                        $next.children('.jLi_control_pv:first-child').css('background-image','url(' + nextThumb + ')');
                    } else {
                        $next.children('.jLi_control_pv:first-child').css('background-image','url(jlider/no_thumb.svg)');
                    }

                    // Get thumbnail for the previous slide
                    if ($item.last().children('[poster]').size() > 0 && $item.last().children('[poster]').attr('poster') != '') {
                        var prevThumb = $item.last().children('[poster]').attr('poster');
                        $prev.children('.jLi_control_pv:first-child').css('background-image','url(' + prevThumb + ')');
                    } else {
                        $prev.children('.jLi_control_pv:first-child').css('background-image','url(jlider/no_thumb.svg)');
                    }

                    // Active first paging button
                    $number.first().addClass('jactive');

                    // Callback
                    ext_val.Loaded.call($wrapped, $("li.jactive", $obj));
                }
            }

            // Single slide functions
            $item.each(function(index, ele) {

                var $this = $(this), captionSpace = ''; // Default caption spacing;

                if (ext_val.hideControl == 'visible' ) {captionSpace = 'bottom:' + $navbutton.height() + 'px';}

                // Single Photo Slide
                if ($this.hasClass('jLi_photoSlide')) {

                    var $img = $("img", $this), // Get this item photo
                        theCaption = $img.attr('alt'), // Get photo caption
                        theFotoU = $img.attr('src'), // Get photo URL
                        theLink = $img.attr('data-href'), // Get photo link
                        imWidth = $img.width(), //Get photo width
                        imHeight = $img.height(); // Get photo height

                    if ($img[0].complete) {
                        buffPer($this, imWidth, imHeight, count++);
                    } else {
                        $img.load(function() {
                            buffPer($this, imWidth, imHeight, count++);
                        }).error(function() {
                            buffPer($this, imWidth, imHeight, count++);
                        });
                    }

                    // Create fake photo (this fake photo created for effects)
                    $this.addClass('single_photo').prepend('<div class="fake_photo" style="background-image: url(' + theFotoU + ');"></div>');

                    // Check and create photo caption
                    if (ext_val.photoCaption && theCaption != undefined && theCaption != '') {

                        // Set caption space with visible control

                        $this.append('<div class="jLsCaption" style="' + captionSpace + '">' + theCaption + '</div>');
                    }

                    // Check and create photo link
                    if (theLink != undefined && theLink != '') {
                        $this.append('<a href="' + theLink + '" class="fake_link"></a>');
                    }
                } else if ($this.hasClass('jLi_videoSlide')) { // HTML5 Video Slide

                    // Add class for video tag
                    $this.children('video').addClass('jLi_html5Video');

                    $this.append('<div class="jLi_h5V_controller" data-controllderid="'+sIDz+'"><div class="jLi_h5V_triggers"><button class="jLi_h5V_trigger jLi_h5V_pausing" title="Play"></button><button class="jLi_h5V_mute jLi_h5V_unmuted"></button></div><div class="jLi_h5V_seeker" style="' + captionSpace + '"><span class="jLi_h5V_progress" data-jLiTime="0:00"></span></div></div>');

                }

                // Add ID for single slide
                $this.attr('data-jLiID', sIDz + '_' + index);

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

            // Paging button resize function
            function jlider_resize(newSize) {
                if (ext_val.navType == 'line') {
                    $number.css('width', Math.floor(newSize / last_img));
                }
            }

            // Slider resize function
            function jlider_responsive() {

                // Check responsive status
                if (ext_val.responsive) {

                    // Get new frame size
                    var nWidth = $wrapped.width(),
                        nHeight = Math.floor(nWidth / dRatio);

                    // The responsive with auto ratio resize is just for pixel value
                    if (eWidth.indexOf('px') > -1 && eHeight.indexOf('px') > -1) {

                        // Set new size for frame
                        $wrapped.css({
                            'height': nHeight
                        });
                    } else {
                        nHeight = dHeight;
                    }

                    if (ext_val.height == '100%') {

                        // Get new window height
                        nHeight = $(window).height();
                        // Set new height for frame
                        $wrapped.css({
                            'height': nHeight
                        });
                    }

                    // Set new size for slider
                    $obj.css({
                        'width': nWidth,
                        'height': nHeight
                    });
                } else if (ext_val.height == '100%') {

                    // Get new frame size
                    var nWidth = $wrapped.width(),
                        nHeight = $(window).height();

                    // Set new height for the frame
                    $wrapped.css({
                        'height': nHeight
                    });

                    // Set new size for slider
                    $obj.css({
                        'width': nWidth,
                        'height': nHeight
                    });
                }
            }

            var paDw = $wrapped.parent().width(),
                paDh = $wrapped.parent().height(); // frame parent default size

            // Check frame parent resize function
            function paResize() {
                var paNw = $wrapped.parent().width(),
                    paNh = $wrapped.parent().height();

                if (ext_val.height == '100%') {
                    paDh = $(window).height();
                }

                if (paNw != paDw || paNh != paDh) {

                    // Resize slider in responsive option
                    jlider_responsive();

                    // Resize line paging button
                    jlider_resize($wrapped.width());
                }
            }

            // Get new caption space
            if (ext_val.hideControl == 'hover') {

                $wrapped.mouseenter(function(event) {
                    if (ext_val.photoCaption) {$item.children('.jLsCaption').css('bottom',$navbutton.height());}
                    $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_seeker').css('bottom',$navbutton.height());
                    $navbutton.css('bottom',0);
                });

                $wrapped.mouseleave(function(event) {
                    if (ext_val.photoCaption) {$item.children('.jLsCaption').css('bottom',0);}
                    $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_seeker').css('bottom',0);
                    $navbutton.css('bottom',-$navbutton.height());
                });

            }

            // HTML5 video functions

            function htm5vid(dSlide, actions, seeker, nsWidth, event) {

                event = event || window.event;
                var prevVid = $(".justDeactive", $obj).children('video'), // Get the previous slide video
                    currVid = $(".jactive", $obj).children('video'); // Get the current slide video

                // Target video slide
                if (dSlide == 'prev') {
                    theVid = prevVid;
                } else {
                    theVid = currVid;
                }

                // Make sure the previous slide has the HTML5 video tag
                if (theVid != undefined && theVid.size() > 0) {

                    var theVidL = theVid.get(0), // Get the video content
                        seekBar = $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_seeker'), // Get seekbar
                        fSeekPg = $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_seeker').children('.jLi_h5V_progress'); // Get fake seekbar progress

                    // Mute the video
                    if (actions == 'mute' && theVidL.muted == false) {
                        theVidL.muted = true;
                    }

                    // Unmute the video
                    if (actions == 'unmute' && theVidL.muted == true) {
                        theVidL.muted = false;
                    }

                    // Request full screen mode for the video (hidden feature)
                    /*if (actions == 'fullscreen') {
                        if (theVidL.requestFullscreen) {
                            theVidL.requestFullscreen();
                        } else if (theVidL.mozRequestFullScreen) {
                            theVidL.mozRequestFullScreen(); // Firefox
                        } else if (theVidL.webkitRequestFullscreen) {
                            theVidL.webkitRequestFullscreen(); // Chrome and Safari
                        }
                    }*/

                    // Seeking the video
                    if (actions == 'seeking') {

                        var ofsLeft = event.pageX - seekBar.offset().left, // Detect mouse
                            nPercent = ((ofsLeft/nsWidth)*100), // Calculate new percent
                            time = nPercent / (100 / theVidL.duration); // Calculate new time

                        // Update the video time
                        theVidL.currentTime = time;

                    }

                    // Get video playing time for the seek bar
                    if (actions == 'timing') {


                        // Update video time
                        theVidL.addEventListener("timeupdate", function() {

                            // Calculate the slider value
                            var seekTime = (100 / theVidL.duration) * theVidL.currentTime;

                            // Add time to check loadingevent
                            theVid.attr('data-currentTime',theVidL.currentTime);

                            // Show loading when media buffering
                            if (theVid.attr('data-currentTime') == theVidL.currentTime && $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_triggers').children('.jLi_h5V_trigger').hasClass('jLi_h5V_playing') && seekTime < 100) {

                                $(".jactive", $obj).addClass('buffering');

                            } else {

                                $(".jactive", $obj).removeClass('buffering');

                            }

                            // Update the slider value and time

                            var currentS = Math.floor(theVidL.currentTime);

                            if (currentS > 59) { // If current second(s) greater than

                                var curMin = Math.floor(currentS/60), // Calculate current minute(s)
                                    curSec = Math.round(((currentS/curMin) - 60)*curMin); // Calculate current second(s)

                                if (curSec < 10) {curSec='0'+curSec;} // Add number '0' to current second(s) when it's lower than 10

                                var curTime = curMin + ':' + curSec;

                            } else { // If current second(s) lower than 60

                                if (currentS < 10) {currentS='0'+currentS;} // Add number '0' to current second(s) when it's lower than 10

                                var curTime = '0:' + currentS;

                            }

                            // Run the progress and add time
                            fSeekPg.css('left', seekTime + '%').attr('data-jLiTime', curTime);

                        });

                        // Reset controller when media is ended
                        theVidL.addEventListener("ended", function() {

                            // Reset play trigger
                            $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_triggers').children('.jLi_h5V_trigger.jLi_h5V_playing').addClass('jLi_h5V_pausing').removeClass('jLi_h5V_playing').attr('title','Play');

                            // Reset seekbar
                            fSeekPg.css('left', '0%').attr('data-jLiTime', '0:00');
                        });

                    }

                    // Pause the video
                    if (actions == 'pause') {

                        // Add tooltip to trigger
                        $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_triggers').children('.jLi_h5V_trigger.jLi_h5V_playing').addClass('jLi_h5V_pausing').removeClass('jLi_h5V_playing').attr('title','Play');

                        // Pause the video
                        theVidL.pause();
                    }

                    // Play the video
                    if (actions == 'play') {

                        // Pause any video playing on other slider
                        $('.jLi_html5Video').each(function() {

                            // Get id of the slider
                            vidIDs = $(this).attr('data-jliframeid');

                            // If this slider having diffrent id ( means other slider )
                            if (vidIDs != sIDz) {

                                // Pause the video on this slider
                                $(this).get(0).pause();

                                // Add tooltip to trigger of this slider
                                $(this).next('.jLi_h5V_controller').children('.jLi_h5V_triggers').children('.jLi_h5V_trigger.jLi_h5V_playing').addClass('jLi_h5V_pausing').removeClass('jLi_h5V_playing').attr('title','Play');
                            }
                        });
                        
                        // Add tooltip to trigger
                        $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_triggers').children('.jLi_h5V_trigger.jLi_h5V_pausing').removeClass('jLi_h5V_pausing jLi_h5V_seeking').addClass('jLi_h5V_playing').attr('title','Pause');

                        // Add buffering effect
                        if (((100 / theVidL.duration) * theVidL.currentTime) == 0 || isNaN(theVidL.duration)) {
                            $(".jactive", $obj).addClass('buffering');
                        }
                        
                        theVidL.play(); // play the video
                        pauser(); // Pause slider
                        $play.addClass('paused'); // Change slider trigger
                    }

                }

            }

            // Run interval for resize check
            setInterval(paResize, 100);

            // Function for changing slide
            var currIndex = function() {
                return parseInt($(".jactive", $navbutton).data("index"), 10);
            };

            function getThumbnail(element,dir) {

                if (element.children('[poster]').size() > 0 && element.children('[poster]').attr('poster') != '') {

                    var eleThumb = element.children('[poster]').attr('poster'); // Get poster link for thumbnail
                    dir.children('.jLi_control_pv.jLi_c_pr').css('background-image','url(' + eleThumb + ')'); // Set thumbnail for controlbutton

                } else {

                    dir.children('.jLi_control_pv.jLi_c_pr').css('background-image','url(jlider/no_thumb.svg)'); // Set no thumbnail for controlbutton

                }

            }

            function preiewControl() {

                // Get thumbnail for the last slide
                if ($(".jactive", $obj).next('[data-jliid]').size() == 0) {

                    getThumbnail($item.first(),$next);

                } else { // Get thumbnail for the next slide

                    getThumbnail($(".jactive", $obj).next(),$next);

                } $next.children().toggleClass('jLi_c_pr'); // Toggle between old/new thumbnail

                // Get thumbnail of the first slide
                if ($(".jactive", $obj).prev('[data-jliid]').size() == 0) {
                    
                    getThumbnail($item.last(),$prev);

                } else { // Get thumbnail for the prev slide

                    getThumbnail($(".jactive", $obj).prev(),$prev);

                } $prev.children().toggleClass('jLi_c_pr'); // Toggle between old/new thumbnail

            }

            // Change slide
            function mover(actions) {

                // Pause html5 video when change slide
                htm5vid('x', 'pause');

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

                preiewControl();

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
                setTimeout(function() {
                    $(".justDeactive", $obj).removeClass('justDeactive');
                }, fadeTime);
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
                $progress.stop(true, true);

                // When progress start
                if (actions && ext_val.visiProgress) {
                    // Start progress animation
                    $progress.animate({
                        width: '100%'
                    }, ext_val.visiTime, 'linear', function() {
                        // Reset animation at end
                        $progress.css('width', 0);
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
                    if (!$play.hasClass('play')) {

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
            function changeSlide(type, element) {
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
            function slideAction(type, element) {

                // If the hoverPause is turn on...
                if (ext_val.hoverPause) {

                    // Move
                    changeSlide(type, element);

                    // But also pause the slide
                    pauser();
                } else {

                    // Pause slide first
                    pauser();

                    // Then move
                    changeSlide(type, element);

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

                htm5vid('prev', 'pause');

                // Choose action to slide
                slideAction('page', $(this));

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

                    // Get new caption space when enter fullscreen
                    if (ext_val.hideControl == 'hover') {
                        setTimeout(function(){
                            if (ext_val.photoCaption) {$item.children('.jLsCaption').css('bottom',$navbutton.height());}
                            $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_seeker').css('bottom',$navbutton.height());
                            $navbutton.css('bottom',0);
                        }, 50);
                    }

                    // Callback enter fullscreen
                    ext_val.goFullscreen.call($wrapped, $("li.jactive", $obj));
                } else {
                    // Callback exit fullscreen
                    ext_val.outFullscreen.call($wrapped, $("li.jactive", $obj));
                }
            }

            // Require/Exit fullscreen
            function fScreen(type, target) {
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
                    $wrapped.toggleClass(function() {
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


            // Stop people from get photo's URL
            if (ext_val.noCopy) {
                $obj.addClass('noCopy');
            }

            // Click the play/pause HTML5 video button
            $('.jLi_h5V_trigger', $obj).click(function() {

                // If video is pausing
                if ($(this).hasClass('jLi_h5V_pausing')) {
                    console.log('Now play video of ' + $wrapped.attr('data-jlsid'));
                    htm5vid('x', 'play'); // Play it
                    htm5vid('x', 'timing'); // Start timing for seek bar
                } else {
                    console.log('Now pause the video of ' + $wrapped.attr('data-jlsid'));
                    htm5vid('x', 'pause'); // Pause the video
                }
                console.log($wrapped.attr('data-jlsid'));
            });


            // When mouse down on the seek bar
            $('.jLi_h5V_seeker', $obj).on('mousedown', function(e) {
                switch (e.which) {
                    case 1: // Only work for left click

                        $(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_triggers').children('.jLi_h5V_trigger.jLi_h5V_playing').addClass('jLi_h5V_seeking');
                        htm5vid('x', 'pause'); // Pause the video
                        var nsWidth = $('.jlider').width();
                        htm5vid('x', 'seeking','',nsWidth, e); // Seek the video
                }
            });

            // When mouse up on the seek bar
            $('.jLi_h5V_seeker', $obj).on('mouseup mouseleave', function() {
                console.log('Mouse Up of ' + $wrapped.attr('data-jlsid'));
                if ($(".jactive", $obj).children('.jLi_h5V_controller').children('.jLi_h5V_triggers').children('.jLi_h5V_trigger').hasClass('jLi_h5V_seeking')) {
                    htm5vid('x', 'play'); // Play the video
                    htm5vid('x', 'timing'); // Start timing for seek bar
                }
            });

            // Click the mute HTML5 video button
            $('.jLi_h5V_mute', $obj).click(function() {

                // If video is unmuted
                if ($(this).hasClass('jLi_h5V_unmuted')) {
                    htm5vid('x', 'mute'); // Play it
                    $(this).removeClass('jLi_h5V_unmuted').addClass('jLi_h5V_muted'); // Toggle the class
                } else {
                    htm5vid('x', 'unmute'); // Pause the video
                    $(this).removeClass('jLi_h5V_muted').addClass('jLi_h5V_unmuted'); // Toggle the class
                }
            });

            var mouseTimeout;

            // Hide video control when mouse is not moving
            $('.jlider_frame').mousemove(function(){
                clearTimeout(mouseTimeout);
                $(this).addClass('moving');
                mouseTimeout = setTimeout(function(){$('.jlider_frame').removeClass('moving');}, 1000);
            });

        });
    };
})(jQuery);