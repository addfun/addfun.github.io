/*require:
render.js
playList.js
controManager.js
audioManager.js
processor.js
lyric.js
*/

var $ = window.Zepto;
var root = window.player;
var songList;
var $scope = $(document.body);
var controlmanager;
var audio = new root.audioManager();

function bindClick(){
    $scope.on('play:change',function(e, index, flag){
        audio.setAudioSource(songList[index].audio);
        if(audio.status === 'play' || flag){
            audio.play();
            root.processor.start();
            root.lyric.start();                                
        }
        // audio.audio.oncanplay = function(){//加载资源后获取资源的总时长
        //     root.processor.renderAllTime(parseInt(this.duration));
        // }
        root.processor.renderAllTime(songList[index].duration);        
        root.processor.updata(0);
        // root.lyric.renderLyric(songList[index].duration);        
        getLyric(songList[index].lyric, index);
        root.lyric.updata(0);        
        root.render(songList[index]);        
    })
    //移动端clcik有300mm延迟
    $scope.on('click', '.prev-btn', function(){ 
        var index = controlmanager.prev();
        $scope.trigger('play:change', index);
    })
    $scope.on('click', '.next-btn', function(){
        var index = controlmanager.next();
        $scope.trigger('play:change', index);
    })
    $scope.on('click', '.play-btn', function(){
        if(audio.status == 'play'){
            root.processor.stop();
            root.lyric.stop();                    
            audio.pause();
        }else{
            root.processor.start();
            root.lyric.start();
            audio.play();
        }
        $(this).toggleClass('playing');
    })
    $scope.on('click','.list-btn', function(){
        root.playList.show(controlmanager);
    })
}
function bindTouch(){
    var $slidePoint = $scope.find('.slider-point');
    var $proWrapper = $scope.find('.pro-wrapper');
    var proOffset = $scope.find('.pro-wrapper').offset();
    $slidePoint.on('touchstart', function(e){
        e.stopPropagation();
        root.processor.stop();
        root.lyric.stop();
    }).on('touchmove', function(e){
        var mouseX = e.changedTouches[0].clientX;
        var percent = (mouseX - proOffset.left) / proOffset.width;
        if(percent>1){
            percent = 1;
        }else if(percent<0){
            percent = 0;
        }
        root.processor.updata(percent);
        root.lyric.updata(percent);
    }).on('touchend', function(e){
        var mouseX = e.changedTouches[0].clientX;
        var percent = (mouseX - proOffset.left) / proOffset.width;
        if(percent>1){
            percent = 1;
        }else if(percent<0){
            percent = 0;
        }
        var curDuration = songList[controlmanager.index].duration;
        var curTime = curDuration * percent;
        audio.jumpToplay(curTime);
        root.processor.start(percent);
        root.lyric.start(percent);
        $scope.find('.play-btn').addClass('playing');
    })
    $proWrapper.on('touchstart', function(e){
        var mouseX = e.changedTouches[0].clientX;
        var percent = (mouseX - proOffset.left) / proOffset.width;
        if(percent>1){
            percent = 1;
        }else if(percent<0){
            percent = 0;
        }
        var curDuration = songList[controlmanager.index].duration;
        var curTime = curDuration * percent;
        audio.jumpToplay(curTime);
        root.processor.start(percent);
        root.lyric.start(percent);
        $scope.find('.play-btn').addClass('playing');
    })
}
function getData(url){
    $.ajax({
        type: 'get',
        url: url,
        success: function(data){
            songList = data;
            root.playList.renderList(data);
            controlmanager = new root.controlManager(data.length);
            bindClick();
            bindTouch();
            $scope.trigger('play:change', 0);            
        },
        error: function(){
            console.log('error');
        }
    })
}

getData('../../mock/data.json');

function getLyric(url, index){
    $.ajax({
        type: 'get',
        url: url,
        success: function(data){
            root.lyric.renderLyric(songList[index].duration, data); 
            console.log(data)
        },
        error: function(){
            root.lyric.renderLyric();
        }
    })
}
