
(function () {
    function init() {
        var painter = new Painter("box");
        painter.setLineWidth(5);
        painter.isRoundLineCap(true);
//painter.setLineColor("#242424");
        var toolView = document.querySelector(".tool");
        document.querySelector(".openButton").onclick = function () {
            toolView.style.display = toolView.style.display === "block"?"none":"block";
        };
        document.querySelector("input[type=range]").value = painter.context.lineWidth*2;
//input的range绑定到画笔宽度
        document.querySelector("input[type=range]").onchange = function () {
            painter.setLineWidth(this.value/2);
        };
//获取color颜色绑定到画笔
        document.querySelector("input[type=color]").onchange = function () {
            painter.setLineColor(this.value);
        };
//识别
        document.querySelector(".recognition").onclick=function(){
            painter.recognize();

        }
//清屏
        document.querySelector(".clearButton").onclick = function() {
            painter.clearCls();
        }

//下载画布内容
        document.querySelector(".download").onclick=function(){
            var a=painter.save();
            console.log(1);
            this.href=a;
        }
    }
    init();
})();