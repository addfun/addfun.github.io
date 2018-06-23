/*require:
zepto.min.js
render.js
*/
;(function($, root){
    var lyricData;
    var lyricTime;
    var $scope = $(document.body);
    var liH;
    var wrapH;
    var curDuration;
    var lastPrecent = 0;
    var frameTimer;
    var lastIndexLyric = 0;
    var lyricSecond = [];
    //将歌词时间分秒改为秒
    function formatTime(arr){
        for(var i=0,len=arr.length;i<len; i++){
            var m = arr[i].split(':');
            var s = Number((parseInt(m[0]) * 60 + parseFloat(m[1])).toFixed(1));
            lyricSecond.push(s);
        }
    }

    function renderLyric(duration, data){
        if(duration){
            curDuration = duration;
            lastPrecent = 0;
            lastIndexLyric = 0;
        }
        var liHtml = '<ul>';
        if(!data){
            $scope.find('.lyric-wrapper').html('<div class="no-lyric">暂无歌词！</div>');
        }else{
            lyricData = data.lyric;
            lyricTime = data.time;
            lyricSecond = [];
            for(var i=0, len=lyricData.length;i<len;i++){
                liHtml += '<li>'+lyricData[i]+'</li>'
            }
            liHtml +='</ul>';
            $scope.find('.lyric-wrapper').html(liHtml);
            liH = $scope.find('.lyric-wrapper ul li').height();
            wrapH = $scope.find('.lyric-wrapper').height();
            formatTime(lyricTime);
        }
    }
    function updata(precent){        
        var curTime = precent * curDuration;
        var indexLyric = returnIndex(curTime);
        if(lastIndexLyric !== indexLyric){
            $scope.find('.lyric-wrapper ul .active').removeClass('active');
            $scope.find('.lyric-wrapper ul').css({
                transform: 'translateY(-'+ ((indexLyric+2) * liH - wrapH) +'px)'
            }).find('li').eq(indexLyric).addClass('active')
        }
        lastIndexLyric = indexLyric;
    }
    function returnIndex(curTime){ 
        curTime = curTime.toFixed(1);
        for(var i=0,len=lyricSecond.length;i<len;i++){            
            if(lyricSecond[i]==curTime){
                return i;
            }
        }
        return lastIndexLyric;     
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
        lastPrecent = lastPrecent + (stopTime - startTime) / (curDuration*1000);
        cancelAnimationFrame(frameTimer);        
    }
    root.lyric = {
        renderLyric: renderLyric,
        updata: updata,
        start: start,
        stop: stop
    }
}(window.Zepto, window.player || (window.player = {})))