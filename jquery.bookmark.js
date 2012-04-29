/* http://keith-wood.name/bookmark.html
   Sharing bookmarks for jQuery v1.0.0.
   Written by Keith Wood (kbwood@virginbroadband.com.au) March 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

/* Allow your page to be shared with various bookmarking sites.
   Attach the functionality with options like:
   $('div selector').bookmark({sites: ['delicious', 'digg']});
*/

(function($) { // Hide scope, no $ conflict

/* Bookmark sharing manager. */
function Bookmark() {
	this._defaults = {
		sites: [],  // List of site IDs to use, empty for all
		icons: 'bookmarks.png', // Horizontal amalgamation of all site icons
		target: '_blank',  // The name of the target window for the bookmarking links
		compact: false,  // True if a compact presentation should be used, false for full
		addFavorite: false,  // True to add a 'add to favourites' link, false for none
		favoriteText: 'Favorite',  // Display name for the favourites link
		favoriteIcon: 'favorite.png',  // Icon for the favourites link
		addEmail: false,  // True to add a 'e-mail a friend' link, false for none
		emailText: 'E-mail',  // Display name for the e-mail link
		emailIcon: 'email.png',  // Icon for the e-mail link
		emailSubject: 'Interesting page',  // The subject for the e-mail
		emailBody: 'I thought you might find this page interesting:\n{p}', // The body of the e-mail
			// Use '{p}' for the position of the page details, use '\n' for new lines
		manualBookmark: 'Please close this dialog and\npress Ctrl-D to bookmark this page.'
			// Instructions for manually bookmarking the page
	};
	this._sites = {  // The definitions of the available bookmarking sites
		'aol': {display: 'myAOL', icon: 0,
			url: 'http://favorites.my.aol.com/ffclient/webroot/0.4.1/src/html/addBookmarkDialog.html?url={u}&amp;title={t}&amp;favelet=true'},
		'ask': {display: 'Ask', icon: 1,
			url: 'http://myjeeves.ask.com/mysearch/BookmarkIt?v=1.2&amp;t=webpages&amp;url={u}&amp;title={t}'},
		'blinklist': {display: 'BlinkList', icon: 2,
			url: 'http://www.blinklist.com/index.php?Action=Blink/addblink.php&amp;Url={u}&amp;Title={t}'},
		'blogmarks': {display: 'Blogmarks', icon: 3,
			url: 'http://blogmarks.net/my/new.php?mini=1&amp;simple=1&amp;url={u}&amp;title={t}'},
		'delicious': {display: 'del.icio.us', icon: 4,
			url: 'http://del.icio.us/post?url={u}&amp;title={t}'},
		'digg': {display: 'Digg', icon: 5,
			url: 'http://digg.com/submit?phase=2&amp;url={u}&amp;title={t}'},
		'diigo': {display: 'Diigo', icon: 6,
			url: 'http://www.diigo.com/post?url={u}&amp;title={t}'},
		'facebook': {display: 'Facebook', icon: 7,
			url: 'http://www.facebook.com/sharer.php?u={u}&amp;t={t}'},
		'fark': {display: 'Fark', icon: 8,
			url: 'http://cgi.fark.com/cgi/fark/submit.pl?new_url={u}&amp;new_comment={t}'},
		'faves': {display: 'Faves', icon: 9,
			url: 'http://faves.com/Authoring.aspx?u={u}&amp;t={t}'},
		'feedmelinks': {display: 'Feed Me Links', icon: 10,
			url: 'http://feedmelinks.com/categorize?from=toolbar&amp;op=submit&amp;url={u}&amp;name={t}'},
		'furl': {display: 'Furl', icon: 11,
			url: 'http://www.furl.net/storeIt.jsp?t={t}&amp;u={u}'},
		'google': {display: 'Google', icon: 12,
			url: 'http://www.google.com/bookmarks/mark?op=edit&amp;bkmk={u}&amp;title={t}'},
		'linkagogo': {display: 'LinkaGoGo', icon: 13,
			url: 'http://www.linkagogo.com/go/AddNoPopup?url={u}&amp;title={t}'},
		'magnolia': {display: 'ma.gnolia', icon: 14,
			url: 'http://ma.gnolia.com/bookmarklet/add?url={u}&amp;title={t}'},
		'misterwong': {display: 'Mister Wong', icon: 15,
			url: 'http://www.mister-wong.com/index.php?action=addurl&amp;bm_url={u}&amp;bm_description={t}'},
		'multiply': {display: 'Multiply', icon: 16,
			url: 'http://multiply.com/gus/journal/compose/addthis?body=&amp;url={u}&amp;subject={t}'},
		'myspace': {display: 'MySpace', icon: 17,
			url: 'http://www.myspace.com/Modules/PostTo/Pages/?c={u}&amp;t={t}'},
		'netscape': {display: 'Netscape', icon: 18,
			url: 'http://www.netscape.com/submit/?U={u}&amp;T={t}'},
		'netvouz': {display: 'Netvouz', icon: 19,
			url: 'http://netvouz.com/action/submitBookmark?url={u}&amp;title={t}&amp;popup=no'},
		'newsvine': {display: 'Newsvine', icon: 20,
			url: 'http://www.newsvine.com/_wine/save?popoff=0&amp;u={u}&amp;h={t}'},
		'reddit': {display: 'reddit', icon: 21,
			url: 'http://reddit.com/submit?url={u}&amp;title={t}'},
		'segnalo': {display: 'Segnalo', icon: 22,
			url: 'http://segnalo.alice.it/post.html.php?url={u}&amp;title={t}'},
		'simpy': {display: 'Simpy', icon: 23,
			url: 'http://www.simpy.com/simpy/LinkAdd.do?href={u}&amp;title={t}'},
		'slashdot': {display: 'Slashdot', icon: 24,
			url: 'http://slashdot.org/bookmark.pl?url={u}&amp;title={t}'},
		'stumbleupon': {display: 'StumbleUpon', icon: 25,
			url: 'http://www.stumbleupon.com/submit?url={u}&amp;title={t}'},
		'tailrank': {display: 'Tailrank', icon: 26,
			url: 'http://tailrank.com/share/?title={t}&amp;link_href={u}'},
		'technorati': {display: 'Technorati', icon: 27,
			url: 'http://www.technorati.com/faves?add={u}'},
		'windows': {display: 'Windows Live', icon: 28,
			url: 'https://favorites.live.com/quickadd.aspx?marklet=1&amp;mkt=en-us&amp;url={u}&amp;title={t}'},
		'yahoo': {display: 'Yahoo MyWeb', icon: 29,
			url: 'http://myweb2.search.yahoo.com/myresults/bookmarklet?t={t}&amp;u={u}'}
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
	   @param  icon     url - the location of an icon for this site (16x16)
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
	            icon (string) - the location of the icon,
	            url (string) - the submission URL for the site */
	getSites: function() {
		return this._sites;
	},

	/* Attach the bookmarking widget to a div. */
	_attachBookmark: function(target, settings) {
		target = $(target);
		if (target.is('.' + this.markerClassName)) {
			return;
		}
		target.addClass(this.markerClassName);
		this._updateBookmark(target, settings);
	},

	/* Reconfigure the settings for a bookmarking div. */
	_changeBookmark: function(target, settings) {
		target = $(target);
		if (!target.is('.' + this.markerClassName)) {
			return;
		}
		this._updateBookmark(target, settings);
	},

	/* Construct the requested bookmarking links. */
	_updateBookmark: function(target, settings) {
		settings = extendRemove(extendRemove({}, this._defaults), settings);
		var sites = settings.sites;
		if (sites.length == 0) {
			$.each(this._sites, function(id) {
				sites[sites.length] = id;
			});
		}
		var html = '<ul class="bookmark_list' + (settings.compact ? ' bookmark_compact' : '') + '">';
		var addSite = function(display, icon, url) {
			var html = '<li><a href="' + url + '"' + (settings.target ? ' target="' + settings.target + '"' : '') + '>';
			if (icon != null) {
				if (typeof icon == 'number') {
					html += '<span title="' + display + '" style="display: inline-block; width: 16px; height: 16px;' +
						($.browser.mozilla ? ' padding-left: 16px;' : '') + ' background: ' +
						'transparent url(' + settings.icons + ') no-repeat -' + (icon * 16) + 'px 0px;"></span>';
				}
				else {
					html += '<img src="' + icon + '" alt="' + display + '" title="' + display + '"' +
						($.browser.safari ? ' style="margin-top: 2px;"' : '') + '/>';
				}
				html +=	(settings.compact ? '' : '&#xa0;');
			}
			html +=	(settings.compact ? '' : display) + '</a></li>';
			return html;
		};
		if (settings.addFavorite) {
			html += '<li><a href="#" onclick="jQuery.bookmark._addFavourite()">' +
				(settings.favoriteIcon ? '<img src="' + settings.favoriteIcon +
				'" alt="' + settings.favoriteText + '" title="' + settings.favoriteText + '"' +
				($.browser.safari ? ' style="margin-top: 2px;"' : '') + '/>' +
				(settings.compact ? '' : '&#xa0;') : '') +
				(settings.compact ? '' : settings.favoriteText) + '</li>';
		}
		if (settings.addEmail) {
			html += addSite(settings.emailText, settings.emailIcon,
				'mailto:?subject=' + escape(settings.emailSubject) + '&amp;body=' +
				escape(settings.emailBody.replace(/{p}/, document.title + ' (' + window.location.href + ')')));
		}
		var allSites = this._sites;
		$.each(sites, function(index, id) {
			var site = allSites[id];
			html += addSite(site.display, site.icon, site.url.
				replace(/{u}/, escape(window.location.href)).replace(/{t}/, escape(document.title)));
		});
		html += '</ul>';
		target.html(html);
	},

	/* Remove the bookmarking widget from a div. */
	_destroyBookmark: function(target) {
		target = $(target);
		if (!target.is('.' + this.markerClassName)) {
			return;
		}
		target.removeClass(this.markerClassName);
		target.empty();
	},

	/* Add the current page as a favourite in the browser. */
	_addFavourite: function() {
		if ($.browser.msie) {
			window.external.addFavorite(window.location.href, document.title);
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
$(document).ready(function() {
   $.bookmark = new Bookmark(); // singleton instance
});

})(jQuery);
