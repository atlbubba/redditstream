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

				this.add_comments(comments.new);
				this.refresh_comments(comments.old);

				if(this.load_count % 5 == 0) {
					// we only want to reload the page destription every so often
					// because we loose the scroll position when this happens...
					this.set_post_info(post_info);
				}

				if(this.first_load) {
					this.set_page_info(post_info);
					this.set_votes();
					this.first_load = false;
				}

				if(comments.new.length > 0) {
					this.last_id = comments.new.getLast().data.id;
				}

				if(was_bottom) {
					window.scrollTo(0, document.body.scrollHeight);
				}

				this.load_count++;

			}.bind(this)
		}).send();
	},

	set_votes: function() {
		if(this.modhash == null) {
			return;
		}

		this.upvoted.each(function(comment_id) {
			var e = $('c-'+comment_id);
			if(e) {
				e.getElement('.uv-link').addClass('has-voted');
			}
		});

		this.downvoted.each(function(comment_id) {
			var e = $('c-'+comment_id);
			if(e) {
				$('c-'+comment_id).getElement('.dv-link').addClass('has-voted');
			}
		});
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
	// returns {new: [], old: []}
	split_comments: function(comments) {

		// if there is no id stored, then everything will be new (must be the
		// first load)
		var in_new = (this.last_id === null);
		var result = {'new':[], 'old':[]};

		for(var i=0; i < comments.length; i++) {
			if(in_new) {
				result.new.push(comments[i]);
			} else {
				result.old.push(comments[i]);
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
	},

	set_page_info: function(post_info) {

		$e('a', {
			'text':post_info.data.title,
			'href':post_info.data.permalink
		}).inject('post-title');

		$('ps-author').innerHTML = post_info.data.author;
		$('ps-author').href = 'http://www.reddit.com/user/' + post_info.data.author;

		$('ps-count').innerHTML = post_info.data.num_comments;
		$('ps-count').href = post_info.data.permalink;

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

			this.comment_elements[item.data.id] = new CommentElement(
				insert_into,
				item.data, {
					'prev_time': this.prev_time,
					'first_load': this.first_load,
					'is_root': is_root,
					'show_time': show_time
				}
			);

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
			Cookie.write(_thread_id+'-uv', JSON.encode(this.upvoted), {duration: 14});
			Cookie.write(_thread_id+'-dv', JSON.encode(this.downvoted), {duration: 14});
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
	}
}

var CommentElement = new Class({

	initialize: function(container, data, options) {
		this.container = $(container);
		this.data = data;
		this.options = options || {};
		this.options.template = this.options.template || 'tmpl-comment';
		this.options.is_root = $defined(this.options.is_root)? this.options.is_root : true;
		this.options.show_time = $defined(this.options.show_time)? this.options.show_time : false;

		if(!$defined(container) || !$defined(data)) {
			throw 'Must define a container element and pass in data';
		}

		this.normalizeData();
		this.element = this.createElement().inject(this.container);
	},

	createElement: function() {

		var jst = new JsTemplate(this.options.template);
		var e = jst.render(this.data);

		if(!this.options.first_load) {
			// not the first element? then fade it in
			e.style.opacity = '0';
			e.fade();
		}

		this.upvote_link = e.getElement('.uv-link');
		this.downvote_link = e.getElement('.dv-link');

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
	}

});

var ProxiedRequest = new Class({
	Extends: Request.JSON,

	initialize: function(options) {
		options = options || {};
		user_agent = 'Mozilla/5.0 (Php 5.3; reddit-stream.com; en-us) reddit-stream.com (xhr via proxy)';

		options.url = '/shared/ba-simple-proxy.php?user_agent=' + user_agent + '&send_cookies=1&mode=native&url=' + escape(options.url);

		this.parent(options);
	}
});

