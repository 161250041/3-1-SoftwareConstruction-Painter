
(function () {
    var pointsX=[];
    var pointsY=[];

    var lineX=[];
    var lineY=[];

    var graphlist=[];

    var Graph={
        id: 0,
        color: "#000000",
        x:[],
        y:[],
    }

    function createGraph(id,color,x,y) {
        // 基于Student原型创建一个新对象:
        var g = Object.create(Graph);
        // 初始化新对象:
        g.id = id;
        g.color=color;
        g.x=x;
        g.y=y;
        return g;
    }


    function Painter(id) {
        var canvasEle = document.getElementById(id);
        canvasEle.width = innerWidth;
        canvasEle.height = innerHeight;
        i=0;
        this.context = canvasEle.getContext("2d");

        var self = this;
//监听鼠标按下抬起
        this.context.canvas.addEventListener("mousedown",startAction);
        this.context.canvas.addEventListener("mouseup",endAction);


//封装鼠标按下函数
        function startAction(event) {
//如果没有使用橡皮擦就画线
            if(!self.isClear){
//开始新的路径
                self.context.beginPath();
                var x = event.pageX;
                var y = event.pageY;
                self.context.moveTo(x,y);
                lineX.push(x);
                lineY.push(y);
                self.context.stroke();
            }
//监听鼠标移动
            self.context.canvas.addEventListener("mousemove",moveAction);
        }


//封装鼠标抬起函数
        function endAction() {
//不再使用橡皮擦
            self.isClear=false;
//移除鼠标移动事件
            self.context.canvas.removeEventListener("mousemove",moveAction);
            pointsX.push(lineX);
            pointsY.push(lineY);
            lineX = [];
            lineY = [];
            i++;
        }


//封装鼠标移动函数
        function moveAction(event) {
//判断是否启动橡皮擦功能
            if(self.isClear){
                self.context.clearRect(event.pageX-8,event.pageY-8,16,16);
                return;
            }
            var x = event.pageX;
            var y=event.pageY;
            self.context.lineTo(x,y);
            lineX.push(x);
            lineY.push(y); //记录
            self.context.stroke();
        }

    }

//封装画笔宽度
    Painter.prototype.setLineWidth = function (width) {
        this.context.lineWidth = width;
    };
//封装设置画笔样式
    Painter.prototype.isRoundLineCap = function (isRound) {
        this.context.lineCap = isRound?"round":"butt";
    };
//封装画笔颜色
    Painter.prototype.setLineColor = function (color) {
        this.context.strokeStyle = color;
    };
//封装画布内容转换
    Painter.prototype.save=function(){

        return this.context.canvas.toDataURL();
    };
//封装橡皮擦
    Painter.prototype.eraser=function(){
        this.isClear=true;
    }
//封装识别
    Painter.prototype.recognize=function(){
        var color="#000000";
        switch (i) {
            case 1:
                alert("圆");
                color="#0000ff";
                break;
            case 2:
                alert("三角形");
                color="#00ffff";
                break;
            case 3:
                alert("正方形");
                color="#abcdff";
                break;
            case 4:
                alert("长方形");
                color="#990ddd";
                break;
            default:
                alert("形状不合法，请重新作图");
                color="#ffffff";

        }
        if(i>0){
            var width=this.context.lineWidth;
            var g = createGraph(0, color, pointsX, pointsY);
            this.context.strokeStyle=color;
            if(i<5){
                var s = JSON.stringify(g);
                graphlist.push(s);
            }else{
                this.context.lineWidth=width*2;
            }
            for(var t=0;t<pointsX.length;t++){
                var linex = (pointsX)[t];
                var liney = (pointsY)[t];
                for(var j=0;j<pointsX[t].length-1;j++){
                    this.context.beginPath();        //起始一条路径，或重置当前路径
                    this.context.moveTo(linex[j],liney[j]);        //把路径移动到画布中的指定点，不创建线条
                    this.context.lineTo(linex[j+1],liney[j+1]);        //添加一个新点，然后在画布中创建从该点到最后指定点的线条
                    this.context.stroke();
                }
            }

            //还原笔触
            this.context.strokeStyle = "#000000";
            this.context.lineWidth=width;

        }
        //数据初始化
        i=0;
        pointsX = [];
        pointsY = [];
    }

//封装清屏
    Painter.prototype.clearCls=function(){
        this.context.clearRect(0,0,innerWidth,innerHeight)
    };
//Painter定义到window上
    window.Painter = Painter;
})();