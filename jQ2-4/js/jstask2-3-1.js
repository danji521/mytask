//提取数据
var playerArray = JSON.parse(sessionStorage.getItem("player")); //提取牌组
console.log(playerArray)
var civilian = sessionStorage.getItem("life"); //平民
var killer = sessionStorage.getItem("kill"); //杀手

//定义天数
if (sessionStorage.getItem("days")) {
    var days = +sessionStorage.getItem("days");
} else {
    var days = 1;
}
console.log(days)
//提取杀死数组
if (sessionStorage.getItem("chosingplayers")) {
    var killDead = JSON.parse(sessionStorage.getItem("chosingplayers"));
} else {
    var killDead = [];
}
console.log(killDead);
//提取被投死的玩家信息
if (sessionStorage.getItem("chosedplayers")) {
    var voteDead = JSON.parse(sessionStorage.getItem("chosedplayers"));
} else {
    var voteDead = [];
}
console.log(voteDead);
//定义状态
if (sessionStorage.getItem("step")) {
    var step = sessionStorage.getItem("step");
} else {
    var step = null;
}
console.log(step)
//创建改变第几天数字的数组
var daysArray = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
//切换天数,根据天数生成
for (let i = 1; i < days; i++) {
    $(".items").eq(0).clone(true).appendTo("main");
    $(".number").eq(i).text(daysArray[i + 1]);
}
for (let i = 0; i < days - 1; i++) {
    $(".cut").eq(i).text(killDead[i] + 1 + '号被杀死，真实身份是' + playerArray[killDead[i]]) //显示杀人信息
    $(".push").eq(i).text(voteDead[i] + 1 + '号被杀死，真实身份是' + playerArray[voteDead[i]]) //显示投票信息
}
//修改当前杀人信息
if(killDead[days - 1]!=undefined){
$(".cut").eq(days - 1).text(killDead[days - 1]+ 1 + '号被杀死，真实身份是' + playerArray[killDead[days - 1]]);
}
//第一天的样式
if (days == 1) {
    if (killDead[0] == undefined) {
        $(".cut").eq(0).text('');
    } else {
        $(".cut").eq(0).text(killDead[0] + 1 + '号被杀死，真实身份是' + playerArray[killDead[0]]);
    }
}
//创建执行顺序状态机
var fsm = new StateMachine({
    //当前状态
    init: "live",
    //状态转换
    transitions: [{
            name: "killings",
            from: "live",
            to: "one"
        },
        {
            name: "deads",
            from: "one",
            to: "two"
        },
        {
            name: "decuments",
            from: "two",
            to: "three"
        },
        {
            name: "votes",
            from: "three",
            to: "live"
        }
    ],
    //构造状态机的方法
    methods: {
        /* 如果状态转换不能正常转换就会触发下面的错误处理机制 */
        onInvalidTransition: function (transitions, from, to) {
            switch (from) {
                case "live":
                    alert("请点击杀手杀人");
                    break;
                case "one":
                    alert("请点击亡灵发表遗言");
                    break;
                case "two":
                    alert("请点击玩家依次发言");
                    break;
                case "three":
                    alert("请点击请点击全民投票");
                    break;
            }
        }
    }
});
//自运行事件
$(function () {
    if (days > 0) {

        for (let i = 0; i < days - 1; i++) {
            $(".menu").eq(i).css("display", "none");
            $(".items").eq(i).find("button").css("background-color", "rgb(31, 186, 110)");
            $('.items').eq(i).find('i').css("border-right", ".1rem solid #1fba6e");
            $(".items").eq(i).find("button").on("click", function () {
                alert("请返回当天的操作")
            })
        }
        //判断步骤为第几步时运行哪一步
        switch (step) {
            case "1":
                fsm.killings();
                for (let i = 0; i < days; i++) {
                    $(".killing").eq(i).css("background-color", "#1fba6e");
                    $(".first").eq(i).css("border-right", ".1rem solid #1fba6e");
                }
                break;
            case "2":
                fsm.killings();
                fsm.deads();
                for (let i = 0; i < days; i++) {
                    $(".killing").eq(i).css("background-color", "#1fba6e");
                    $(".first").eq(i).css("border-right", ".1rem solid #1fba6e");
                    $(".dead").eq(i).css("background-color", "#1fba6e");
                    $(".second").eq(i).css("border-right", ".1rem solid #1fba6e");
                }
                break;
            case "3":
                fsm.killings();
                fsm.deads();
                fsm.decuments();
                for (let i = 0; i < days; i++) {
                    $(".killing").eq(i).css("background-color", "#1fba6e");
                    $(".first").eq(i).css("border-right", ".1rem solid #1fba6e");
                    $(".dead").eq(i).css("background-color", "#1fba6e");
                    $(".second").eq(i).css("border-right", ".1rem solid #1fba6e");
                    $(".decument").eq(i).css("background-color", "#1fba6e");
                    $(".third").eq(i).css("border-right", ".1rem solid #1fba6e");
                }
                break;
            case "4":
                step = null;
                break;
        }
    }
    //显示或隐藏按钮
    for (let i = 0; i < days; i++) {
        $(".days").eq(i).on("click", function () {
            $(".menu").eq(i).toggle();
        })
    }
})

//四按钮点击事件
//杀人按钮
$('.killing').eq(days - 1).click(function () {
    if (fsm.can('killings')) {
        step = 1;
        sessionStorage.setItem("step", step);
        location = 'jstask2-3-2.html';
    }
    fsm.killings();
})
//亡灵按钮
$('.dead').eq(days - 1).click(function () {
    if (fsm.can("deads")) {
        step = 2;
        sessionStorage.setItem("step", step);
        for (let i = 0; i < days; i++) {
            $(".dead").eq(i).css("background-color", "#1fba6e");
            $(".second").eq(i).css("border-right", ".1rem solid #1fba6e");
        }
        alert("亡灵发表遗言");
    }
    fsm.deads();
})
//发言按钮   
$('.decument').eq(days - 1).click(function () {
    if (fsm.can('decuments')) {
        step = 3;
        sessionStorage.setItem("step", step);
        for (let i = 0; i < days; i++) {
            $(".decument").eq(i).css("background-color", "#1fba6e");
            $(".third").eq(i).css("border-right", ".1rem solid #1fba6e");
        }
        alert("玩家依次发言");
    }
    fsm.decuments();
})
//投票按钮
$('.vote').eq(days - 1).click(function () {
    if (fsm.can('votes')) {
        step = 0;
        sessionStorage.setItem("step", step);
        location = 'jstask2-3-3.html';
    }
    fsm.votes();
})
//存储
sessionStorage.setItem("days", days); //天数
sessionStorage.setItem("chosedplayers", JSON.stringify(voteDead)); //投死信息
sessionStorage.setItem("chosingplayers", JSON.stringify(killDead)); //杀人信息
sessionStorage.setItem("daysArray", JSON.stringify(daysArray)); //天数数组



//结束游戏返回选人页面
function back() {
    sessionStorage.clear();
    location = "../jstask2-1/jstask2-1-2.html";
}

//结束游戏返回主页面
function home() {
    if (confirm("确定退出游戏么？")) {
        sessionStorage.clear();
        location = "../jstask2-1/jstask2-1-1.html";
    }
}