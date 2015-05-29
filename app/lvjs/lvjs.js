~function($){
    $.lvcookie = {};
    $.lvcookie.set = function(name, value, options){
        options = options || {};
        var expires ='';
        if (options.expires && (typeof options.expires == 'number'|| options.expires.toUTCString)) {
            var date;
            if (typeof options.expires =='number') {
                date = new Date();
                date.setTime(date.getTime()+(options.expires*1000));
            } else {
                date = options.expires;
            }
            expires ='; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    };
    $.lvcookie.get = function(name){
        var value = '';
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    value = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return value;
    }
    $.lvcookie.empty = function(name){
        var date = new Date();
        date.setTime(date.getTime()-24*60*60*1000);
        var expires ='; expires=' + date.toUTCString();
        document.cookie = [name, '=', '', expires, '', '', ''].join('');
    };
}(jQuery);
~function($) {
    $.lvmask = {};
    $.lvmask.config = {opacity: 0.6, bgcolor: '#333'};
    $.lvmask.show = function(p){
        var config = $.lvmask.config;
        config = $.extend({}, config, p || {});
        $("<div class='lvjs-window-mask' style='position:absolute;left:0;top:0;width:100%;height:100%; filter:alpha(opacity=" + config.opacity*100 + ");opacity:" + config.opacity + ";background:" + config.bgcolor + ";font-size:1px; *zoom:1;overflow:hidden; display:block;z-index: 9000;'></div>").height($(document).height()).appendTo('body');
        jQuery(window).bind("resize", $.lvmask.resize);
    };
    $.lvmask.resize = function(){
        $(".lvjs-window-mask").height($(document).height());
    };
    $.lvmask.hidden = function(){
        $(".lvjs-window-mask").remove();
        jQuery(window).unbind("resize", $.lvmask.resize);
    };
    $.lvmask.hide = $.lvmask.hidden;
}(jQuery);
~function($) {
    $.fn.lvdrag = function(header) {
        var p = {
            onStartDrag: false,
            onDrag: false,
            onStopDrag: false,
            handler: ''
        };
        p.handler = header || '';
        return this.each(function() {
            if (this.useDrag) return;
            var g = {
                start: function(e) {
                    $('body').css('cursor', 'move');
                    g.current = {
                        target: g.target,
                        left: g.target.offset().left,
                        top: g.target.offset().top,
                        startX: e.pageX || e.screenX,
                        startY: e.pageY || e.clientY
                    };
                    g.handler.bind('mouseup', function(){g.stop();});
                    $(document).bind('mousemove', g.drag);
                    if (p.onStartDrag) p.onStartDrag(g.current, e);
                },
                drag: function(e) {
                    if (!g.current) return;
                    var pageX = e.pageX || e.screenX;
                    var pageY = e.pageY || e.screenY;
                    g.current.diffX = pageX - g.current.startX;
                    g.current.diffY = pageY - g.current.startY;
                    if (p.onDrag) {
                        if (p.onDrag(g.current, e) != false) {
                            g.applyDrag();
                        }
                    }else{
                        g.applyDrag();
                    }
                },
                stop: function(e) {
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                    $("body").css("cursor", "");
                    g.handler.css("cursor", "move");
                    if (p.onStopDrag) p.onStopDrag(g.current, e);
                    g.current = null;
                },
                //更新当前坐标
                applyDrag: function() {
                    g.current.diffX && g.target.css("left", (g.current.left + g.current.diffX));
                    g.current.diffY && g.target.css("top", (g.current.top + g.current.diffY));
                }
            };
            g.target = $(this);
            g.handler = p.handler.length == 0 ? $(this) : $(p.handler, this);
            g.handler.hover(function() {
                $('body').css('cursor', 'move');
            }, function() {
                $("body").css("cursor", "default");
            }).mousedown(function(e) { 
                g.start(e);
                return false;
            });
            this.useDrag = true;
        });
    };
}(jQuery);
~function($) {
    $.lvalert = {};
    $.lvalert.config = {
        msg : "Message！",
        type : "warning",
        isclose : false,
        autohidd : true,
        timeout : 0,
        top : 0,
        mask : 1,
        alpha : 0.5,
        background : "#bbb",
        cb : function(){}
    };
    $.lvalert.show = function(p){
        var config = $.lvalert.config;
        config = $.extend({}, config, p || {});
        if(config.mask){
            $.lvmask.show({opacity:config.alpha,bgcolor:config.background});
            if(config.autohidd){
                $(".lvjs-window-mask").click(function(){$.lvalert.hide();});
            }
        }else{
            $.lvmask.hidden();
        }
        var _s = $.lvalert;
        var alertbox = $("#lv_alertbox").attr('id') ? $("#lv_alertbox") : $("<div id='lv_alertbox' class='lv_alert_layer_wrap'></div>");
        $('body').append(alertbox);
        alertbox.html('');
        alertbox.append('<span class="lv_alert_layer" style="display:none;z-index:10000;" id="mode_tips_v2"><span class="gtl_ico_clear"></span><span class="gtl_ico_' + config.type + '"></span><span id="lvalert_msg">' + config.msg + '</span><span class="gtl_end"></span><span class="gtl_close"></span></span>');
        config.top>0 && alertbox.css('top', config.top + "px");
        config.type == 'loading' && $(".gtl_ico_clear").css('left', '-5px');
        if(config.isclose){
            var alertclose = $(".lv_alert_layer").find('.gtl_close');
            alertclose.show();
            alertclose.click(function(){_s.hide();});
        }else{
            $(".lv_alert_layer").find('.gtl_close').hide();
        }
        clearTimeout(_s._timer);
        $('.lv_alert_layer', alertbox).show();
        config.timeout && (_s._timer = setTimeout(function(){_s.hide(config.cb)}, config.timeout));
    };
    $.lvalert.success = function(p){
        var conf = {
            msg : "操作成功！",
            type : "success",
            isclose : false,
            timeout : 2000,
            autohidd : false
        };
        $.lvalert.show($.extend({}, conf, p || {}));
    };
    $.lvalert.error = function(p){
        var conf = {
            msg : "操作失败！",
            type : "fail",
            isclose : true,
            autohidd : true,
            timeout : 2000,
            mask : 0
        };
        $.lvalert.show($.extend({}, conf, p || {}));
    };
    $.lvalert.loading = function(p){
        var conf = {
            msg : "正在处理中，请稍等......",
            type : "loading",
            isclose : false,
            autohidd : false,
            mask : 1
        };
        $.lvalert.show($.extend({}, conf, p || {}));
    };
    $.lvalert.warning = function(p){
        var conf = {
            msg : "注意：提示",
            type : "warning",
            isclose : false,
            autohidd : true,
            mask : 1
        };
        $.lvalert.show($.extend({}, conf, p || {}));
    };
    $.lvalert.hide = function(cb) {
        $.lvmask.hidden();
        clearTimeout($.lvalert._timer);
        $('.lv_alert_layer', $("#lv_alertbox")).hide();
        if(cb){
            cb();
        }
    };
}(jQuery);
~function($) {
    var ZeroClipboard = {
        clients: {}, // registered upload clients on page, indexed by id
        nextId: 1, // ID of next movie
        dispatch: function(id, eventName, args) {       
            var client = this.clients[id];
            client && client.receiveEvent(eventName, args);
        },
        register: function(id, client) {
            this.clients[id] = client;
        },
        Client: function( targetID, textID, callback) {
            this.id = ZeroClipboard.nextId++;
            this.movieId = 'ZeroClipboardMovie_' + this.id;
            this.targetID = targetID;
            this.textID = textID;
            this.callback = callback;
            ZeroClipboard.register(this.id, this);
            this.init();
        },
        success: function(args){
            alert("复制成功:" + args + "！");
        }
    };
    ZeroClipboard.Client.prototype = {
        id: 0, // unique ID for us
        movie: null, // reference to movie object
        targetID: null,
        textID: null, // text to copy to clipboard
        callback: null,
        handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
        
        init: function() {
            this.targetObj = $("#" + this.targetID);
            this.textObj = $("#" + this.textID);
            this.targetObj[0].innerHTML = this.getHTML( this.targetObj.width(), this.targetObj.height() );
        },
        getHTML: function(width, height) {
            var html = '';
            var flashvars = 'id=' + this.id + '&width=' + width + '&height=' + height;
            if (navigator.userAgent.match(/MSIE/)) {
                var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
                html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
            }else {
                html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
            }
            return html;
        },
        setText: function(newText) {
            this.movie.setText(newText);
        },
        setHandCursor: function(enabled) {
            this.handCursorEnabled = enabled;
            this.movie.setHandCursor(enabled);
        },
        receiveEvent: function(eventName, args) {
            eventName = eventName.toString().toLowerCase().replace(/^on/, '');
            if(eventName == 'complete'){
                if(this.callback){
                    this.callback(args);
                }else{
                    ZeroClipboard.success(args);
                }
            }else if(eventName == 'load'){
                this.movie = document.getElementById(this.movieId);
                if (!this.movie || this.movie == null) {
                    var self = this;
                    setTimeout( function() { self.receiveEvent('load', null); }, 1 );
                    return false;
                }else{
                    this.movie.setHandCursor( this.handCursorEnabled );
                }
            }else if(eventName == 'mousedown'){
                this.movie.setText( this.textObj.val() );
                this.targetObj.data("events")['mousedown'] && this.targetObj.trigger('mousedown');
            }else{
                this.targetObj.data("events")[eventName] && this.targetObj.trigger(eventName);
            }
        }
    };
    $.lvcopy = {};
    $.lvcopy.init = function(p){
        var config = {
            targetID : null,
            textID : null,
            moviePath : './images/ZeroClipboard.swf',
            callback : null
        };
        var config = $.extend(config, p || {});
        ZeroClipboard.moviePath = config.moviePath;
        new ZeroClipboard.Client(config.targetID, config.textID, config.callback);
    };
}(jQuery);
~function($){
    $.lvpop = {};
    $.lvpop.initstatus = false;
    $.lvpop.config = {
        title : "提示信息",
        shade : true,
        opacity : 0.6,
        drag : false,
        width : 400,
        height : 150,
        html : "",
        yesfun : false,
        nofun : false
    };
    $.lvpop.show = function(options){
        var config = $.lvpop.config;
        config = $.extend({}, config, options || {});
        if(!this.initstatus){
            $("body").append("<div id='prompt'><span id='prompt_close'></span><div id='prompt_title'></div><div id='prompt_body'></div><div id='prompt_bottom'></div></div>");
            $("#prompt_close").bind('click', this.hide);
            this.initstatus = true;
        }
        if(config.title.length>0){
            $("#prompt_title").text(config.title);
            if(config.drag){ 
                $("#prompt").lvdrag("#prompt_title");
            }else{
                $("#prompt_title").css('cursor', 'default');
            }
            $("#prompt_title").css('display', 'block');
        }else{
            $("#prompt_title").css('display', 'none');
        }
        if(config.html.length>0){
            $("#prompt_body").html(config.html);
        }
        if(config.yesfun){
            var that = this;
            if(config.nofun){
                $("#prompt_bottom").html("<a class='btn' id='ConfirmFun'>确定</a><a class='btn' id='CancelFun'>取消</a>");
                $("#ConfirmFun").bind('click', function(){
                    that.hide();
                    config.yesfun();
                });
                $("#CancelFun").bind('click', function(){
                    that.hide();
                    config.nofun();
                });
            }else{
                $("#prompt_bottom").html("<a class='btn' id='ConfirmFun'>确定</a>");
                $("#ConfirmFun").bind('click', function(){
                    that.hide();
                    config.yesfun();
                });
            }
            $("#prompt_bottom").css('display', 'block');
        }else{
            $("#prompt_bottom").html("");
            $("#prompt_bottom").css('display', 'none');
        }
        if(config.shade){
            $.lvmask.show();
        }
        var bodyHeight = document.documentElement.clientHeight  || document.body.clientHeight;
        var bodyWidth = document.documentElement.clientWidth  || document.body.clientWidth;
        $("#prompt").css('width', config.width);
        $("#prompt").css('height', config.height);
        $("#prompt").css('left', bodyWidth/2-config.width/2);
        $("#prompt").css('top', bodyHeight/2-config.height/2);
        $("#prompt").show();
        if(this.IE6()) $("#prompt").append(this.createIframe());    //ie6添加iframe
    };
    $.lvpop.hide = function(){
        $("#prompt").hide();
        $.lvmask.hide();
    };
    $.lvpop.IE6 = function(){
        return !!window.ActiveXObject && !window.XMLHttpRequest;
    };
}(jQuery);