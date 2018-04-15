/**
 * Created by h_dj on 2018/4/10.
 *
 * 封装页面移动的代码
 */

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
    swipe.scrollTo = function (container,time, proportionX) {
        var distX = container.width() * proportionX;
        scroll(distX, time);
        return this;
    };


    return swipe;
}
