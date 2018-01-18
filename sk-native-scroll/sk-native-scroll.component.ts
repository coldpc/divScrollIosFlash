import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

export interface TouchData {

    x0: number;
    y0: number;
    xt: number;
    yt: number;

    direct: number; // 方向
    isTop: boolean; // 是否在顶部
    isBottom: boolean; // 是否在底部
    isStart: boolean; // 是否开始滚动
}




@Component({
    selector: 'app-sk-native-scroll',
    templateUrl: './sk-native-scroll.component.html',
    styleUrls: ['./sk-native-scroll.component.scss']
})
export class SkNativeScrollComponent implements OnInit, AfterViewInit {
    @ViewChild("scrollWrapper") scrollWrapper: ElementRef;
    @ViewChild("scrollContent") scrollContent: ElementRef;

    private _touchData: TouchData = {
        x0: 0,
        y0: 0,
        xt: 0,
        yt: 0,
        direct: 0,
        isTop: false,
        isBottom: false,
        isStart: false
    };

    constructor() {
    }

    ngOnInit() {
    }

    /**
     * 设置body的滚动条可展现
     * 设置滚动重置
     */
    ngAfterViewInit() {
        this.init();
    }

    init() {
        let wrapper = this.scrollWrapper.nativeElement;
        let eventName = {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend',
            cancel: 'touchcancel',
            scroll: 'scroll'
        };

        // 触摸开始
        wrapper.addEventListener(eventName.start, (e) => {
            this.onTouchStart(e);
        });

        wrapper.addEventListener(eventName.move, (e) => {
            this.onTouchMove(e);
        });


        wrapper.addEventListener(eventName.end, (e) => {
            this.onTouchEnd();
        });


        wrapper.addEventListener(eventName.cancel, (e) => {
            this.onTouchEnd();
        });

        wrapper.addEventListener(eventName.scroll, (e) => {
            this.checkOverScroll();
        });
    }

    onTouchStart(e) {
        let touchData = this._touchData;
        let touches = e.targetTouches;
        touchData.y0 = touchData.yt = touches[0].clientY;
        touchData.direct = 0;
        touchData.isStart = true;
        console.log(touchData);
    }

    /**
     *
     * @param e touch事件
     * 追踪touch
     * 判断方向
     *
     */
    onTouchMove(e) {
        let touches = e.targetTouches;
        let touchData = this._touchData;

        touchData.y0 = touchData.yt;
        touchData.yt = touches[0].clientY;

        if (touchData.yt > touchData.y0) {
            touchData.direct = 1;
        }else if(touchData.yt < touchData.y0) {
            touchData.direct = -1;
        }else {
            touchData.direct = 0;
        }

        touchData.isBottom = this.isBottom(touchData.direct);
        touchData.isTop = this.isTop(touchData.direct);

        if (touchData.isStart) {
            if (touchData.isBottom || touchData.isTop) {
                this.stop(e);
            }
            touchData.isStart = false;
        }
    }

    // 在结局滑动之后做的操作
    onTouchEnd() {
        let touchData = this._touchData;
        touchData.y0 = touchData.yt = 0;
        touchData.direct = 0;
        touchData.isTop = false;
        touchData.isBottom = false;
    }

    // 判断滚动条是否在顶部
    isTop(direct): boolean {
        return this.getScrollTop() === 0 && direct === 1;
    }

    // 判断滚动条是否在底部
    isBottom(direct): boolean {
        let scrollTop = this.getScrollTop();
        let pageHeight = this.scrollWrapper.nativeElement.offsetHeight;
        let totalHeight = this.scrollContent.nativeElement.offsetHeight;
        return direct === -1 && totalHeight - 1 < pageHeight + scrollTop;
    }

    // 获取滚动条滚动的位置
    getScrollTop(): number {
        return this.scrollWrapper.nativeElement.scrollTop || 0;
    }

    // 最大的滚动距离
    getMaxScrollTop(): number {
        let pageHeight = this.scrollWrapper.nativeElement.offsetHeight;
        let totalHeight = this.scrollContent.nativeElement.offsetHeight;
        let max = totalHeight - pageHeight;

        if (max < 0) {
            max = 1;
        }
        return max;
    }

    // 阻止浏览器默认行为
    stop(e) {
        e.stopPropagation();
        if (e.cancelable && !e.defaultPrevented) {
            e.preventDefault();
        }
    }

    // 设置滚动的位置
    setScrollTop(top) {
        this.scrollWrapper.nativeElement.scrollTop = top;
    }

    /*
     * 这个函数至关重要
     * 解决ios回弹滚动画面闪现的问题
     * 由于ios的回弹，导致scrollTop超出滚动范围 {0, maxScroll}
     * 局部滚动会引起画面重置到滚动范围
     * 这个解决方案将发布与github
     */
    checkOverScroll() {
        let scrollTop = this.getScrollTop();
        if (scrollTop < 0) {
            this.setScrollTop(0);
        }else {
            let maxScrollTop = this.getMaxScrollTop();
            if (maxScrollTop < scrollTop) {
                this.setScrollTop(maxScrollTop);
            }
        }
    }
}

