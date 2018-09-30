var pointsX=[];
var pointsY=[];
var lineX=[];
var lineY=[];
var graphlist=[];

//Graph 对象 及其构造函数
var Graph={
    id: 0,
    color: "#000000",
    x:[],
    y:[],
};
function createGraph(id,color,x,y) {
    var g = Object.create(Graph);
    // 初始化新对象:
    g.id = id;
    g.color=color;
    g.x=x;
    g.y=y;
    return g;
}


(function () {
    function Painter(id) {
        var canvasEle = document.getElementById(id);
        canvasEle.width = innerWidth-290;
        canvasEle.height = innerHeight;
        i = 0;
        this.context = canvasEle.getContext("2d");
        var self = this;

//监听鼠标按下抬起
        this.context.canvas.addEventListener("mousedown", startAction);
        this.context.canvas.addEventListener("mouseup", endAction);


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

//封装读取
    Painter.prototype.read = function (inputOne) {
        var reader = new FileReader();//这是核心,读取操作就是由它完成.
        var fileList = inputOne.files;
        var file = fileList[0];
        console.log(file);
        if(file.name.substr(file.name.length-4)!=="json"){
            alert("请选择json文件进行读取");
        }else{
            //初始化
            graphlist = [];
            var pointsX=[];
            var pointsY=[];

            reader.readAsText(file);
            reader.onload = function (e) {
                var canvasEle = document.getElementById("box");
                this.context = canvasEle.getContext("2d");
                this.context.clearRect(0, 0, innerWidth, innerHeight);

                var jsonStr = this.result;
                console.log(jsonStr);

                var jsons=jsonStr.split("\n"); //字符分割
                for (var r=0;r<jsons.length-1 ;r++ )
                {
                    graphlist.push(jsons[r]);
                    var graph = JSON.parse(jsons[r]);
                    this.context.strokeStyle = graph.color;
                    pointsX = graph.x;
                    pointsY = graph.y;

                    for (var t = 0; t < pointsX.length; t++) {
                        var linex = (pointsX)[t];
                        var liney = (pointsY)[t];
                        for (var j = 0; j < pointsX[t].length - 1; j++) {
                            this.context.beginPath();        //起始一条路径，或重置当前路径
                            this.context.moveTo(linex[j], liney[j]);        //把路径移动到画布中的指定点，不创建线条
                            this.context.lineTo(linex[j + 1], liney[j + 1]);        //添加一个新点，然后在画布中创建从该点到最后指定点的线条
                            this.context.stroke();
                        }
                    }
                }
                //还原笔触
                this.context.strokeStyle = "#000000";
                i = 0;
                pointsX = [];
                pointsY = [];
            }

        }

    };
//封装识别
    Painter.prototype.recognize = function () {
        var color = "#000000";
        switch (i) {
            case 1:
                alert("圆");
                color = "#f9a4ad";
                break;
            case 2:
                alert("三角形");
                color = "#b0d9dc";
                break;
            case 3:
                alert("正方形");
                color = "#fab87f";
                break;
            case 4:
                alert("长方形");
                color = "#b9b6f8";
                break;
            default:
                alert("形状不合法，请重新作图");
                color = "#ffffff";

        }
        if (i > 0) {
            var width = this.context.lineWidth;
            var g = createGraph(0, color, pointsX, pointsY);
            this.context.strokeStyle = color;
            if (i < 5) {
                g.id = graphlist.length;
                var s = JSON.stringify(g);
                graphlist.push(s);
            } else {
                this.context.lineWidth = width * 2;
            }
            for (var t = 0; t < pointsX.length; t++) {
                var linex = (pointsX)[t];
                var liney = (pointsY)[t];
                for (var j = 0; j < pointsX[t].length - 1; j++) {
                    this.context.beginPath();        //起始一条路径，或重置当前路径
                    this.context.moveTo(linex[j], liney[j]);        //把路径移动到画布中的指定点，不创建线条
                    this.context.lineTo(linex[j + 1], liney[j + 1]);        //添加一个新点，然后在画布中创建从该点到最后指定点的线条
                    this.context.stroke();
                }
            }

            //还原笔触
            this.context.strokeStyle = "#000000";
            this.context.lineWidth = width;

        }
        //数据初始化
        i = 0;
        pointsX = [];
        pointsY = [];
    };
//封装清屏
    Painter.prototype.clearCls=function(){
        this.context.clearRect(0,0,innerWidth,innerHeight);
        pointsX=[];
        pointsY=[];
        lineX=[];
        lineY=[];
        graphlist=[];
        i = 0;
    };

//Painter定义到window上
    window.Painter = Painter;
})();

//用来得到画板信息
 function getStr() {
     var str = "";
     for(var i=0;i<graphlist.length;i++){
         console.log(graphlist[i]+"被存储");
         str += graphlist[i]+"\n";
     }
     return str;
 }
