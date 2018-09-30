
(function () {
    function init() {
        var painter = new Painter("box");
        painter.setLineWidth(5);
        painter.isRoundLineCap(true);

//隐藏实现
//读取
        document.getElementById("readButton").onchange = function () {
            painter.read(document.getElementById("readButton"));
        };

//识别
        document.getElementById("recognition").onclick = function () {
            painter.recognize();

        };
        
//清屏
        document.getElementById("clearButton").onclick = function () {
            painter.clearCls();
        };

//设置快捷键
        window.onload=function(){
            HotKeyHandler.Init();
        };
        var HotKeyHandler={
            currentMainKey:null,
            currentValueKey:null,
            Init:function(){
                HotKeyHandler.Register(3,0,function (){
                    painter.recognize()
                });
            },
            Register:function(tag,value,func){
                var MainKey="";
                switch(tag){
                    case 0:
                        MainKey=17; //Ctrl
                        break;
                    case 1:
                        MainKey=16; //Shift
                        break;
                    case 2:
                        MainKey=18; //opt
                        break;
                    case 3:
                        MainKey = 13;
                        break;
                }
                document.onkeyup=function(){
                    HotKeyHandler.currentMainKey=null;
                };

                document.onkeydown=function(event){
//获取键值
                    var keyCode= event.keyCode ;
                    var keyValue = String.fromCharCode(event.keyCode);
                    if(HotKeyHandler.currentMainKey!=null){
                        if(keyValue===value){
                            HotKeyHandler.currentMainKey=null;
                            if(func!=null)func();
                        }
                    }
                    if(keyCode==MainKey){
                        if(value===0&&func!==null) func();
                        else HotKeyHandler.currentMainKey=keyCode;
                    }


                }
            }
        }

//多余功能
//         document.getElementById("openButton").onclick = function () {
//             toolView.style.display = toolView.style.display === "block" ? "none" : "block";
//         };
//
//         document.getElementById("input[type=range]").value = painter.context.lineWidth * 2;
//
// // input的range绑定到画笔宽度
//         document.getElementById("input[type=range]").onchange = function () {
//             painter.setLineWidth(this.value / 2);
//         };
// //获取color颜色绑定到画笔
//         document.getElementById("input[type=color]").onchange = function () {
//             painter.setLineColor(this.value);
//         };

    }
    init();
})();