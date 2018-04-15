/**
 * Created by h_dj on 2018/4/14.
 */
var Qixi = function () {
    var confi = {
        keepZoomRatio: false,
        layer: {
            "width": "100%",
            "height": "100%",
            "top": 0,
            "left": 0
        },
        audio: {
            enable: true,
            playURl: "http://www.imooc.com/upload/media/happy.wav",
            cycleURL: "http://www.imooc.com/upload/media/circulation.wav"
        },
        setTime: {
            walkToThird: 6000,
            walkToMiddle: 6500,
            walkToEnd: 6500,
            walkTobridge: 2000,
            bridgeWalk: 2000,
            walkToShop: 1500,
            walkOutShop: 1500,
            openDoorTime: 800,
            shutDoorTime: 500,
            waitRotate: 850,
            waitFlower: 800
        },
        snowflakeURl: ["http://img.mukewang.com/55adde120001d34e00410041.png",
            "http://img.mukewang.com/55adde2a0001a91d00410041.png",
            "http://img.mukewang.com/55adde5500013b2500400041.png",
            "http://img.mukewang.com/55adde62000161c100410041.png",
            "http://img.mukewang.com/55adde7f0001433000410041.png",
            "http://img.mukewang.com/55addee7000117b500400041.png"]
    };
    var debug = 0;
    if (debug) {
        $.each(confi.setTime,
            function (key, val) {
                confi.setTime[key] = 500
            })
    }
    if (confi.keepZoomRatio) {
        varproportionY = 900 / 1440;
        varscreenHeight = $(document).height();
        varzooomHeight = screenHeight * proportionY;
        varzooomTop = (screenHeight - zooomHeight) / 2;
        confi.layer.height = zooomHeight;
        confi.layer.top = zooomTop
    }
    var instanceX;
    var container = $("#content");
    container.css(confi.layer);
    var visualWidth = container.width();
    var visualHeight = container.height();
    var getValue = function (className) {
        var $elem = $("" + className + "");
        return {
            height: $elem.height(),
            top: $elem.position().top
        }
    };
    var pathY = function () {
        vardata = getValue(".a_background_middle");
        returndata.top + data.height / 2
    }();
    var bridgeY = function () {
        var data = getValue(".c_background_middle");
        returndata.top
    }();
    var animationEnd = (function () {
        varexplorer = navigator.userAgent;
        if (~explorer.indexOf("WebKit")) {
            return "webkitAnimationEnd"
        }
        return "animationend"
    })();
    if (confi.audio.enable) {
        varaudio1 = Hmlt5Audio(confi.audio.playURl);
        audio1.end(function () {
            Hmlt5Audio(confi.audio.cycleURL,
                true)
        })
    }
    var swipe = Swipe(container);

    function scrollTo(time,
                      proportionX) {
        vardistX = visualWidth * proportionX;
        swipe.scrollTo(distX,
            time)
    }

    var girl = {
        elem: $(".girl"),
        getHeight: function () {
            returnthis.elem.height()
        },
        rotate: function () {
            this.elem.addClass("girl-rotate")
        },
        setOffset: function () {
            this.elem.css({
                left: visualWidth / 2,
                top: bridgeY - this.getHeight()
            })
        },
        getOffset: function () {
            returnthis.elem.offset()
        },
        getWidth: function () {
            returnthis.elem.width()
        }
    };
    var bird = {
        elem: $(".bird"),
        fly: function () {
            this.elem.addClass("birdFly");
            this.elem.transition({
                    right: visualWidth
                },
                15000,
                "linear")
        }
    };
    var logo = {
        elem: $(".logo"),
        run: function () {
            this.elem.addClass("logolightSpeedIn").on(animationEnd,
                function () {
                    $(this).addClass("logoshake").off()
                })
        }
    };
    var boy = BoyWalk();
    boy.walkTo(confi.setTime.walkToThird,
        0.6).then(function () {
            scrollTo(confi.setTime.walkToMiddle,
                1);
            return boy.walkTo(confi.setTime.walkToMiddle,
                0.5)
        }).then(function () {
            bird.fly()
        }).then(function () {
            boy.stopWalk();
            return BoyToShop(boy)
        }).then(function () {
            girl.setOffset();
            scrollTo(confi.setTime.walkToEnd,
                2);
            return boy.walkTo(confi.setTime.walkToEnd,
                0.15)
        }).then(function () {
            return boy.walkTo(confi.setTime.walkTobridge,
                0.25,
                (bridgeY - girl.getHeight()) / visualHeight)
        }).then(function () {
            var proportionX = (girl.getOffset().left - boy.getWidth() - instanceX + girl.getWidth() / 5) / visualWidth;
            return boy.walkTo(confi.setTime.bridgeWalk,
                proportionX)
        }).then(function () {
            boy.resetOriginal();
            setTimeout(function () {
                    girl.rotate();
                    boy.rotate(function () {
                        logo.run();
                        snowflake()
                    })
                },
                confi.setTime.waitRotate)
        });
    function BoyWalk() {
        var$boy = $("#boy");
        varboyWidth = $boy.width();
        varboyHeight = $boy.height();
        $boy.css({
            top: pathY - boyHeight + 25
        });
        functionpauseWalk()
        {
            $boy.addClass("pauseWalk")
        }
        functionrestoreWalk()
        {
            $boy.removeClass("pauseWalk")
        }
        functionslowWalk()
        {
            $boy.addClass("slowWalk")
        }
        functionstratRun(options,
            runTime)
        {
            vardfdPlay = $.Deferred();
            restoreWalk();
            $boy.transition(options,
                runTime,
                "linear",
                function () {
                    dfdPlay.resolve()
                });
            return dfdPlay
        }
        function walkRun(time,
                         dist,
                         disY) {
            time = time || 3000;
            slowWalk();
            vard1 = stratRun({
                    "left": dist + "px",
                    "top": disY ? disY : undefined
                },
                time);
            returnd1
        }

        function walkToShop(doorObj,
            runTime)
        {
            var defer = $.Deferred();
            var doorObj = $(".door");
            var offsetDoor = doorObj.offset();
            var doorOffsetLeft = offsetDoor.left;
            var offsetBoy = $boy.offset();
            var boyOffetLeft = offsetBoy.left;
            instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);
            var walkPlay = stratRun({
                     transform: "translateX(" + instanceX + "px),scale(0.3,0.3)",
                    opacity: 0.1
                },
                2000);
            walkPlay.done(function () {
                $boy.css({
                    opacity: 0
                });
                defer.resolve()
            });
            return defer
        }
        function walkOutShop(runTime)
        {
            var defer = $.Deferred();
            restoreWalk();
            var walkPlay = stratRun({
                    transform: "translate(" + instanceX + "px,0px),scale(1,1)",
                    opacity: 1
                },
                runTime);
            walkPlay.done(function () {
                defer.resolve()
            });
            return defer
        }
        function calculateDist(direction,
                               proportion) {
            return (direction == "x" ? visualWidth : visualHeight) * proportion
        }

        return {
            walkTo: function (time, proportionX,
                              proportionY) {
                var distX = calculateDist("x",
                    proportionX);
                var distY = calculateDist("y",
                    proportionY);
                return walkRun(time,
                    distX,
                    distY)
            },
            stopWalk: function () {
                pauseWalk()
            },
            resetOriginal: function () {
                this.stopWalk();
                $boy.removeClass("slowWalk slowFlolerWalk").addClass("boyOriginal")
            },
            toShop: function () {
                returnwalkToShop.apply(null,
                    arguments)
            },
            outShop: function () {
                returnwalkOutShop.apply(null,
                    arguments)
            },
            rotate: function (callback) {
                restoreWalk();
                $boy.addClass("boy-rotate");
                if (callback) {
                    $boy.on(animationEnd,
                        function () {
                            callback();
                            $(this).off()
                        })
                }
            },
            getWidth: function () {
                return$boy.width()
            },
            getDistance: function () {
                return$boy.offset().left
            },
            talkFlower: function () {
                $boy.addClass("slowFlolerWalk")
            }
        }
    }

    var BoyToShop = function (boyObj) {
        var defer = $.Deferred();
        var $door = $(".door");
        var doorLeft = $(".door-left");
        var doorRight = $(".door-right");
        function doorAction(left,
            right,
            time)
        {
            var defer = $.Deferred();
            var count = 2;
            var complete = function () {
                if (count == 1) {
                    defer.resolve();
                    return
                }
                count--
            };
            doorLeft.transition({
                    "left": left
                },
                time,
                complete);
            doorRight.transition({
                    "left": right
                },
                time,
                complete);
            return defer
        }
        function openDoor(time) {
            return doorAction("-50%",
                "100%",
                time)
        }

        function shutDoor(time) {
            return doorAction("0%",
                "50%",
                time)
        }

        function talkFlower() {
            var defer = $.Deferred();
            boyObj.talkFlower();
            setTimeout(function () {
                    defer.resolve()
                },
                confi.setTime.waitFlower);
            return defer
        }

        var lamp = {
            elem: $(".b_background"),
            bright: function () {
                this.elem.addClass("lamp-bright")
            },
            dark: function () {
                this.elem.removeClass("lamp-bright")
            }
        };
        var waitOpen = openDoor(confi.setTime.openDoorTime);
        waitOpen.then(function () {
            lamp.bright();
            return boyObj.toShop($door,
                confi.setTime.walkToShop)
        }).then(function () {
            return talkFlower()
        }).then(function () {
            return boyObj.outShop(confi.setTime.walkOutShop)
        }).then(function () {
            shutDoor(confi.setTime.shutDoorTime);
            lamp.dark();
            defer.resolve()
        });
        return defer
    };

    function snowflake() {
        var$flakeContainer = $("#snowflake");
        function getImagesName() {
            return confi.snowflakeURl[[Math.floor(Math.random() * 6)]]
        }

        function createSnowBox() {
            var url = getImagesName();
            return $('<divclass="snowbox"/>').css({
                "width": 41,
                "height": 41,
                "position": "absolute",
                "backgroundSize": "cover",
                "zIndex": 100000,
                "top": "-41px",
                "backgroundImage": "url(" + url + ")"
            }).addClass("snowRoll")
        }

        setInterval(function () {
                var startPositionLeft = Math.random() * visualWidth - 100,
                    startOpacity = 1;
                endPositionTop = visualHeight - 40,
                    endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                    duration = visualHeight * 10 + Math.random() * 5000;
                varrandomStart = Math.random();
                randomStart = randomStart < 0.5 ? startOpacity : randomStart;
                var$flake = createSnowBox();
                $flake.css({
                    left: startPositionLeft,
                    opacity: randomStart
                });
                $flakeContainer.append($flake);
                $flake.transition({
                        top: endPositionTop,
                        left: endPositionLeft,
                        opacity: 0.7
                    },
                    duration,
                    "ease-out",
                    function () {
                        $(this).remove()
                    })
            },
            200)
    }

    function Hmlt5Audio(url,
                        loop) {
        varaudio = newAudio(url);
        audio.autoplay = true;
        audio.loop = loop || false;
        audio.play();
        return {
            end: function (callback) {
                audio.addEventListener("ended",
                    function () {
                        callback()
                    },
                    false)
            }
        }
    }
};

$(function () {
    Qixi()
});
function Swipe(container,
               options) {
    varelement = container.find(":first");
    varswipe = {};
    varslides = element.find(">");
    varwidth = container.width();
    varheight = container.height();
    element.css({
        width: (slides.length * width) + "px",
        height: height + "px"
    });
    $.each(slides,
        function (index) {
            varslide = slides.eq[index];
            slides.eq(index).css({
                width: width + "px",
                height: height + "px"
            })
        });
    varisComplete = false;
    vartimer;
    varcallbacks = {};
    container[0].addEventListener("transitionend",
        function () {
            isComplete = true
        },
        false);
    functionmonitorOffet(element)
    {
        timer = setTimeout(function () {
                if (isComplete) {
                    clearInterval(timer);
                    return
                }
                callbacks.move(element.offset().left);
                monitorOffet(element)
            },
            500)
    }
    swipe.watch = function (eventName,
                            callback) {
        callbacks[eventName] = callback
    };
    swipe.scrollTo = function (x,
                               speed) {
        element.css({
            "transition-timing-function": "linear",
            "transition-duration": speed + "ms",
            "transform": "translate3d(-" + x + "px,0px,0px)"
        });
        returnthis
    };
    returnswipe
}
;