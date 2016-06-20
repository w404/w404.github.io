var $ = function(id) {
    return 'string' == typeof id ? document.getElementById(id) : id;
};
var extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}
var currentStyle = function(element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}
var bind = function(object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function() {
        return fun.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    }
}
var Tween = {
    Quart: {
        easeOut: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        }
    },
    Back: {
        easeOut: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        }
    },
    Bounce: {
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        }
    }
};
//容器对象,滑动对象,切换数量
var SlideTrans = function(container, slider, count, options) {
    this._slider = $(slider);
    this._container = $(container); //容器对象
    this._timer = null; //定时器
    this._count = Math.abs(count); //切换数量
    this._target = 0; //目标值
    this._t = this._b = this._c = 0; //tween参数
    this.Index = 0; //当前索引
    this.setOptions(options);
    this.Auto = !!this.options.Auto;
    this.Duration = Math.abs(this.options.Duration);
    this.Time = Math.abs(this.options.Time);
    this.Pause = Math.abs(this.options.Pause);
    this.Tween = this.options.Tween;
    this.onStart = this.options.onStart;
    this.onFinish = this.options.onFinish;
    this.tagName = this.options.tagName;
    var bVertical = !!this.options.Vertical;
    this._css = bVertical ? 'top' : 'left'; //方向
    //样式设置
    var p = currentStyle(this._container).position;
    p == 'relative' || p == 'absolute' || (this._container.style.position = 'relative');
    this.Change = this.options.Change ? this.options.Change :
        this._slider[bVertical ? 'offsetHeight' : 'offsetWidth'] / this._count;
};
SlideTrans.prototype = {
    //设置默认属性
    setOptions: function(options) {
        this.options = { //默认值
            tagName: 'li', //子标签
            Vertical: true, //是否垂直方向（方向不能改）
            Auto: true, //是否自动
            Change: 0, //改变量
            Duration: 50, //滑动持续时间
            Time: 10, //滑动延时
            Pause: 3000, //停顿时间(Auto为true时有效)
            onStart: function() {}, //开始转换时执行
            onFinish: function() {}, //完成转换时执行
            Tween: Tween.Quart.easeOut //tween算子
        };
        extend(this.options, options || {});
    },
    //开始切换
    run: function(index) {
        this._t = 0;
        this._b = parseInt(currentStyle(this._slider)[this.options.Vertical ? 'top' : 'left']);
        if (typeof index == 'undefined') {
            this._c = 0;
            this.Index = index;
        } else {
            this._c = -Math.abs(this.Change);
        }
        //设置参数
        this.onStart();
        this.move();
    },
    //移动
    move: function() {
        clearTimeout(this._timer);
        //未到达目标继续移动否则进行下一次滑动
        if (this._c && this._t < this.Duration) {
            this.moveTo(Math.round(this.Tween(this._t++, this._b, this._c, this.Duration)));
            this._timer = setTimeout(bind(this, this.move), this.Time);
        } else {
            if (typeof this.Index != 'undefined') {
                var tmpTag = this._slider.getElementsByTagName(this.tagName)[0];
                this._slider.removeChild(tmpTag);
                this._slider.appendChild(tmpTag);
            }
            this.moveTo(0);
            this.Auto && (this._timer = setTimeout(bind(this, this.next), this.Pause));
        }
    },
    //移动到
    moveTo: function(i) {
        this._slider.style[this._css] = i + 'px';
    },
    //下一个
    next: function() {
        this.run(++this.Index);
    },
    //上一个
    previous: function() {
        this.run(--this.Index);
    },
    //停止
    stop: function() {
        clearTimeout(this._timer);
        this.moveTo(this._target);
    }
};

function startrun(obj, attr, target, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var cur = 0;
        cur = parseInt(getstyle(obj, attr));
        var speed = (target - cur) / 8;
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

        if (cur == target) {
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        } else {
            obj.style[attr] = cur + speed + "px";
        }

    }, 30)
}

function getstyle(obj, name) {
    if (obj.currentStyle) {
        return obj.currentStyle[name];
    } else {
        return getComputedStyle(obj, false)[name];
    }
}
