

(function(global,doc,factory){
	global.L = global.L || {};
	global.L.comments = factory();
})(window,document,function(){
	var baseTpl = ['<div class="l_comments">',
		'<div class="l_com_sendBox"></div>',
		'<div class="l_com_list">',
		'</div>',
	'</div>'].join('');
	var sendBox_tpl = ['<div class="l_sendBox">',
		'<div class="l_sendBox_main">',
			'<div class="l_send_textarea">',
				'<textarea name="content" spellcheck="false"></textarea>',
				'<div class="l_send_placeholder">写点啥吧！</div>',
			'</div>',
			'<div class="l_send_tools">',
				'<div class="l_send_tools_left">',
					'<a href="#" class="l_send_face"></a>',
				'</div>',
				'<div class="l_send_tools_right">',
					'<a href="#" class="l_send_submit">发布</a>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="l_sendBox_side">',
			'<div class="l_sendBox_avatar">',
				'<img src="http://layasset.qiniudn.com/user/default.jpg" />',
				'<a href="javascript:void(0)" class="l_send_login">雁过留名</a>',
			'</div>',
			'<div class="l_sendBox_name"></div>',
		'</div>',
	'</div>'].join('');
	
	var item_tpl = ['<div class="l_com_item">',
		'<%=content %>,<%=time %>,<%=uid %>',
	'</div>',].join('');
	/**
	 * sendBox类
	 */
	function sendBox(dom){
		var me = this;
		this.dom = $(sendBox_tpl)[0];
		this.text = '';
		
		var $allDom = $(this.dom);
		var $textarea = $allDom.find('textarea');
		var $placeholder = $allDom.find('.l_send_placeholder');
		$textarea.on('keydown keyup input paste',function(){
			me.text = $(this).val();
		});
		$textarea.on('focus',function(){
			$allDom.addClass('l_sendBox_active');
			$placeholder.fadeOut(100);
		}).on('focusout',function(){
			if(me.text.length == 0){
				$allDom.removeClass('l_sendBox_active');
				$placeholder.fadeIn(100);
			}
		});
		
		function loginHandule(err,user){
			$allDom.find('.l_sendBox_name').html(user.username);
			if(user.avatar){
				$allDom.find('.l_sendBox_avatar img').attr('src',user.avatar);
			}
		}
		$(this.dom).on('click','.l_send_placeholder',function(){
			$textarea.focus();
		}).on('click','.l_send_login',function(){
			L.login('github',loginHandule);
		});
		$(dom).html($(this.dom));
	}
	sendBox.prototype = {};
	
	/**
	 * 列表类
	 *
	 */
	function list(dom){
		this.list = [];
		this.skip = 0;
		this.limit = 30;
		this.total = 0;
		this._status = 'normal';
		this.dom = dom;
		
		this.getMore();
	}
	list.prototype.getMore = function(callback){
		if(this._status == 'loading'){
			return;
		}
		var me = this;
		this._status = 'loading';
		$.ajax({
			'url' : '/ajax/comments/list',
			'success' : function(data){
				if(data.code && data.code == 200){
					var DATA = data.data;
					me.total = DATA.count;
					me.list.concat(DATA.list);
					var html = '';
					for(var i=0,total=DATA.list.length;i<total;i++){
						html += me.render(DATA.list[i]);
					}
					$(me.dom).append(html);
					if(me.total == 0){
						$(me.dom).append('<div class="l_com_list_noData">来的真早，快抢沙发！</div>');
					}
				}
			}
		});
	};
	list.prototype.render = L.tplEngine(item_tpl);
	
	
	return function(dom){
		
		this.dom = $(baseTpl)[0];
		new sendBox($(this.dom).find('.l_com_sendBox')[0]);
		new list($(this.dom).find('.l_com_list')[0]);
		dom.html($(this.dom));
	} 
});