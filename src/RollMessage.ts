/**
 * class name : RollMessage
 * description : 滚动通知
 * time : 2019.04.28
 * @author : Ran
 */
class RollMessage extends eui.Component {
    public speed: number = 10;
    /** 一条消息存在的时间，单位s */
    public delay: number = 60;

    /** 滚动组件 */
    private scroller: eui.Scroller;
    /** 滚动组件的视图对象，主要用来控制滚动的属性值 */
    private viewport: eui.IViewport;
    /** 当前滚动的文本 */
    private text: eui.Label;
    private timer: egret.Timer;

    private textQueue: Array<string>;

    public constructor() {
        super();
        this.skinName = "RollMessageSkin";
        this.textQueue = new Array<string>();
    }

    protected createChildren() {
        super.createChildren();
        this.viewport = this.scroller.viewport;
        this.viewport.scrollH = -this.width;
    }

    public start() {
        if (this.textQueue.length > 0)
            this.text.text = this.textQueue.shift();

        if (this.timer == null) {
            this.timer = new egret.Timer(this.delay * 1000, 0);
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.timeup, this);
        }
        else
            this.timer.reset();

        this.timer.start();

        if (!this.hasEventListener(egret.Event.ENTER_FRAME))
            this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
    }

    private update() {
        this.roll();
    }

    /** 添加信息进入文本队列 */
    public addMessage(message: string) {
        this.textQueue.push(message);
    }

    /** 是否到底 */
    public isEnd(): boolean {
        return (this.viewport.scrollH >= this.viewport.contentWidth ? true : false);
    }

    /** 滚动一次固定像素的距离
     * @param speed ：滚动的像素距离
     */
    private roll() {
        this.viewport.scrollH += this.speed;

        if (this.isEnd())
            this.viewport.scrollH = -this.width;
    }

    private hide() {
        if (this.parent)
            this.parent.removeChild(this);

        this.timer.stop();

        if (!this.hasEventListener(egret.Event.ENTER_FRAME))
            this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);

        this.textQueue = [];
    }

    /** 时间到，选择是需要隐藏还是需要显示下一条 */
    public timeup() {
        if (this.textQueue.length > 0) {
            this.text.text = this.textQueue.shift();
            this.viewport.scrollH = -this.width;
            this.timer.reset();
            this.timer.start();
        }
        else {
            this.hide();
        }
    }


    public destructor() {
        if (this.parent)
            this.parent.removeChild(this);

        this.timer.stop();
        if (this.timer.hasEventListener(egret.TimerEvent.TIMER_COMPLETE))
            this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timeup, this);

        if (this.hasEventListener(egret.Event.ENTER_FRAME))
            this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);

        this.scroller = null;
        this.viewport = null;
        this.text = null;
        this.timer = null;
        this.textQueue = null;
    }


    //class end
}