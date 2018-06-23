/*require:
zepto.min.js
render.js
*/
;(function($, root){
    var $scope = $(document.body);
    var curDuration;
    var frameTimer = null;
    var startTime;
    var lastPrecent = 0;
    //把秒转化为分和秒
    function formatTime(duration){
        var minute = Math.floor(duration / 60);
        var second = Math.round(duration % 60);        
        if(minute < 10){
            minute = '0'+minute;
        }
        if(second < 10){
            second = '0'+second;
        }
        return minute + ':' + second;
    }
    function renderAllTime(duration){
        lastPrecent = 0;
        curDuration = duration;
        var allTime = formatTime(duration);
        $scope.find('.all-time').html(allTime);
    }

    function updata(precent){
        var curTime = precent * curDuration;
        curTime = formatTime(curTime);
        $scope.find('.cur-time').html(curTime);
        var precentage = lastPrecent + (precent - 1) * 100 + '%';
        $scope.find('.pro-top').css({
            transform: 'translateX(' + precentage +')'
        });
        
    }

    function start(precentage){
        lastPrecent = precentage ===undefined ? lastPrecent : precentage;
        cancelAnimationFrame(frameTimer);        
        startTime = new Date().getTime();
        function frame(){
            var curTime = new Date().getTime();
            var precent = lastPrecent + (curTime - startTime) / (curDuration*1000);
            if(precent <= 1){
                frameTimer = requestAnimationFrame(frame);
                updata(precent);
            }else{
                cancelAnimationFrame(frameTimer);
            }
        }
        frame();
    }
    function stop(){
        var stopTime = new Date().getTime();
        startTime = startTime === undefined ? stopTime : startTime;
        lastPrecent = lastPrecent + (stopTime - startTime) / (curDuration*1000);
        cancelAnimationFrame(frameTimer);        
    }

    root.processor = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        updata: updata
    }
}(window.Zepto, window.player || (window.player = {})));