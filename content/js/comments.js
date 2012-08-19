var Ui = {
	init: function() {
		this.load_count = 0;
		this.first_load = true;
		this.last_id = null;
		this.prev_time = null;
		this.refresh();

		this.refresh.periodical(30000, this);

		this.load_cookies();
		this.load_votes();
		this.set_loginbar();

		this.comment_elements = {};
	},

	set_loginbar: function() {
		if(this.modhash != null) {
			$('user-bar').addClass('in').removeClass('out');
			$('ub-username').innerHTML = this.username;
			$('ub-username').href = 'http://reddit.com/user/' + this.username;
		} else {
			$('user-bar').addClass('out').removeClass('in');
		}
	},

	load_cookies: function() {
		this.modhash = Cookie.read('reddit_modhash');
		this.username = Cookie.read('reddit_username');
	},

	refresh: function() {
		var request_url = 'http://www.reddit.com/comments/' + _thread_id + '.json?sort=new&limit=50'

		new Request.JSONP({
			'url':request_url,
			'callbackKey':'jsonp',
			'onComplete': function(data){
				var post_info = data[0].data.children[0];
				var comments = this.split_comments(data[1].data.children.reverse());
				var was_bottom = this.is_at_bottom();

				if(this.first_load) {
					$('c-list').empty();
				}

				this.add_comments(comments.new_list);
				this.refresh_comments(comments.old_list);

				if(this.load_count % 5 == 0) {
					// we only want to reload the page destription every so often
					// because we loose the scroll position when this happens...
					this.set_post_info(post_info);
				}

				if(this.first_load) {
					this.set_page_info(post_info);
					this.report_stats(post_info.data.title);
					this.first_load = false;
				}

				if(comments.new_list.length > 0) {
					this.last_id = comments.new_list.getLast().data.id;
				}

				if(was_bottom) {
					window.scrollTo(0, document.body.scrollHeight);
				}

				this.load_count++;

			}.bind(this)
		}).send();
	},

	load_previous: function() {
		alert('test');
	},

	is_at_bottom: function() {
		var totalHeight, currentScroll, visibleHeight;

		if (document.documentElement.scrollTop) {
			currentScroll = document.documentElement.scrollTop;
		} else {
			currentScroll = document.body.scrollTop;
		}

		totalHeight = document.body.offsetHeight;
		visibleHeight = document.documentElement.clientHeight;

		return totalHeight <= (currentScroll + visibleHeight);
	},

	// splits the array of comments returned by the server into those that are already on the page
	// and those that aren't.
	//
	// returns {new_list: [], old_list: []}
	split_comments: function(comments) {

		// if there is no id stored, then everything will be new (must be the
		// first load)
		var in_new = (this.last_id === null);
		var result = {'new_list':[], 'old_list':[]};

		for(var i=0; i < comments.length; i++) {
			if(in_new) {
				result.new_list.push(comments[i]);
			} else {
				result.old_list.push(comments[i]);
			}

			if(comments[i].data.id == this.last_id) {
				in_new = true;
			}
		}

		return result;

	},

	set_post_info: function(post_info) {
		if(post_info.data.selftext_html != null) {
			$('post-info').innerHTML = post_info.data.selftext_html.decodeEntities();
		} else {
			$('post-info').hide();
		}

		// set this in here, instead of in page_info, so that it updates as the
		// thread refreshs
		$('ps-count').innerHTML = post_info.data.num_comments;
	},

	set_page_info: function(post_info) {

		$e('a', {
			'text':post_info.data.title,
			'href':'http://www.reddit.com' + post_info.data.permalink
		}).inject('post-title');

		$('ps-author').innerHTML = post_info.data.author;
		$('ps-author').href = 'http://www.reddit.com/user/' + post_info.data.author;


		$('ps-count').href = 'http://www.reddit.com' + post_info.data.permalink;

		$('ps-subreddit').innerHTML = '/r/' + post_info.data.subreddit;
		$('ps-subreddit').href = 'http://www.reddit.com/r/' + post_info.data.subreddit;

		document.title = post_info.data.title + ' - reddit-stream';
	},

	add_comments: function(comments, insert_into, is_root) {


		comments = comments || [];
		insert_into = insert_into || 'c-list';
		if(!$defined(is_root)) {
			is_root = true;
		}

		for(var i=0; i < comments.length; i++) {
			var item = comments[i];
			if(!$defined(item.data.body)) {
				continue;
			}

			var date_string = (new Date(item.data.created_utc * 1000)).format('%X');
			var show_time = false;
			if(this.prev_time != date_string) {
				show_time = true;
				this.prev_time = date_string;
			}

			// only try to create the comment if one with the same id doesn't
			// exist on the page already. This can happen after the user comments
			// and we refresh the data from the server - we will get their own comment
			// back at us, even though it is already on the page
			if($('c-' + item.data.id) == null) {

				if(this.upvoted.contains(item.data.id)) {
					item.data.likes = true;
				} else if(this.downvoted.contains(item.data.id)) {
					item.data.likes = false;
				}

				this.comment_elements[item.data.id] = new CommentElement(
					insert_into,
					item.data, {
						'first_load': this.first_load,
						'is_root': is_root,
						'show_time': show_time
					}
				);
			}

			if(is_root && item.data.replies != '') {
				this.add_comments(item.data.replies.data.children, 'c-rpl-' + item.data.id, false)
			}
		}
	},

	// every time we refresh the data the vote counts etc for already
	// displayed comments needs to be updated. The main reason to do this
	// is to display a highlighted link if there are new replies
	refresh_comments: function(comments) {
		for(var i=0; i < comments.length; i++) {
			var comment = comments[i];
			var ce = this.comment_elements[comment.data.id];

			if(ce == null || comment == null || comment.kind != 't1') {
				continue;
			}

			ce.updateData(comment.data);

			if(comment.data.replies != null && comment.data.replies != '') {
				// be sure to update all the replies as well
				var replies = comment.data.replies.data.children;
				this.refresh_comments(replies, replies.length);
			}
		}
	},

	all_info: function() {
		$('sidebar').addClass('expanded');
	},

	refresh_replies: function(parent_id) {
		var replies_elem = $('c-rpl-' + parent_id);
		var refresh_link = $('c-' + parent_id).getElement('.r-link');
		var request_url = 'http://www.reddit.com/comments/' + _thread_id + '/_/' + parent_id + '.json?limit=50'

		replies_elem.empty();
		$e('div.loading', 'loading...').inject(replies_elem);

		refresh_link.innerHTML = 'refresh';
		refresh_link.removeClass('has-replies');

		this.comment_elements[parent_id].new_form = null;

		new Request.JSONP({
			'url':request_url,
			'callbackKey':'jsonp',
			'onComplete': function(data){
				replies_elem.empty();
				var comment = data[1].data.children[0];

				if(comment.data.replies != '') {
					var replies = comment.data.replies.data.children;
					this.add_comments(replies, replies_elem, false);
				}
			}.bind(this)
		}).send();
	},

	login: function(username, password) {

		var req = new ProxiedRequest({
			'url': 'http://www.reddit.com/api/login/' + username,
			'onSuccess': function(response) {
				if(response.json.errors.length != 0) {
					$('ld-error').innerHTML = response.json.errors[0][1];
				} else {
					this.username = username;
					this.modhash = response.json.data.modhash;
					Cookie.write('reddit_session', response.json.data.cookie, {duration: 14});
					Cookie.write('reddit_modhash', response.json.data.modhash, {duration: 14});
					Cookie.write('reddit_username', this.username, {duration: 14});

					$('login-dialog').hide();

					this.set_loginbar();
				}

				$('ld-submit').disabled = false;
				$('ld-submit').value = 'login';
			}.bind(this)
		}).post({
			'user': username,
			'passwd': password,
			'api_type': 'json'
		});
	},

	logout: function() {

		Cookie.dispose('reddit_modhash');
		Cookie.dispose('reddit_session');
		Cookie.dispose(_thread_id+'-uv');
		Cookie.dispose(_thread_id+'-dv');

		window.location.reload();
	},

	vote: function(id, name, direction) {

		if(this.modhash == null) {
			// user is not logged in. Can't vote until that happens, so
			// show the login dialog
			this.show_login();
			return;
		}

		var ce = this.comment_elements[id];

		// how much will the total vote count change?
		var change = null;
		var cur_vote = null;
		var new_vote = null;

		if(this.upvoted.indexOf(id) != -1) {
			cur_vote = 1;
		} else if(this.downvoted.indexOf(id) != -1) {
			cur_vote = -1;
		} else {
			cur_vote = 0;
		}

		if(direction == cur_vote) {
			// reversing the current vote
			new_vote = 0;
			change = -cur_vote;
		} else if(direction == -cur_vote) {
			// invert the vote. ie downvote -> upvote and v.v.
			new_vote = direction;
			change = 2 * direction;
		} else {
			// there are no existing votes. this is the simplest case
			new_vote = direction;
			change = direction;
		}

		if(new_vote == 1) {
			this.upvoted.push(id);
			this.downvoted.erase(id);
		} else if(new_vote == -1) {
			this.upvoted.erase(id);
			this.downvoted.push(id);
		} else {
			this.downvoted.erase(id);
			this.upvoted.erase(id);
		}

		ce.updateVoteButtons(new_vote);
		ce.updateVote(change);

		var req = new ProxiedRequest({
			'url': 'http://www.reddit.com/api/vote',
			'onSuccess': function(response) {
				if(JSON.encode(response) != JSON.encode({})) {
					alert('Error: Could not save vote');
				} else {
					this.save_votes();
				}
			}.bind(this)
		}).post({
			'id': name,
			'dir': direction,
			'uh': this.modhash
		});
	},

	save_votes: function() {
		if(this.upvoted != null && this.downvoted != null) {
			var cookie_path = '/comments/' + _thread_id + '/';
			Cookie.write(_thread_id+'-uv', JSON.encode(this.upvoted), {duration: 14, path:cookie_path});
			Cookie.write(_thread_id+'-dv', JSON.encode(this.downvoted), {duration: 14, path:cookie_path});
		}
	},

	load_votes: function() {
		this.upvoted = JSON.decode(Cookie.read(_thread_id + '-uv') || '[]');
		this.downvoted = JSON.decode(Cookie.read(_thread_id + '-dv') || '[]');
	},

	show_login: function() {
		$('ld-username').value = '';
		$('ld-password').value = '';
		$('ld-error').value = '';

		$('ld-submit').value = 'login';
		$('ld-submit').disabled = false;

		$('login-dialog').show();
		$('ld-username').focus();
	},

	start_login: function() {
		var username = $('ld-username').value.trim();
		var password = $('ld-password').value.trim();

		if(username != '' && password != '') {
			$('ld-submit').disabled = true;
			$('ld-submit').value = 'loading...';
			this.login(username, password);
		}
	},

	change_layout: function() {
		$('sidebar').toggleClass('on-top');

		if($('sidebar').hasClass('on-top')) {
			$('pi-layoutlink').innerHTML = 'change to multi-column mode';
		} else {
			$('pi-layoutlink').innerHTML = 'change to single-column mode';
		}
	},

	report_stats: function(title) {
		if(_send_title) {
			new Request.JSON({'url': _fs_root + '/pageusage/increment/' + _thread_id}).get({'title': title});
		}
	},

	new_comment: function(id) {
		if(this.modhash == null) {
			this.show_login();
			return;
		}

		this.comment_elements[id].startReply();
	},

	new_root_comment: function() {
		if(this.modhash == null) {
			this.show_login();
			return;
		}

		var ce = new CommentElement('c-list', {
			'id':_thread_id,
			'name':'t3_'+_thread_id,
			'author': this.username
			},
			{
				'no_element': true
			});
		ce.startReply('footerbar');

	}
}

var CommentElement = new Class({

	initialize: function(container, data, options) {
		this.container = $(container);
		this.data = data;
		this.options = options || {};

		this.options.template = this.options.template || 'tmpl-comment';
		this.options.form_template = this.options.form_template || 'tmpl-addcomment';
		this.options.modhash = this.options.modhash || Ui.modhash || null;
		this.options.insert_position = this.options.insert_position || 'bottom';

		this.options.is_root = $defined(this.options.is_root)? this.options.is_root : true;
		this.options.show_time = $defined(this.options.show_time)? this.options.show_time : false;
		this.options.no_element = $defined(this.options.no_element)? this.options.no_element : false;

		if(!$defined(container) || !$defined(data)) {
			throw 'Must define a container element and pass in data';
		}

		if(!this.options.no_element) {
			this.normalizeData();
			this.element = this.createElement().inject(this.container, this.options.insert_position);
		}

	},

	createElement: function() {

		var jst = new JsTemplate(this.options.template);
		var e = jst.render(this.data);

		if(this.data.has_image) {
			e.addClass('has-image');
			this.body_element = e.getElement('.c-body');
			this.body_element.addEvent('click', this.toggleImage.bind(this));
		}

		if(!this.options.first_load) {
			// not the first element? then fade it in
			e.style.opacity = '0';
			e.fade();
		}

		this.upvote_link = e.getElement('.uv-link');
		this.downvote_link = e.getElement('.dv-link');
		this.comment_body = e.getElement('.c-body');
		this.new_form = null;

		return e;
	},

	normalizeData: function() {

		this.data.raw_html = this.data.body_html.decodeEntities();
		this.data.created_utc_date = new Date(this.data.created_utc * 1000);
		this.data.formatted_time = this.data.created_utc_date.format('%X');
		this.data.time_hidden = 'hidden';
		this.data.karma = this.data.ups - this.data.downs;
		this.data.points = this.format_points(this.data.karma);
		this.data.see_replies_link = 'refresh';

		this.data.upvoted = this.data.likes === true? 'has-voted' : '';
		this.data.downvoted = this.data.likes === false? 'has-voted' : '';

		if(this.options.show_time) {
			this.data.time_hidden = '';
		}

		if(!this.options.is_root && this.data.replies != '' && this.data.replies != null) {
			// we have replies, but are not going to load them because we are already too deep
			// so just flag the refresh link and move on
			this.data.hasreplies = 'has-replies';
			this.data.see_replies_link = 'load replies (' + this.data.replies.data.children.length + ')';
		}

		// if the comment has a link directly to an image in it, we want to be able to
		// show the image, just by clicking on the post. This extracts the data to do that
		var image_regex = /(http:.+\.(png|jpg|gif))/i;
		var match = image_regex.exec(this.data.body);

		if(match != null) {

			this.image_visible = false;
			this.data.has_image = true;
			this.data.image_url = match[1];
		} else {
			this.data.has_image = false;
		}
	},

	updateData: function(new_data) {

		new_data.karma = new_data.ups - new_data.downs;
		this.element.getElement('.c-points').innerHTML = '(' + this.format_points(new_data.karma) + ')';

		if(new_data.replies != null && new_data.replies != '') {

			// if we  have new replies, then update the count on the page
			var new_reply_count = new_data.replies.data.children.length;
			var cur_reply_count = 0;

			if(this.data.replies != '') {
				cur_reply_count = this.data.replies.data.children.length;
			}

			if(cur_reply_count != new_reply_count) {
				var refresh_link = this.element.getElement('.r-link');
				refresh_link.innerHTML = 'load replies (' + new_reply_count + ')';
				refresh_link.addClass('has-replies');
			}
		}

		new_data.has_image = this.data.has_image;
		new_data.image_url = this.data.image_url;

		this.data = new_data;
	},

	updateVote: function(change) {
		var e = this.element.getElement('.c-points');
		this.data.karma += change;
		e.innerHTML = '(' + this.format_points(this.data.karma) + ')';
	},

	updateVoteButtons: function(new_vote) {
		if(new_vote == 1) {
			this.upvote_link.addClass('has-voted');
			this.downvote_link.removeClass('has-voted');
		} else if(new_vote == -1) {
			this.upvote_link.removeClass('has-voted');
			this.downvote_link.addClass('has-voted');
		} else {
			this.upvote_link.removeClass('has-voted');
			this.downvote_link.removeClass('has-voted');
		}
	},

	format_points: function(count) {
		if(count == 1) {
			return count + ' point';
		} else {
			return count + ' points';
		}
	},

	toggleImage: function() {

		if(!$defined(this.image_element)) {

			this.image_element = $e('div.c-image', [
				$e('a', {
					'href':this.data.image_url,
					'children': [$e('img', {'src':this.data.image_url})]
				})
			]);

			this.image_element.inject(this.body_element);
		}

		if(this.image_visible == false) {
			this.image_element.show();
			this.image_visible = true;
		} else {
			this.image_element.hide();
			this.image_visible = false;
		}
	},

	startReply: function(form_parent) {
		form_parent = form_parent || this.comment_body;

		if(this.new_form == null) {
			this.new_form = (new JsTemplate(this.options.form_template)).render({});
			this.new_form.getElement('.cn-cancelbutton').addEvent('click', this.cancelReply.bind(this));
			this.new_form.getElement('form').addEvent('submit', function() {this.saveReply(); return false;}.bind(this));
			this.new_form.inject(form_parent, 'after')

			this.form_input = this.new_form.getElement('textarea');
		} else {
			this.new_form.getElement('form').reset();
			save_button.disabled = false;
			save_button.value = 'save';
			this.new_form.show();
		}

		this.form_input.focus();
	},

	cancelReply: function() {
		this.new_form.hide();
	},

	saveReply: function() {
		var save_button = this.new_form.getElement('input[type=submit]');

		save_button.disabled = true;
		save_button.value = 'saving...';
		post_text = this.form_input.value.trim();

		if(post_text == '') {
			return;
		}

		var req = new ProxiedRequest({
			'url': 'http://www.reddit.com/api/comment',
			'onSuccess': function(response) {
				var data = null;
				this.new_form.hide();

				if(response.jquery.length >= 30) {
					data = response.jquery[30][3][0][0].data;
				} else if(response.jquery.length >= 18) {
					data = response.jquery[18][3][0][0].data;
				}

				if(!$defined(data) || data == null) {
					alert('Error: Could not save comment');
					return;
				}

				this.addOwnComment(data);

			}.bind(this)
		}).post({
			'parent': this.data.name,
			'text': post_text,
			'uh': this.options.modhash
		});
	},

	addOwnComment: function(raw_data) {
		var insert_into = null;
		var insert_position = 'top';

		if(this.element == null) {
			insert_into = this.container;
			insert_position = 'bottom';
		} else {
			insert_into = this.element.getElement('.c-replies');
		}

		// if this is a no-element comment, then will we insert the new comment into the container root

		// when adding a comment the data we get back is not normal, so we need to
		// get it into the correct format first.
		var data = {};
		data.id = raw_data.id.split('_')[1];
		data.name = raw_data.id;
		data.body = raw_data.contentText;
		data.body_html = raw_data.contentHTML;
		data.replies = null;
		data.created_utc = Math.round((new Date()).getTime() / 1000);
		data.ups = 1
		data.downs = 0;
		data.likes = true;
		data.author = Ui.username; // FIXME: remove this dependecny


		var ce = new CommentElement(insert_into, data, {'insert_position': insert_position});

		// FIXME: due to poor design, we need to insert this into the parent list as well
		// so lets just reference explicitly for now, even though it is bad coupling
		Ui.comment_elements[data.id] = ce;
		Ui.upvoted.push(data.id);
		Ui.save_votes.bind(Ui)();
	}

});

var ProxiedRequest = new Class({
	Extends: Request.JSON,

	initialize: function(options) {
		options = options || {};
		user_agent = 'Mozilla/5.0 (Php 5.3; reddit-stream.com; en-us) reddit-stream.com (xhr via proxy)';

		options.url = '/redditstream/shared/proxy-wrapper.php?user_agent=' + user_agent + '&send_cookies=1&mode=native&url=' + escape(options.url);

		this.parent(options);
	}
});

