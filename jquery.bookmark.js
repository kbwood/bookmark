/* http://keith-wood.name/bookmark.html
   Sharing bookmarks for jQuery v1.3.0.
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
	this._uuid = new Date().getTime(); // Unique identifier seed
	this._defaults = {
		url: '',  // The URL to bookmark, leave blank for the current page
		sourceTag: '', // Extra tag to add to URL to indicate source when it returns
		title: '',  // The title to bookmark, leave blank for the current one
		description: '',  // A longer description of the site
		sites: [],  // List of site IDs to use, empty for all
		iconsStyle: 'bookmark_icons', // CSS class for site icons
		icons: 'bookmarks.gif', // Horizontal amalgamation of all site icons
		iconSize: 16,  // The size of the individual icons
		iconCols: 16,  // The number of icons across the combined image
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
			// Use '{t}' for the position of the page title, '{u}' for the page URL,
			// '{d}' for the description, and '\n' for new lines
		manualBookmark: 'Please close this dialog and\npress Ctrl-D to bookmark this page.',
			// Instructions for manually bookmarking the page
		onSelect: null // Callback on selection
	};
	this._sites = {  // The definitions of the available bookmarking sites, in URL use
		// '{t}' for the position of the page title, '{u}' for the page URL,
		// and '{d}' for the description
		'a1webmarks': {display: 'A1 webmarks', icon: 179,
			url: 'http://www.a1-webmarks.com/bm_edit.html?u={u}&amp;t={t}'},
	    'alltagz': {display: 'alltagz', icon: 69,
			url: 'http://www.alltagz.de/bookmarks/?action=add&amp;address={u}&amp;title={t}'},
		'allvoices': {display: 'Allvoices', icon: 75,
			url: 'http://www.allvoices.com/post_event?url={u}&amp;title={t}'},
		'amenme': {display: 'AmenMe', icon: 127,
			url: 'http://www.amenme.com/AmenMe/Amens/AmenToThis.aspx?url={u}&amp;title={t}'},
		'aol': {display: 'myAOL', icon: 2,
			url: 'http://favorites.my.aol.com/ffclient/AddBookmark?url={u}&amp;title={t}'},
		'arto': {display: 'Arto', icon: 76,
			url: 'http://www.arto.com/section/linkshare/?lu={u}&amp;ln={t}'},
		'ask': {display: 'Ask', icon: 3,
			url: 'http://myjeeves.ask.com/mysearch/BookmarkIt?v=1.2&amp;t=webpages&amp;url={u}&amp;title={t}'},
		'backflip': {display: 'Backflip', icon: 62,
			url: 'http://www.backflip.com/add_page_pop.ihtml?url={u}&amp;title={t}'},
		'baidu': {display: 'Baidu', icon: 128,
			url: 'http://cang.baidu.com/do/add?iu={u}&amp;it={t}&amp;fr=ien&amp;dc='},
		'ballhype': {display: 'BallHype', icon: 63,
			url: 'http://ballhype.com/post/url/?url={u}&amp;title={t}'},
		'bebo': {display: 'Bebo', icon: 64,
			url: 'http://bebo.com/c/share?Url={u}&amp;Title={t}'},
		'bibsonomy': {display: 'BibSonomy', icon: 77,
			url: 'http://www.bibsonomy.org/BibtexHandler?requTask=upload&amp;url={u}&amp;description={t}'},
		'bitly': {display: 'bit.ly', icon: 129,
			url: 'http://bit.ly/?url={u}'},
		'bizsugar': {display: 'bizSugar', icon: 130,
			url: 'http://www.bizsugar.com/bizsugarthis.php?url={u}'},
		'bleetbox': {display: 'bleetbox', icon: 180,
			url: 'http://bleetbox.com/bar?url={u}'},
		'blinklist': {display: 'BlinkList', icon: 4,
			url: 'http://www.blinklist.com/index.php?Action=Blink/addblink.php&amp;Url={u}&amp;Title={t}'},
		'bloggy': {display: 'Bloggy', icon: 131,
			url: 'http://bloggy.se/home?status={t} {u}'},
		'blogmarks': {display: 'Blogmarks', icon: 5,
			url: 'http://blogmarks.net/my/new.php?mini=1&amp;simple=1&amp;url={u}&amp;title={t}'},
		'bobrdobr': {display: 'Bobrdobr', icon: 132,
			url: 'http://bobrdobr.ru/addext.html?url={u}&amp;title={t}&amp;desc={d}'},
		'bookmarkit': {display: 'bookmark.it', icon: 71,
			url: 'http://www.bookmark.it/bookmark.php?url={u}'},
		'bookmarksfr': {display: 'bookmarks.fr', icon: 78,
			url: 'http://www.bookmarks.fr/favoris/AjoutFavori?action=add&amp;address={u}&amp;title={t}'},
		'bordom': {display: 'Bordom', icon: 181,
			url: 'http://www.bordom.net/submit/?url={u}&amp;title={t}'},
		'brainify': {display: 'Brainify', icon: 133,
			url: 'http://www.brainify.com/Bookmark.aspx?url={u}&amp;title={t}'},
		'bryderi': {display: 'Bryderi', icon: 134,
			url: 'http://bryderi.se/add.html?u={u}'},
		'buddymarks': {display: 'BuddyMarks', icon: 79,
			url: 'http://buddymarks.com/add_bookmark.php?bookmark_url={u}&amp;bookmark_title={t}'},
		'bukmark': {display: 'Bukmark', icon: 182,
			url: 'http://www.buk-mark.com/submit.php?url={u}'},
		'bx': {display: 'Business Exchange', icon: 73,
			url: 'http://bx.businessweek.com/api/add-article-to-bx.tn?url={u}'},
		'bzzster': {display: 'Bzzster', icon: 80,
			url: 'http://bzzster.com/share?v=5;link={u}&amp;subject={t}'},
		'care2': {display: 'Care2', icon: 6,
			url: 'http://www.care2.com/news/news_post.html?url={u}&amp;title={t}'},
		'citeulike': {display: 'citeulike', icon: 81,
			url: 'http://www.citeulike.org/posturl?url={u}&amp;title={t}'},
		'connotea': {display: 'Connotea', icon: 82,
			url: 'http://www.connotea.org/add?uri={u}&amp;title={t}'},
		'current': {display: 'Current', icon: 49,
			url: 'http://current.com/clipper.htm?url={u}&amp;title={t}'},
		'dealsplus': {display: 'deals plus', icon: 74,
			url: 'http://dealspl.us/add.php?ibm=1&amp;url={u}'},
		'delicious': {display: 'del.icio.us', icon: 7,
			url: 'http://del.icio.us/post?url={u}&amp;title={t}'},
		'designfloat': {display: 'Design Float', icon: 50,
			url: 'http://www.designfloat.com/submit.php?url={u}&amp;title={t}'},
		'designmoo': {display: 'DesignMoo', icon: 135,
			url: 'http://designmoo.com/submit?url={u}&amp;title={t}&amp;body={d}'},
		'digg': {display: 'Digg', icon: 8,
			url: 'http://digg.com/submit?phase=2&amp;url={u}&amp;title={t}'},
		'diglog': {display: 'Diglog', icon: 136,
			url: 'http://www.diglog.com/submit.aspx?url={u}&amp;title={t}&amp;description={d}'},
		'diigo': {display: 'Diigo', icon: 9,
			url: 'http://www.diigo.com/post?url={u}&amp;title={t}'},
		'domelhor': {display: 'Do Melhor', icon: 183,
			url: 'http://domelhor.net/submit.php?url={u}&title={t}'},
		'doower': {display: 'Doower', icon: 137,
			url: 'http://www.doower.com/share.php?u={u}&amp;t={t}'},
		'dosti': {display: 'Dosti', icon: 138,
			url: 'http://dosti.webdunia.com/Api/Share.aspx?st=b&url={u}&amp;title={t}'},
		'dotnetkicks': {display: 'DotNetKicks', icon: 139,
			url: 'http://www.dotnetkicks.com/kick/?url={u}&amp;title={t}'},
		'dzone': {display: 'DZone', icon: 10,
			url: 'http://www.dzone.com/links/add.html?url={u}&amp;title={t}'},
		'edelight': {display: 'edelight', icon: 140,
			url: 'http://www.edelight.de/geschenk/neu?purl={u}'},
		'ekudos': {display: 'eKudos', icon: 141,
			url: 'http://www.ekudos.nl/artikel/nieuw?url={u}&amp;title={t}&amp;desc={d}'},
		'embarkons': {display: 'Embarkons', icon: 184,
			url: 'http://www.embarkons.com/sharer.php?u={u}&t={t}'},
		'eucliquei': {display: 'euCliquei', icon: 142,
			url: 'http://www.eucliquei.com.br/index.asp?a=clicar_novo&amp;url={u}&amp;titulo={t}&amp;trecho='},
		'evernote': {display: 'Evernote', icon: 83,
			url: 'http://www.evernote.com/clip.action?url={u}&amp;title={t}'},
		'fabulously40': {display: 'Fabulously40', icon: 143,
			url: 'http://fabulously40.com/writeblog?body={u}&amp;subject={t}'},
		'facebook': {display: 'Facebook', icon: 11,
			url: 'http://www.facebook.com/sharer.php?u={u}&amp;t={t}'},
		'fark': {display: 'Fark', icon: 12,
			url: 'http://cgi.fark.com/cgi/fark/submit.pl?new_url={u}&amp;new_comment={t}'},
		'faves': {display: 'Faves', icon: 13,
			url: 'http://faves.com/Authoring.aspx?u={u}&amp;t={t}'},
		'favoritus': {display: 'FavoritUs', icon: 144,
			url: 'http://www.favoritus.com/post.php?getlink={u}&amp;gettitle={t}'},
		'fnews': {display: 'fnews', icon: 185,
			url: 'http://fnews.az/node/add/drigg?url={u}&amp;title={t}&amp;body={d}'},
		'folkd': {display: 'Folkd', icon: 85,
			url: 'http://www.folkd.com/submit/{u}'},
		'forgetfoo': {display: 'forgetfoo', icon: 145,
			url: 'http://www.forgetfoo.com/?inc=share&amp;url={u}&amp;title={t}&amp;desc={d}'},
		'foxiewire': {display: 'FoxieWire', icon: 86,
			url: 'http://www.foxiewire.com/submit?url={u}&amp;title={t}'},
		'fresqui': {display: 'Fresqui', icon: 51,
			url: 'http://ocio.fresqui.com/post?url={u}&amp;title={t}'},
		'friendfeed': {display: 'FriendFeed', icon: 52,
			url: 'http://friendfeed.com/share?url={u}&amp;title={t}'},
		'funp': {display: 'funP', icon: 53,
			url: 'http://funp.com/pages/submit/add.php?url={u}&amp;title={t}'},
		'gabbr': {display: 'Gabbr', icon: 87,
			url: 'http://www.gabbr.com/submit/?bookurl={u}'},
		'gacetilla': {display: 'Gacetilla', icon: 146,
			url: 'http://www.gacetilla.org/publish-form?url={u}&amp;title={t}'},
		'globalgrind': {display: 'Global Grind', icon: 88,
			url: 'http://globalgrind.com/submission/submit.aspx?url={u}&amp;type=Article&amp;title={t}'},
		'gluvsnap': {display: 'GluvSnap', icon: 186,
			url: 'http://www.gluvsnap.com/news/pin/submit.php?url={u}'},
		'google': {display: 'Google', icon: 16,
			url: 'http://www.google.com/bookmarks/mark?op=edit&amp;bkmk={u}&amp;title={t}'},
		'gravee': {display: 'Gravee', icon: 89,
			url: 'http://www.gravee.com/account/bookmarkpop?u={u}&amp;t={t}'},
		'grumper': {display: 'Grumper', icon: 147,
			url: 'http://www.grumper.org/add.php?desc={u}&amp;title={t}'},
		'habergentr': {display: 'haber.gen.tr', icon: 148,
			url: 'http://www.haber.gen.tr/edit?url={u}&amp;title={t}&amp;description={d}'},
		'hackernews': {display: 'HackerNews', icon: 187,
			url: 'http://news.ycombinator.com/submitlink?u={u}&amp;t={t}'},
		'hadashhot': {display: 'Hadash Hot', icon: 149,
			url: 'http://www.hadash-hot.co.il/submit.php?url={u}&amp;phase=1'},
		'healthranker': {display: 'HealthRanker', icon: 90,
			url: 'http://www.healthranker.com/submit.php?url={u}&amp;title={t}'},
		'hellotxt': {display: 'hellotxt', icon: 150,
			url: 'http://hellotxt.com/?status={u}'},
		'hemidemi': {display: 'HEMiDEMi', icon: 91,
			url: 'http://www.hemidemi.com/user_bookmark/new?url={u}&amp;title={t}'},
		'hipstr': {display: 'hipstr', icon: 151,
			url: 'http://www.hipstr.com/submit.php?burl={u}'},
		'hitmarks': {display: 'hitmarks', icon: 188,
			url: 'http://www.hitmarks.com/submit.php?url={u}&amp;t={t}'},
		'hotklix': {display: 'hotklix', icon: 152,
			url: 'http://www.hotklix.com/?ref=share_this&amp;addurl={u}'},
		'hugg': {display: 'Hugg', icon: 17,
			url: 'http://www.hugg.com/submit?url={u}'},
		'hyves': {display: 'Hyves', icon: 153,
			url: 'http://www.hyves.net/profilemanage/add/tips/?text={u}&amp;name={t}&amp;type=12'},
		'identica': {display: 'identi.ca', icon: 92,
			url: 'http://identi.ca/notice/new?status_textarea={t}%20{u}'},
		'imera': {display: 'Imera', icon: 93,
			url: 'http://www.imera.com.br/post_d.html?linkUrl={u}&amp;linkName={t}'},
		'instapaper': {display: 'Instapaper', icon: 94,
			url: 'http://www.instapaper.com/b?u={u}&amp;t={y}'},
		'investorlinks': {display: 'InvestorLinks', icon: 154,
			url: 'http://www.investorlinks.com/zingiling/add/?url={u}&amp;title={t}'},
		'jamespot': {display: 'Jamespot', icon: 95,
			url: 'http://www.jamespot.com/?action=spotit&amp;url={u}'},
		'jumptags': {display: 'Jumptags', icon: 96,
			url: 'http://www.jumptags.com/add/?url={u}&amp;title={t}'},
		'kaboodle': {display: 'Kaboodle', icon: 65,
			url: 'http://www.kaboodle.com/grab/addItemWithUrl?url={u}&amp;pidOrRid=pid=&amp;redirectToKPage=true'},
		'kaevur': {display: 'Kaevur', icon: 189,
			url: 'http://www.kaevur.com/submit.php?url={u}'},
		'khabbr': {display: 'Khabbr', icon: 97,
			url: 'http://www.khabbr.com/submit.php?out=yes&amp;url={u}'},
		'kledy': {display: 'Kledy', icon: 98,
			url: 'http://www.kledy.de/submit.php?url={u}'},
		'kirtsy': {display: 'Kirtsy', icon: 54,
			url: 'http://www.kirtsy.com/submit.php?url={u}'},
		'kool': {display: 'Koolontheweb', icon: 43,
			url: 'http://www.koolontheweb.com/post?url={u}&amp;title={t}'},
		'kwoff': {display: 'Kwoff', icon: 155,
			url: 'http://www.kwoff.com/submit.php?url={u}'},
		'laaikit': {display: 'laaik.it', icon: 190,
			url: 'http://laaik.it/NewStoryCompact.aspx?uri={u}&amp;headline={t}&amp;description={d}'},
		'librerio': {display: 'Librerio', icon: 191,
			url: 'http://www.librerio.com/inbox?u={u}&amp;t={t}'},
	    'linkarena': {display: 'Linkarena', icon: 70,
			url: 'http://linkarena.com/bookmarks/addlink/?url={u}&amp;title={t}&amp;desc={d}&amp;tags='},			
		'linkagogo': {display: 'LinkaGoGo', icon: 18,
			url: 'http://www.linkagogo.com/go/AddNoPopup?url={u}&amp;title={t}'},
		'linkedin': {display: 'LinkedIn', icon: 66,
			url: 'http://www.linkedin.com/shareArticle?mini=true&amp;url={u}&amp;title={t}&amp;ro=false&amp;summary={d}&amp;source='},
		'linkninja': {display: 'LinkNinja', icon: 156,
			url: 'http://linkninja.com.br/enviar_link.php?story_url={u}'},
		'livejournal': {display: 'LiveJournal', icon: 19,
			url: 'http://www.livejournal.com/update.bml?subject={u}'},
		'lunch': {display: 'Lunch', icon: 157,
			url: 'http://www.lunch.com/Bookmarklet/LunchThis.html?url={u}'},
		'lynki': {display: 'Lynki', icon: 158,
			url: 'http://www.lynki.com/submit.php?url={u}'},
		'maple': {display: 'Maple', icon: 99,
			url: 'http://www.maple.nu/bookmarks/bookmarklet?bookmark[url]={u}&amp;bookmark[description]={t}'},
		'memori': {display: 'memori.ru', icon: 192,
			url: 'http://memori.ru/link/?sm=1&amp;u_data[url]={u}'},
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
		'mylinkvault': {display: 'MyLinkVault', icon: 100,
			url: 'http://www.mylinkvault.com/link-page.php?u={u}&amp;n={t}'},
		'myspace': {display: 'MySpace', icon: 25,
			url: 'http://www.myspace.com/Modules/PostTo/Pages/?u={u}&amp;t={t}'},
		'n4g': {display: 'N4G', icon: 56,
			url: 'http://www.n4g.com/tips.aspx?url={u}&amp;title={t}'},
		'netlog': {display: 'NetLog', icon: 101,
			url: 'http://www.netlog.com/go/manage/links/view=save&amp;origin=external&amp;url={u}&amp;title={t}'},
		'netscape': {display: 'Netscape', icon: 26,
			url: 'http://www.netscape.com/submit/?U={u}&amp;T={t}'},
		'netvibes': {display: 'Netvibes', icon: 102,
			url: 'http://www.netvibes.com/share?url={u}&amp;title={t}'},
		'netvouz': {display: 'Netvouz', icon: 27,
			url: 'http://netvouz.com/action/submitBookmark?url={u}&amp;title={t}&amp;popup=no'},
		'newstrust': {display: 'NewsTrust', icon: 103,
			url: 'http://newstrust.net/submit?url={u}&amp;title={t}&amp;ref=addtoany'},
		'newsvine': {display: 'Newsvine', icon: 28,
			url: 'http://www.newsvine.com/_wine/save?u={u}&amp;h={t}'},
		'nowpublic': {display: 'NowPublic', icon: 29,
			url: 'http://view.nowpublic.com/?src={u}&amp;t={t}'},
		'nujij': {display: 'Nujij', icon: 159,
			url: 'http://nujij.nl/jij.lynkx?u={u}&amp;t={t}&amp;b={d}'},
		'oknotizie': {display: 'OKNOtizie', icon: 57,
			url: 'http://oknotizie.alice.it/post?url={u}&amp;title={t}'},
		'oneview': {display: 'OneView', icon: 72,
			url: 'http://www.oneview.de/quickadd/neu/addBookmark.jsf?URL={u}&amp;title={t}'},
		'orkut': {display: 'Orkut', icon: 193,
			url: 'http://promote.orkut.com/preview?nt=orkut.com&amp;du={u}&amp;tt={t}&amp;cn='},
		'osmosus': {display: 'Osmosus', icon: 194,
			url: 'http://www.osmosus.com/share?url={u}&amp;title={t}&amp;description={d}'},
		'oyyla': {display: 'Oyyla', icon: 160,
			url: 'http://www.oyyla.com/gonder?phase=2&amp;url={u}'},
		'phonefavs': {display: 'PhoneFavs', icon: 161,
			url: 'http://phonefavs.com/bookmarks?action=add&amp;address={u}&amp;title={t}'},
		'pimpthisblog': {display: 'PimpThisBlog', icon: 162,
			url: 'http://pimpthisblog.com/Submit?url={u}&amp;title={t}'},
		'ping': {display: 'Ping', icon: 104,
			url: 'http://ping.fm/ref/?link={u}&amp;title={t}'},
		'planypus': {display: 'Planypus', icon: 163,
			url: 'http://planyp.us/plans/new/?url={u}&amp;title={t}'},
		'plaxo': {display: 'Plaxo Pulse', icon: 105,
			url: 'http://www.plaxo.com/pulse/?share_link={u}'},
		'plurk': {display: 'Plurk', icon: 164,
			url: 'http://www.plurk.com/m?content={u}&amp;qualifier=shares'},
		'polladium': {display: 'Polladium', icon: 165,
			url: 'http://www.polladium.com/poll-this.php?u={u}&amp;t={t}'},
		'posterus': {display: 'posterous', icon: 166,
			url: 'http://posterous.com/share?linkto={u}&amp;title={t}'},
		'propeller': {display: 'Propeller', icon: 58,
			url: 'http://www.propeller.com/submit/?U={u}&amp;T={t}'},
		'protopage': {display: 'Protopage', icon: 106,
			url: 'http://www.protopage.com/add-button-site?url={u}&amp;label={t}&amp;type=page'},
		'pusha': {display: 'Pusha', icon: 107,
			url: 'http://www.pusha.se/posta?url={u}'},
		'reddit': {display: 'reddit', icon: 30,
			url: 'http://reddit.com/submit?url={u}&amp;title={t}'},
		'scoopeo': {display: 'Scoopeo', icon: 46,
			url: 'http://www.scoopeo.com/scoop/new?newurl={u}&amp;title={t}'},
		'segnalo': {display: 'Segnalo', icon: 31,
			url: 'http://segnalo.alice.it/post.html.php?url={u}&amp;title={t}'},
		'shetoldme': {display: 'She Told Me', icon: 167,
			url: 'http://shetoldme.com/publish?url={u}&amp;title={t}&amp;body={d}'},
		'shoutwire': {display: 'ShoutWire', icon: 108,
			url: 'http://www.shoutwire.com/?s={u}'},
		'simpy': {display: 'Simpy', icon: 32,
			url: 'http://www.simpy.com/simpy/LinkAdd.do?href={u}&amp;title={t}'},
		'sitejot': {display: 'Sitejot', icon: 109,
			url: 'http://www.sitejot.com/addform.php?iSiteAdd={u}&amp;iSiteDes={t}'},
		'slashdot': {display: 'Slashdot', icon: 33,
			url: 'http://slashdot.org/bookmark.pl?url={u}&amp;title={t}'},
		'smaknews': {display: 'SmakNews', icon: 110,
			url: 'http://smaknews.com/submit.php?url={u}&amp;title={t}'},
		'sodahead': {display: 'SodaHead', icon: 168,
			url: 'http://partners.sodahead.com/news/submit/?url={u}&amp;title={t}'},
		'sonico': {display: 'Sonico', icon: 169,
			url: 'http://www.sonico.com/share.php?url={u}&amp;title={t}'},
		'sphinn': {display: 'Sphinn', icon: 44,
			url: 'http://sphinn.com/submit.php?url={u}&amp;title={t}'},
		'spurl': {display: 'Spurl', icon: 35,
			url: 'http://www.spurl.net/spurl.php?url={u}&amp;title={t}'},
		'squidoo': {display: 'Squidoo', icon: 42,
			url: 'http://www.squidoo.com/lensmaster/bookmark?{u}&amp;title={t}'},
		'startaid': {display: 'StartAid', icon: 111,
			url: 'http://www.startaid.com/index.php?st=AddBrowserLink&amp;type=Detail&amp;v=3&amp;urlname={u}&amp;urltitle={t}'},
		'strands': {display: 'Strands', icon: 112,
			url: 'http://www.strands.com/tools/share/webpage?url={u}&amp;title={t}'},
		'studivz': {display: 'studiVZ', icon: 195,
			url: 'http://www.studivz.net/Suggest/Selection/?u={u}&amp;desc={t}'},
		'stumbleupon': {display: 'StumbleUpon', icon: 36,
			url: 'http://www.stumbleupon.com/submit?url={u}&amp;title={t}'},
		'stumpedia': {display: 'Stumpedia', icon: 113,
			url: 'http://www.stumpedia.com/submit?url={u}&amp;title={t}'},
		'stylehive': {display: 'Stylehive', icon: 196,
			url: 'http://www.stylehive.com/savebookmark/index.htm?url={u}'},
		'svejo': {display: 'Svejo', icon: 170,
			url: 'http://svejo.net/story/submit_by_url?url={u}&amp;title={t}&amp;summary={d}'},
		'tagza': {display: 'Tagza', icon: 115,
			url: 'http://www.tagza.com/submit.php?url={u}'},
		'technorati': {display: 'Technorati', icon: 38,
			url: 'http://www.technorati.com/faves?add={u}'},
		'technotizie': {display: 'Technotizie', icon: 117,
			url: 'http://www.technotizie.it/posta_ok?action=f2&amp;url={u}&amp;title={t}'},
		'tellmypolitician': {display: 'TellMyPolitician', icon: 171,
			url: 'http://tellmypolitician.com/search?u={u}&amp;title={t}'},
		'thisnext': {display: 'ThisNext', icon: 39,
			url: 'http://www.thisnext.com/pick/new/submit/sociable/?url={u}&amp;name={t}'},
		'tipd': {display: 'Tip\'d', icon: 118,
			url: 'http://tipd.com/submit.php?url={u}'},
		'transferr': {display: 'Transferr', icon: 197,
			url: 'http://www.transferr.com/link.php?url={u}'},
		'tulinq': {display: 'tulinq', icon: 198,
			url: 'http://www.tulinq.com/enviar?url={u}&amp;title={t}&amp;body={d}'},
		'tumblr': {display: 'tumblr', icon: 119,
			url: 'http://www.tumblr.com/share?v=3&amp;u={u}&amp;t={t}'},
		'tusul': {display: 'tusul.com', icon: 199,
			url: 'http://www.tusul.com/submit.php?url={u}&amp;title={t}&amp;bodytext={d}'},
		'twitthis': {display: 'TwitThis', icon: 45,
			url: 'http://twitthis.com/twit?url={u}'},
		'viadeo': {display: 'Viadeo', icon: 120,
			url: 'http://www.viadeo.com/shareit/share/?url={u}&amp;title={t}'},
		'virb': {display: 'Virb', icon: 172,
			url: 'http://virb.com/share?external&amp;v=2&amp;url={u}&amp;title={t}'},
		'vodpod': {display: 'Vodpod', icon: 121,
			url: 'http://vodpod.com/account/add_video_page?p={u}'},
		'webnews': {display: 'WebNews', icon: 122,
			url: 'http://www.webnews.de/einstellen?url={u}&amp;title={t}'},
		'wikio': {display: 'Wikio', icon: 47,
			url: 'http://www.wikio.com/vote?newurl={u}'},
		'windows': {display: 'Windows Live', icon: 40,
			url: 'https://favorites.live.com/quickadd.aspx?marklet=1&amp;mkt=en-us&amp;url={u}&amp;title={t}'},
		'wishlist': {display: 'Amazon WishList', icon: 123,
			url: 'http://www.amazon.com/wishlist/add?u={u}&amp;t={t}'},
		'wists': {display: 'Wists', icon: 124,
			url: 'http://wists.com/r.php?r={u}&amp;title={t}'},
		'worio': {display: 'Worio', icon: 173,
			url: 'http://www.worio.com/search/preview/?action=save&amp;wref=addthis&amp;u={u}&amp;t={t}'},
		'wovre': {display: 'Wovre', icon: 174,
			url: 'http://www.wovre.com/share.php?link_url={u}'},
		'wykop': {display: 'Wykop', icon: 175,
			url: 'http://www.wykop.pl/dodaj?url={u}&amp;title={t}&amp;desc={d}'},
		'xanga': {display: 'Xanga', icon: 59,
			url: 'http://www.xanga.com/private/editorx.aspx?u={u}&amp;t={t}'},
		'xerpi': {display: 'Xerpi', icon: 125,
			url: 'http://www.xerpi.com/block/add_link_from_extension?url={u}&amp;title={t}'},
		'yahoo': {display: 'Yahoo Bookmarks', icon: 60,
			url: 'http://bookmarks.yahoo.com/toolbar/savebm?opener=tb&amp;u={u}&amp;t={t}'},
		'yahoobuzz': {display: 'Yahoo Buzz', icon: 67,
			url: 'http://buzz.yahoo.com/submit?submitUrl={u}&amp;submitHeadline={t}'},
		'yammer': {display: 'Yammer', icon: 176,
			url: 'http://www.yammer.com/home?status={t} {u}'},
		'yigg': {display: 'Yigg', icon: 61,
			url: 'http://www.yigg.de/neu?exturl={u}&amp;exttitle={t}'},
		'yoolink': {display: 'yoolink', icon: 126,
			url: 'http://www.yoolink.fr/post/tag?f=aa&amp;url_value={u}&amp;title={t}'},
		'yorumcuyum': {display: 'Yorumcuyum', icon: 177,
			url: 'http://www.yorumcuyum.com/?link={u}&amp;baslik={t}'},
		'youmob': {display: 'YouMob', icon: 178,
			url: 'http://youmob.com/mobit.aspx?mob={u}&amp;title={t}'}
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
		if (!target[0].id) {
			target[0].id = 'bm' + (++this._uuid);
		}
		this._updateBookmark(target, settings);
	},

	/* Reconfigure the settings for a bookmarking div.
	   @param  target    (element) the bookmark container
	   @param  settings  (object) the new settings for this container or
	                     (string) a single setting name
	   @param  value     (any) the single setting's value */
	_changeBookmark: function(target, settings, value) {
		target = $(target);
		if (!target.hasClass(this.markerClassName)) {
			return;
		}
		if (typeof settings == 'string') {
			var name = settings;
			settings = {};
			settings[name] = value;
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
		var html = (settings.popup ? '<a href="#" class="bookmark_popup_text">' +
			settings.popupText + '</a><div class="bookmark_popup">' : '') +
			'<ul class="bookmark_list' + (settings.compact ? ' bookmark_compact' : '') + '">';
		var addSite = function(display, icon, url, onclick) {
			var html = '<li><a href="' + url + '"' + (onclick ? ' onclick="' + onclick + '"' :
				(settings.target ? ' target="' + settings.target + '"' : '')) + '>';
			if (icon != null) {
				var title = hint.replace(/\{s\}/, display);
				if (typeof icon == 'number') {
					html += '<span title="' + title + '" ' +
						(settings.iconsStyle ? 'class="' + settings.iconsStyle + '" ' : '') +
						'style="' + (settings.iconsStyle ? 'background-position: ' :
						'background: transparent url(' + settings.icons + ') no-repeat ') + '-' +
						((icon % settings.iconCols) * settings.iconSize) + 'px -' +
						(Math.floor(icon / settings.iconCols) * settings.iconSize) + 'px;' +
						($.browser.mozilla && $.browser.version < '1.9' ?
						' padding-left: ' + settings.iconSize + 'px; padding-bottom: ' +
						(Math.max(0, settings.iconSize - 16)) + 'px;' : '') + '"></span>';
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
		var desc = settings.description || '';
		if (settings.addFavorite) {
			html += addSite(settings.favoriteText, settings.favoriteIcon,
				'#', 'jQuery.bookmark._addFavourite(\'' + url.replace(/'/g, '\\\'') +
				'\',\'' + title.replace(/'/g, '\\\'') + '\')');
		}
		if (settings.addEmail) {
			html += addSite(settings.emailText, settings.emailIcon,
				'mailto:?subject=' + encodeURIComponent(settings.emailSubject) +
				'&amp;body=' + encodeURIComponent(settings.emailBody.
				replace(/\{u\}/, url).replace(/\{t\}/, title).replace(/\{d\}/, settings.desc)));
		}
		var sourceTag = (!settings.sourceTag ? '' :
			encodeURIComponent((url.indexOf('?') > -1 ? '&' : '?') + settings.sourceTag + '='));
		url = encodeURIComponent(url);
		title = encodeURIComponent(title);
		desc = encodeURIComponent(desc);
		var allSites = this._sites;
		$.each(sites, function(index, id) {
			var site = allSites[id];
			if (site) {
				html += addSite(site.display, site.icon, (settings.onSelect ? '#' :
					site.url.replace(/\{u\}/, url + (sourceTag ? sourceTag + id : '')).
					replace(/\{t\}/, title).replace(/\{d\}/, desc)),
					(settings.onSelect ? 'return jQuery.bookmark._selected(\'' + target[0].id +
					'\',\'' + id + '\')' : ''));
			}
		});
		html += '</ul>' + (settings.popup ? '</div>' : '');
		target.html(html);
		if (settings.popup) {
			target.find('.bookmark_popup_text').click(function() {
				var target = $(this).parent();
				var offset = target.offset();
				target.find('.bookmark_popup').css('left', offset.left).
					css('top', offset.top + target.outerHeight()).toggle();
				return false;
			});
			$(document).click(function(event) { // Close on external click
				target.find('.bookmark_popup').hide();
			});
		}
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

	/* Callback when selected.
	   @param  id      (string) the target ID
	   @param  siteID  (string) the selected site ID */
	_selected: function(id, siteID) {
		var target = $('#' + id)[0];
		var settings = $.data(target, PROP_NAME);
		var site = $.bookmark._sites[siteID];
		var url = settings.url || window.location.href;
		var sourceTag = (!settings.sourceTag ? '' :
			encodeURIComponent((url.indexOf('?') > -1 ? '&' : '?') + settings.sourceTag + '='));
		var url = encodeURIComponent(url);
		var title = encodeURIComponent(settings.title || document.title);
		var desc = encodeURIComponent(settings.description || '');
		settings.onSelect.apply(target, [siteID, site.display,
			site.url.replace(/\{u\}/, url + (sourceTag ? sourceTag + siteID : '')).
			replace(/\{t\}/, title).replace(/\{d\}/, desc)]);
		return false;
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
