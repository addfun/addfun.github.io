/*require:
zepto.min.js
render.js
*/
;(function($, root){
    function controlManager(len){
        this.index = 0;
        this.len = len;
    }
    controlManager.prototype = {
        prev: function(){
            return this.getIndex(-1)
        },
        next: function(){
            return this.getIndex(1)
        },
        getIndex: function(val){
            var curIndex = (this.index + val + this.len) % this.len;
            this.index = curIndex;
            return curIndex;
        }
    }

    root.controlManager = controlManager;
}(window.Zepto, window.player || (window.player = {})));