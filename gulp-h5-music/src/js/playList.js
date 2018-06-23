/*require:
zepto.min.js
render.js
*/
;(function($, root){
    var $scope = $(document.body);
    var control;
    var $playBg = $("<div class='play-bg'>"+
        "<div class='bg'></div>"+
        "<div class='play-list'><div class='play-header'>播放列表</div>"+
        "<ul class='list-wrapper'></ul>"+
        "<div class='close-btn'>关闭</div></div>"+
        "</div>");
    var $playList = $playBg.find('.play-list');

    function renderList(songList){
        var html = '';
        for(var i=0;i<songList.length;i++){
            html += "<li><h3>"+songList[i].song+"</h3>-<span>"+songList[i].singer+"</span></li>";
        }
        $playList.find('.list-wrapper').html(html);
        $scope.append($playBg);
        bindEvent();
    }

    function show(controlmanager){
        control = controlmanager;
        $playList.addClass('show');
        $playBg.find('.bg').addClass('show-bg');
        signSong(controlmanager.index);
    }
    function signSong(index){
        $playList.find('.sign').removeClass('sign');
        $playList.find('.list-wrapper li').eq(index).addClass('sign');
    }
    function bindEvent(){
        $playBg.on('click', '.close-btn,.bg', function(){
            $playList.removeClass('show');
            $playBg.find('.bg').removeClass('show-bg');
        });
        $playList.on('click', 'li', function(){
            var index = $(this).index();
            signSong(index);
            control.index = index;
            $playList.trigger('play:change', [index, true]);
            $scope.find('.play-btn').addClass('playing');
            // setTimeout(function(){
            //     $playList.removeClass('show');
            //     $playBg.find('.bg').removeClass('show-bg');
            // },200);
        })        
    }
    root.playList ={
        renderList: renderList,
        show: show
    }
}(window.Zepto, window.player || (window.player = {})));