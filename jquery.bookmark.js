/* http://keith-wood.name/bookmark.html
   Sharing bookmarks for jQuery v1.1.2.
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

/* Allow your page to be shared with various bookmarking sites.
   Attach the functionality with options like:
   $('div selector').bookmark({sites: ['delicious', 'digg']});
*/

(function($) { // Hide scope, no $ conflict

var PROP_NAME = 'bookmark';

/* Bookmark sharing manager. */
function Bookmark() {
	this._defaults = {
		url: '',  // The URL to bookmark, leave blank for the current page
		title: '',  // The title to bookmark, leave blank for the current one
		sites: [],  // List of site IDs to use, empty for all
		icons: 'bookmarks.png', // Horizontal amalgamation of all site icons
		iconSize: 16,  // The size of the individual icons
		target: '_blank',  // The name of the target window for the bookmarking links
		compact: true,  // True if a compact presentation should be used, false for full
		hint: 'Send to {s}',  // Popup hint for links, {s} is replaced by display name
		popup: false, // True to have it popup on demand, false to show always
		popupText: 'Bookmark this site...', // Text for the popup trigger
		addFavorite: false,  // True to add a 'add to favourites' link, false for none
		favoriteText: 'Favorite',  // Display name for the favourites link
		favoriteIcon: 0,  // Icon for the favourites link
		addEmail: false,  // True to add a 'e-mail a friend' link, false for none
		emailText: 'E-mail',  // Display name for the e-mail link
		emailIcon: 1,  // Icon for the e-mail link
		emailSubject: 'Interesting page',  // The subject for the e-mail
		emailBody: 'I thought you might find this page interesting:\n{t} ({u})', // The body of the e-mail
			// Use '{t}' for the position of the page title, '{u}' for the page URL, and '\n' for new lines
		manualBookmark: 'Please close this dialog and\npress Ctrl-D to bookmark this page.'
			// Instructions for manually bookmarking the page
	};
	this._sites = {  // The definitions of the available bookmarking sites
	    'alltagz': {display: 'alltagz', icon: 69,
			url: 'http://www.alltagz.de/bookmarks/?action=add&address={u}&amp;title={t}'},
		'aol': {display: 'myAOL', icon: 2,
			url: 'http://favorites.my.aol.com/ffclient/webroot/0.4.1/src/html/addBookmarkDialog.html?url={u}&amp;title={t}&amp;favelet=true'},
		'ask': {display: 'Ask', icon: 3,
			url: 'http://myjeeves.ask.com/mysearch/BookmarkIt?v=1.2&amp;t=webpages&amp;url={u}&amp;title={t}'},
		'backflip': {display: 'Backflip', icon: 62,
			url: 'http://www.backflip.com/add_page_pop.ihtml?url={u}&amp;title={t}'},
		'ballhype': {display: 'BallHype', icon: 63,
			url: 'http://ballhype.com/post/url/?url={u}&amp;title={t}'},
		'bebo': {display: 'Bebo', icon: 64,
			url: 'http://bebo.com/c/share?Url={u}&amp;Title={t}'},
		'blinklist': {display: 'BlinkList', icon: 4,
			url: 'http://www.blinklist.com/index.php?Action=Blink/addblink.php&amp;Url={u}&amp;Title={t}'},
		'bloglines': {display: 'Bloglines', icon: 48,
			url: 'http://www.bloglines.com/sub/{u}'},
		'blogmarks': {display: 'Blogmarks', icon: 5,
			url: 'http://blogmarks.net/my/new.php?mini=1&amp;simple=1&amp;url={u}&amp;title={t}'},
		'bookmarkit': {display: 'bookmark.it', icon: 71,
			url: 'http://www.bookmark.it/bookmark.php?url={u}'},
		'care2': {display: 'Care2', icon: 6,
			url: 'http://www.care2.com/news/news_post.html?url={u}&amp;title={t}'},
		'current': {display: 'Current', icon: 49,
			url: 'http://current.com/clipper.htm?url={u}&amp;title={t}'},
		'delicious': {display: 'del.icio.us', icon: 7,
			url: 'http://del.icio.us/post?url={u}&amp;title={t}'},
		'designfloat': {display: 'Design Float', icon: 50,
			url: 'http://www.designfloat.com/submit.php?url={u}&amp;title={t}'},
		'digg': {display: 'Digg', icon: 8,
			url: 'http://digg.com/submit?phase=2&amp;url={u}&amp;title={t}'},
		'diigo': {display: 'Diigo', icon: 9,
			url: 'http://www.diigo.com/post?url={u}&amp;title={t}'},
		'dzone': {display: 'DZone', icon: 10,
			url: 'http://www.dzone.com/links/add.html?url={u}&amp;title={t}'},
		'facebook': {display: 'Facebook', icon: 11,
			url: 'http://www.facebook.com/sharer.php?u={u}&amp;t={t}'},
		'fark': {display: 'Fark', icon: 12,
			url: 'http://cgi.fark.com/cgi/fark/submit.pl?new_url={u}&amp;new_comment={t}'},
		'faves': {display: 'Faves', icon: 13,
			url: 'http://faves.com/Authoring.aspx?u={u}&amp;t={t}'},
		'feedmelinks': {display: 'Feed Me Links', icon: 14,
			url: 'http://feedmelinks.com/categorize?from=toolbar&amp;op=submit&amp;url={u}&amp;name={t}'},
		'fresqui': {display: 'Fresqui', icon: 51,
			url: 'http://ocio.fresqui.com/post?url={u}&amp;title={t}'},
		'friendfeed': {display: 'FriendFeed', icon: 52,
			url: 'http://friendfeed.com/share?url={u}&amp;title={t}'},
		'funp': {display: 'funP', icon: 53,
			url: 'http://funp.com/pages/submit/add.php?url={u}&amp;title={t}'},
		'furl': {display: 'Furl', icon: 15,
			url: 'http://www.furl.net/storeIt.jsp?u={u}&amp;t={t}'},
		'google': {display: 'Google', icon: 16,
			url: 'http://www.google.com/bookmarks/mark?op=edit&amp;bkmk={u}&amp;title={t}'},
		'hugg': {display: 'Hugg', icon: 17,
			url: 'http://www.hugg.com/submit?url={u}'},
		'kaboodle': {display: 'Kaboodle', icon: 65,
			url: 'http://www.kaboodle.com/grab/addItemWithUrl?url={u}&amp;pidOrRid=pid=&amp;redirectToKPage=true'},
		'kirtsy': {display: 'Kirtsy', icon: 54,
			url: 'http://www.kirtsy.com/submit.php?url={u}'},
		'kool': {display: 'Koolontheweb', icon: 43,
			url: 'http://www.koolontheweb.com/post?url={u}&title={t}'},
	    'linkarena': {display: 'Linkarena', icon: 70,
			url: 'http://linkarena.com/bookmarks/addlink/?url={u}&amp;title={t}&amp;desc=&amp;tags='},			
		'linkagogo': {display: 'LinkaGoGo', icon: 18,
			url: 'http://www.linkagogo.com/go/AddNoPopup?url={u}&amp;title={t}'},
		'linkedin': {display: 'LinkedIn', icon: 66,
			url: 'http://www.linkedin.com/shareArticle?mini=true&amp;url={u}&amp;title={t}&amp;ro=false&amp;summary=&amp;source='},
		'livejournal': {display: 'LiveJournal', icon: 19,
			url: 'http://www.livejournal.com/update.bml?subject={u}'},
		'magnolia': {display: 'ma.gnolia', icon: 20,
			url: 'http://ma.gnolia.com/bookmarklet/add?url={u}&amp;title={t}'},
		'meneame': {display: 'menéame', icon: 55,
			url: 'http://meneame.net/submit.php?url={u}'},
		'mindbody': {display: 'MindBodyGreen', icon: 21,
			url: 'http://www.mindbodygreen.com/passvote.action?u={u}'},
		'misterwong': {display: 'Mister Wong', icon: 22,
			url: 'http://www.mister-wong.com/index.php?action=addurl&amp;bm_url={u}&amp;bm_description={t}'},
		'mixx': {display: 'Mixx', icon: 23,
			url: 'http://www.mixx.com/submit/story?page_url={u}&amp;title={t}'},
		'multiply': {display: 'Multiply', icon: 24,
			url: 'http://multiply.com/gus/journal/compose/addthis?body=&amp;url={u}&amp;subject={t}'},
		'myspace': {display: 'MySpace', icon: 25,
			url: 'http://www.myspace.com/Modules/PostTo/Pages/?c={u}&amp;t={t}'},
		'n4g': {display: 'N4G', icon: 56,
			url: 'http://www.n4g.com/tips.aspx?url={u}&amp;title={t}'},
		'netscape': {display: 'Netscape', icon: 26,
			url: 'http://www.netscape.com/submit/?U={u}&amp;T={t}'},
		'netvouz': {display: 'Netvouz', icon: 27,
			url: 'http://netvouz.com/action/submitBookmark?url={u}&amp;title={t}&amp;popup=no'},
		'newsvine': {display: 'Newsvine', icon: 28,
			url: 'http://www.newsvine.com/_wine/save?u={u}&amp;h={t}'},
		'nowpublic': {display: 'NowPublic', icon: 29,
			url: 'http://view.nowpublic.com/?src={u}&amp;t={t}'},
		'oknotizie': {display: 'OKNOtizie', icon: 57,
			url: 'http://oknotizie.alice.it/post?url={u}&amp;title={t}'},
		'oneview': {display: 'OneView', icon: 72,
			url: 'http://www.oneview.de/quickadd/neu/addBookmark.jsf?URL={u}&amp;title={t}'},
		'propeller': {display: 'Propeller', icon: 58,
			url: 'http://www.propeller.com/submit/?U={u}&amp;T={t}'},
		'reddit': {display: 'reddit', icon: 30,
			url: 'http://reddit.com/submit?url={u}&amp;title={t}'},
		'scoopeo': {display: 'Scoopeo', icon: 46,
			url: 'http://www.scoopeo.com/scoop/new?newurl={u}&amp;title={t}'},
		'segnalo': {display: 'Segnalo', icon: 31,
			url: 'http://segnalo.alice.it/post.html.php?url={u}&amp;title={t}'},
		'simpy': {display: 'Simpy', icon: 32,
			url: 'http://www.simpy.com/simpy/LinkAdd.do?href={u}&amp;title={t}'},
		'slashdot': {display: 'Slashdot', icon: 33,
			url: 'http://slashdot.org/bookmark.pl?url={u}&amp;title={t}'},
		'smarking': {display: 'Smarking', icon: 34,
			url: 'http://smarking.com/editbookmark/?url={u}&amp;title={t}'},
		'sphinn': {display: 'Sphinn', icon: 44,
			url: 'http://sphinn.com/submit.php?url={u}&amp;title={t}'},
		'spurl': {display: 'Spurl', icon: 35,
			url: 'http://www.spurl.net/spurl.php?url={u}&amp;title={t}'},
		'squidoo': {display: 'Squidoo', icon: 42,
			url: 'http://www.squidoo.com/lensmaster/bookmark?{u}&title={t}'},
		'stumbleupon': {display: 'StumbleUpon', icon: 36,
			url: 'http://www.stumbleupon.com/submit?url={u}&amp;title={t}'},
		'tailrank': {display: 'Tailrank', icon: 37,
			url: 'http://tailrank.com/share/?link_href={u}&amp;title={t}'},
		'technorati': {display: 'Technorati', icon: 38,
			url: 'http://www.technorati.com/faves?add={u}'},
		'thisnext': {display: 'ThisNext', icon: 39,
			url: 'http://www.thisnext.com/pick/new/submit/sociable/?url={u}&amp;name={t}'},
		'twitthis': {display: 'TwitThis', icon: 45,
			url: 'http://twitthis.com/twit?url={u}'},
		'wikio': {display: 'Wikio', icon: 47,
			url: 'http://www.wikio.com/vote?newurl={u}'},
		'windows': {display: 'Windows Live', icon: 40,
			url: 'https://favorites.live.com/quickadd.aspx?marklet=1&amp;mkt=en-us&amp;url={u}&amp;title={t}'},
		'xanga': {display: 'Xanga', icon: 59,
			url: 'http://www.xanga.com/private/editorx.aspx?u={u}&amp;t={t}'},
		'yahoobm': {display: 'Yahoo Bookmarks', icon: 60,
			url: 'http://bookmarks.yahoo.com/toolbar/savebm?opener=tb&amp;u={u}&amp;t={t}'},
		'yahoobuzz': {display: 'Yahoo Buzz', icon: 67,
			url: 'http://buzz.yahoo.com/submit?submitUrl={u}&amp;submitHeadline={t}'},
		'yahoo': {display: 'Yahoo MyWeb', icon: 41,
			url: 'http://myweb2.search.yahoo.com/myresults/bookmarklet?u={u}&amp;t={t}'},
		'yardbarker': {display: 'Yardbarker', icon: 68,
			url: 'http://www.yardbarker.com/author/new/?pUrl={u}'},
		'yigg': {display: 'Yigg', icon: 61,
			url: 'http://www.yigg.de/neu?exturl={u}&amp;exttitle={t}'}
	};
}

$.extend(Bookmark.prototype, {
	/* Class name added to elements to indicate already configured with bookmarking. */
	markerClassName: 'hasBookmark',

	/* Override the default settings for all bookmarking instances.
	   @param  settings  object - the new settings to use as defaults
	   @return void */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Add a new bookmarking site to the list.
	   @param  id  string - the ID of the new site
	   @param  display  string - the display name for this site
	   @param  icon     url - the location of an icon for this site (16x16), or
	                    number - the index of the icon within the combined image
	   @param  url      url - the submission URL for this site,
	                    with {u} marking where the current page's URL should be inserted,
	                    and {t} indicating the title insertion point
	   @return void */
	addSite: function(id, display, icon, url) {
		this._sites[id] = {display: display, icon: icon, url: url};
		return this;
	},

	/* Return the list of defined sites.
	   @return  object[] - indexed by site id (string), each object contains
	            display (string) - the display name,
	            icon    (string) - the location of the icon,, or
	                    (number) the icon's index in the combined image
	            url     (string) - the submission URL for the site */
	getSites: function() {
		return this._sites;
	},

	/* Attach the bookmarking widget to a div. */
	_attachBookmark: function(target, settings) {
		target = $(target);
		if (target.hasClass(this.markerClassName)) {
			return;
		}
		target.addClass(this.markerClassName);
		this._updateBookmark(target, settings);
	},

	/* Reconfigure the settings for a bookmarking div. */
	_changeBookmark: function(target, settings) {
		target = $(target);
		if (!target.hasClass(this.markerClassName)) {
			return;
		}
		this._updateBookmark(target, settings);
	},

	/* Construct the requested bookmarking links. */
	_updateBookmark: function(target, settings) {
		var oldSettings = $.data(target[0], PROP_NAME) || $.extend({}, this._defaults);
		settings = extendRemove(oldSettings, settings || {});
		$.data(target[0], PROP_NAME, settings);
		var sites = settings.sites;
		if (sites.length == 0) {
			$.each(this._sites, function(id) {
				sites.push(id);
			});
		}
		var hint = settings.hint || '{s}';
		var html = (settings.popup ? '<span class="bookmark_popup_text">' +
			settings.popupText + '</span><div class="bookmark_popup">' : '') +
			'<ul class="bookmark_list' + (settings.compact ? ' bookmark_compact' : '') + '">';
		var addSite = function(display, icon, url, onclick) {
			var html = '<li><a href="' + url + '"' + (onclick ? ' onclick="' + onclick + '"' :
				(settings.target ? ' target="' + settings.target + '"' : '')) + '>';
			if (icon != null) {
				var title = hint.replace(/\{s\}/, display);
				if (typeof icon == 'number') {
					html += '<span title="' + title + '" style="background: ' +
						'transparent url(' + settings.icons + ') no-repeat -' +
						(icon * settings.iconSize) + 'px 0px;' +
						($.browser.mozilla && $.browser.version < '1.9' ?
						' padding-left: ' + settings.iconSize + 'px; padding-bottom: ' +
						Math.max(0, (settings.iconSize / 2) - 5) + 'px;' : '') + '"></span>';
				}
				else {
					html += '<img src="' + icon + '" alt="' + title + '" title="' +
						title + '"' + (($.browser.mozilla && $.browser.version < '1.9') ||
						($.browser.msie && $.browser.version < '7.0') ?
						' style="vertical-align: bottom;"' :
						($.browser.msie ? ' style="vertical-align: middle;"' :
						($.browser.opera || $.browser.safari ?
						' style="vertical-align: baseline;"' : ''))) + '/>';
				}
				html +=	(settings.compact ? '' : '&#xa0;');
			}
			html +=	(settings.compact ? '' : display) + '</a></li>';
			return html;
		};
		var url = settings.url || window.location.href;
		var title = settings.title || document.title;
		if (settings.addFavorite) {
			html += addSite(settings.favoriteText, settings.favoriteIcon,
				'#', 'jQuery.bookmark._addFavourite(\'' + url + '\',\'' + title + '\')');
		}
		if (settings.addEmail) {
			html += addSite(settings.emailText, settings.emailIcon,
				'mailto:?subject=' + encodeURIComponent(settings.emailSubject) +
				'&amp;body=' + encodeURIComponent(settings.emailBody.
				replace(/{u}/, url).replace(/{t}/, title)));
		}
		url = encodeURIComponent(url);
		title = encodeURIComponent(title);
		var allSites = this._sites;
		$.each(sites, function(index, id) {
			var site = allSites[id];
			if (site) {
				html += addSite(site.display, site.icon,
					site.url.replace(/{u}/, url).replace(/{t}/, title));
			}
		});
		html += '</ul>' + (settings.popup ? '</div>' : '');
		target.html(html);
		if (settings.popup) {
			$(target).click(function() {
				var target = $(this);
				var offset = target.offset();
				var extras = $.bookmark._getExtras(target);
				$('.bookmark_popup', target).css('left', offset.left).
					css('top', offset.top + target.height() + extras[1]).
					toggle();
			});
		}
	},

	/* Retrieve the size of borders and padding for an element.
	   @param  elem  (jQuery object) the element of interest
	   @return  (number[2]) the horizontal and vertical sizes */
	_getExtras: function(elem) {
		var convert = function(value) {
			return {thin: 1, medium: 3, thick: 5}[value] || value;
		};
		return [parseInt(convert(elem.css('border-left-width')), 10) +
			parseInt(convert(elem.css('border-right-width')), 10) +
			parseInt(elem.css('padding-left'), 10) + parseInt(elem.css('padding-right'), 10),
			parseInt(convert(elem.css('border-top-width')), 10) +
			parseInt(convert(elem.css('border-bottom-width')), 10) +
			parseInt(elem.css('padding-top'), 10) + parseInt(elem.css('padding-bottom'), 10)];
	},

	/* Remove the bookmarking widget from a div. */
	_destroyBookmark: function(target) {
		target = $(target);
		if (!target.hasClass(this.markerClassName)) {
			return;
		}
		target.removeClass(this.markerClassName).empty();
		$.removeData(target[0], PROP_NAME);
	},

	/* Add the current page as a favourite in the browser.
	   @param  url    (string) the URL to bookmark
	   @param  title  (string) the title to bookmark */
	_addFavourite: function(url, title) {
		if ($.browser.msie) {
			window.external.addFavorite(url, title);
		}
		else {
			alert(this._defaults.manualBookmark);
		}
	}
});

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props) {
		if (props[name] == null) {
			target[name] = null;
		}
	}
	return target;
}

/* Attach the bookmarking functionality to a jQuery selection.
   @param  command  string - the command to run (optional, default 'attach')
   @param  options  object - the new settings to use for these bookmarking instances
   @return  jQuery object - for chaining further calls */
$.fn.bookmark = function(options) {
	var otherArgs = Array.prototype.slice.call(arguments, 1);
	return this.each(function() {
		if (typeof options == 'string') {
			$.bookmark['_' + options + 'Bookmark'].
				apply($.bookmark, [this].concat(otherArgs));
		}
		else {
			$.bookmark._attachBookmark(this, options || {});
		}
	});
};

/* Initialise the bookmarking functionality. */
$.bookmark = new Bookmark(); // singleton instance

})(jQuery);
