/**
 * Created by h_dj on 2018/4/12.
 */


var QiXi = function () {

    var container = $("#content");
    // 页面可视区域
    var visualWidth = container.width();
    var visualHeight = container.height();

    //男孩x水平距离
    var instanceX;

    //配置
    var config = {
        snowflakeURl: [
            '/QiXi/images/snowflake/snowflake2.png',
            '/QiXi/images/snowflake/snowflake3.png',
            '/QiXi/images/snowflake/snowflake4.png',
            '/QiXi/images/snowflake/snowflake5.png',
            '/QiXi/images/snowflake/snowflake6.png',
            '/QiXi/images/snowflake/snowflake1.png'
        ],
        // 音乐配置
        audioConfig: {
            enable: true, // 是否开启音乐
            playURl:  '/QiXi/music/happy.wav', // 正常播放地址
            cycleURL: '/QiXi/music/circulation.wav' // 正常循环播放地址
        },
        setTime: {
            walkToThird: 6000,
            walkToMiddle: 6000,
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
    };


    //音乐
    var audio1 = Hmlt5Audio(config.audioConfig.playURl);
    audio1.end(function () {
        Hmlt5Audio(config.audioConfig.cycleURL, true);
    });

    var boy = new Boy();
    var swipe = Swipe(container);
    // 太阳公转
    $("#sun").addClass('rotation');
    // 飘云
    $(".cloud:first").addClass('cloud1Anim');
    $(".cloud:last").addClass('cloud2Anim');
    // 开始第一次走路
    boy.walkTo(config.setTime.walkToThird, 0.6, 0)
        .then(function () {
            swipe.scrollTo(config.setTime.walkToThird, 1);
            //第一次走路完成
            return boy.walkTo(config.setTime.walkToMiddle,
                0.55, 0)
        })
        .then(function () {
            bird.fly();
        })
        .then(function () {
            //进店买花
            //暂停走路
            boy.stopWalk()
            return boy.toShopBuyFlower(boy);
        })
        .then(function () {
            //调整女孩的位置
            girl.setOffset()
            //切换到第三页
            swipe.scrollTo(config.setTime.walkToEnd, 2);
            //走向第三页
            return boy.walkTo(config.setTime.walkToEnd,
                0.15)
        })
        .then(function () {
            //走向桥
            return boy.walkTo(config.setTime.walkTobridge,
                0.25,
                (bridgeY - girl.getHeight()) / visualHeight)
        }).then(function () {
            //走向女孩
            var proportionX = (girl.getOffset().left - boy.getWidth() - instanceX + girl.getWidth() / 5) / visualWidth;
            return boy.walkTo(config.setTime.bridgeWalk,
                proportionX)
        }).then(function () {
            boy.resetOriginal();
            setTimeout(function () {
                    girl.rotate();
                    boy.rotate(function () {
                        snowflake()
                    })
                },
                config.setTime.waitRotate)
        });


    //男孩
    function Boy() {


        var $boy = $("#boy");
        var boyWidth = $boy.width();
        var boyHeight = $boy.height();

        //设置男孩位置
        // 设置offset
        (function setOffset(elm) {
            elm.css({
                top: pathY - boyHeight
            })
        }($boy))

        // 暂停走路
        function pauseWalk() {
            $boy.addClass('pauseWalk');
        }

        // 恢复走路
        function restoreWalk() {
            $boy.removeClass('pauseWalk');
        }

        // css3的动作变化
        function slowWalk() {
            $boy.addClass('slowWalk');
        }

        // 计算移动距离
        function calculateDist(direction, proportion) {
            var distance = ((direction == "x" ?
                visualWidth : visualHeight) * proportion);
            console.log('distance', direction)
            return distance;
        }


        // 用transition做运动
        function stratRun(options, runTime) {
            var dfdPlay = $.Deferred();
            // 恢复走路
            restoreWalk();
            // 运动的属性
            $boy.transition(
                options,
                runTime,
                'linear',
                function () {
                    dfdPlay.resolve();
                });
            return dfdPlay;
        }

        // 开始走路
        function walkRun(time, distX, distY) {
            console.log(time, distX, distY);
            time = time || 3000;
            distY = distY ? distY : undefined;
            // 脚动作
            slowWalk();
            // 开始走路
            var d1 = stratRun({
                'left': distX + 'px',
                'top': distY
            }, time);
            return d1;
        }


        // 走进商店
        function walkToShop(runTime) {
            var defer = $.Deferred();
            var doorObj = $('.door')
            // 门的坐标
            var offsetDoor = doorObj.offset();
            var doorOffsetLeft = offsetDoor.left;
            // 小孩当前的坐标
            var offsetBoy = $boy.offset();
            var boyOffetLeft = offsetBoy.left;

            // 当前需要移动的坐标
            instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 4);
            // 开始走路
            var walkPlay = stratRun({
                transform: 'translateX(' + instanceX + 'px),scale(0.3)',
                opacity: 0.1
            }, 2000);
            // 走路完毕
            walkPlay.done(function () {
                $boy.css({
                    opacity: 0
                })
                defer.resolve();
            })
            return defer;
        }

        // 走出店
        function walkOutShop(runTime) {
            var defer = $.Deferred();
            restoreWalk();
            //开始走路
            var walkPlay = stratRun({
                transform: 'translateX(' + instanceX + 'px),scale(1)',
                opacity: 1
            }, runTime);
            //走路完毕
            walkPlay.done(function () {
                defer.resolve();
            });
            return defer;
        }

        // 取花
        function talkFlower() {
            // 增加延时等待效果
            var defer = $.Deferred();
            setTimeout(function () {
                // 取花
                $boy.addClass('slowFlolerWalk');
                defer.resolve();
            }, 100);
            return defer;
        }

        //去商店买花
        function toShopBuyFlower($boy) {
            var defer = $.Deferred();

            var waitOpen = door.openDoor(config.setTime.openDoorTime);
            waitOpen.then(function () {
                lamp.bright();
                return $boy.toShop(door.$door,
                    config.setTime.walkToShop)
            }).then(function () {
                return talkFlower()
            }).then(function () {
                return $boy.outShop(config.setTime.walkOutShop)
            }).then(function () {
                door.closeDoor(config.setTime.shutDoorTime);
                lamp.dark();
                defer.resolve()
            });
            return defer
        };

        return {
            // 开始走路
            walkTo: function (time, proportionX, proportionY) {
                console.log('容器宽', visualWidth)
                var distX = calculateDist('x', proportionX)
                var distY = calculateDist('y', proportionY)

                console.log('distX', distX)
                return walkRun(time, distX, distY);
            },
            toShopBuyFlower: function ($boy) {
                return toShopBuyFlower($boy);
            },
            toShop: function () {
                return walkToShop.apply(null,
                    arguments)
            },
            outShop: function () {
                return walkOutShop.apply(null,
                    arguments)
            },
            // 停止走路
            stopWalk: function () {
                pauseWalk();
            },
            // 取花
            talkFlower: function () {
                return talkFlower();
            },
            setFlolerWalk: function () {
                $boy.addClass('slowFlolerWalk');
            },
            // 获取男孩的宽度
            getWidth: function () {
                return $boy.width();
            },
            // 复位初始状态
            resetOriginal: function () {
                this.stopWalk();
                // 恢复图片
                $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
            },
            // 转身动作
            rotate: function (callback) {
                restoreWalk();
                $boy.addClass('boy-rotate');
                // 监听转身完毕
                if (callback) {
                    $boy.on(animationEnd, function () {
                        callback();
                        $(this).off();
                    })
                }
            }
        }
    };

//女孩
    var girl = {
        elem: $(".girl"),
        getHeight: function () {
            return this.elem.height()
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
            return this.elem.offset()
        },
        getWidth: function () {
            return this.elem.width()
        }
    };

//开关灯
    var lamp = {
        elem: $('.b_background'),
        bright: function () {
            this.elem.addClass('lamp-bright')
        },
        dark: function () {
            this.elem.removeClass('lamp-bright')
        }
    };

    //鸟
    var bird = {
        elem: $(".bird"),
        fly: function () {
            this.elem.addClass('birdFly')
            this.elem.transition({
                right: container.width()
            }, 15000, 'linear');
        }
    };

    //门
    var door = {
        $door: $('.door'),
        //开关门动画
        doorAction: function (left, right, time) {

            var doorLeft = $('.door-left');
            var doorRight = $('.door-right');
            var defer = $.Deferred();
            var count = 2;
            // 等待开门完成
            var complete = function () {
                if (count == 1) {
                    defer.resolve();
                    return;
                }
                count--;
            };
            doorLeft.transition({
                    'left': left
                },
                time, complete);
            doorRight.transition({
                    'left': right
                }
                ,
                time, complete
            )
            ;
            return defer;
        },
        //开门
        openDoor: function () {
            return door.doorAction('-40%', '90%', 2000);
        },
        //关门
        closeDoor: function () {
            return door.doorAction('0%', '50%', 2000);
        }
    }

//音频
    function Hmlt5Audio(url, isloop) {
        var audio = new Audio(url);
        audio.autoPlay = true;
        audio.loop = isloop || false;
        audio.play();
        return {
            end: function (callback) {
                audio.addEventListener('ended', function () {
                    callback();
                }, false);
            }
        };
    }

// 桥的Y轴
    var bridgeY = function () {
        var data = getValue('.c_background_middle');
        return data.top;
    }();
// 路的Y轴
    var pathY = function () {
        var data = getValue('.a_background_middle');
        return data.top + data.height / 2;
    }();


// 动画结束事件
    var animationEnd = (function () {
        var explorer = navigator.userAgent;
        if (~explorer.indexOf('WebKit')) {
            return 'webkitAnimationEnd';
        }
        return 'animationend';
    }());


// 获取数据
    function getValue(className) {
        var $elem = $("" + className + "");
        return {
            height: $elem.height(),
            top: $elem.position().top
        }
    };

//定义一个滑动对象
    function Swipe(container) {
        //获取第一个子节点
        var element = container.find(":first");

        //滑动对象
        var swipe = {};

        //li页面数量
        //var slides = element.find("li");
        var slides = element.find(">");


        //获取容器尺寸
        var width = container.width();
        var height = container.height();

        //设置li页面总宽度
        element.css({
            width: (slides.length * width) + 'px',
            height: height + 'px'
        });

        //设置每一个页面li的宽度
        $.each(slides, function (index) {
            var slide = slides.eq(index); //获取到每一个li元素
            slide.css({
                width: width + 'px',
                height: height + 'px'
            });
        });


        function scroll(x, speed) {
            var defaultSpeed = speed || '5000';
            //执行动画移动
            element.css({
                'transition-timing-function': 'linear',
                'transition-duration': defaultSpeed + 'ms',
                'transform': 'translate3d(-' + x + 'px,0px,0px)'
            });
        }


        //监控完成与移动
        swipe.scrollTo = function (time, proportionX) {

            var distX = container.width() * proportionX;
            scroll(distX, time);
            return this;
        };


        return swipe;
    }


    function snowflake() {

        // 雪花容器
        var $flakeContainer = $('#snowflake');

        // 随机六张图
        function getImagesName() {
            return config.snowflakeURl[Math.floor(Math.random() * 6)];
        }

        // 创建一个雪花元素
        function createSnowBox() {
            var url = getImagesName();
            return $('<div class="snowbox" />').css({
                "backgroundImage": "url(" + url + ")"
            }).addClass('snowRoll');
        }

        // 开始飘花
        setInterval(function () {
            // 运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity = 1,
                endPositionTop = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $flake = createSnowBox();

            // 设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity: randomStart
            });

            // 加入到容器
            $flakeContainer.append($flake);

            // 开始执行动画
            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function () {
                $(this).remove() //结束后删除
            });

        }, 200);
    }
}





