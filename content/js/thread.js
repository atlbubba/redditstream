
// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/b741eaea14df1f06e4529ffd990628e5
// Or build this file again with packager using: packager build More/Date More/Date.Extras More/Request.JSONP
/*
---
copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
MooTools.More={version:"1.4.0.1",build:"a4244edf2aa97ac8a196fc96082dd35af1abab87"};(function(){var b=function(c){return c!=null;};var a=Object.prototype.hasOwnProperty;
Object.extend({getFromPath:function(e,f){if(typeof f=="string"){f=f.split(".");}for(var d=0,c=f.length;d<c;d++){if(a.call(e,f[d])){e=e[f[d]];}else{return null;
}}return e;},cleanValues:function(c,e){e=e||b;for(var d in c){if(!e(c[d])){delete c[d];}}return c;},erase:function(c,d){if(a.call(c,d)){delete c[d];}return c;
},run:function(d){var c=Array.slice(arguments,1);for(var e in d){if(d[e].apply){d[e].apply(d,c);}}return d;}});})();(function(){var b=null,a={},e={};var d=function(g){if(instanceOf(g,f.Set)){return g;
}else{return a[g];}};var f=this.Locale={define:function(g,k,i,j){var h;if(instanceOf(g,f.Set)){h=g.name;if(h){a[h]=g;}}else{h=g;if(!a[h]){a[h]=new f.Set(h);
}g=a[h];}if(k){g.define(k,i,j);}if(k=="cascade"){return f.inherit(h,i);}if(!b){b=g;}return g;},use:function(g){g=d(g);if(g){b=g;this.fireEvent("change",g);
this.fireEvent("langChange",g.name);}return this;},getCurrent:function(){return b;},get:function(h,g){return(b)?b.get(h,g):"";},inherit:function(g,h,i){g=d(g);
if(g){g.inherit(h,i);}return this;},list:function(){return Object.keys(a);}};Object.append(f,new Events);f.Set=new Class({sets:{},inherits:{locales:[],sets:{}},initialize:function(g){this.name=g||"";
},define:function(j,h,i){var g=this.sets[j];if(!g){g={};}if(h){if(typeOf(h)=="object"){g=Object.merge(g,h);}else{g[h]=i;}}this.sets[j]=g;return this;},get:function(s,k,r){var q=Object.getFromPath(this.sets,s);
if(q!=null){var n=typeOf(q);if(n=="function"){q=q.apply(null,Array.from(k));}else{if(n=="object"){q=Object.clone(q);}}return q;}var j=s.indexOf("."),p=j<0?s:s.substr(0,j),m=(this.inherits.sets[p]||[]).combine(this.inherits.locales).include("en-US");
if(!r){r=[];}for(var h=0,g=m.length;h<g;h++){if(r.contains(m[h])){continue;}r.include(m[h]);var o=a[m[h]];if(!o){continue;}q=o.get(s,k,r);if(q!=null){return q;
}}return"";},inherit:function(h,i){h=Array.from(h);if(i&&!this.inherits.sets[i]){this.inherits.sets[i]=[];}var g=h.length;while(g--){(i?this.inherits.sets[i]:this.inherits.locales).unshift(h[g]);
}return this;}});var c=MooTools.lang={};Object.append(c,f,{setLanguage:f.use,getCurrentLanguage:function(){var g=f.getCurrent();return(g)?g.name:null;},set:function(){f.define.apply(this,arguments);
return this;},get:function(i,h,g){if(h){i+="."+h;}return f.get(i,g);}});})();Locale.define("en-US","Date",{months:["January","February","March","April","May","June","July","August","September","October","November","December"],months_abbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],days_abbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dateOrder:["month","date","year"],shortDate:"%m/%d/%Y",shortTime:"%I:%M%p",AM:"AM",PM:"PM",firstDayOfWeek:0,ordinal:function(a){return(a>3&&a<21)?"th":["th","st","nd","rd","th"][Math.min(a%10,4)];
},lessThanMinuteAgo:"less than a minute ago",minuteAgo:"about a minute ago",minutesAgo:"{delta} minutes ago",hourAgo:"about an hour ago",hoursAgo:"about {delta} hours ago",dayAgo:"1 day ago",daysAgo:"{delta} days ago",weekAgo:"1 week ago",weeksAgo:"{delta} weeks ago",monthAgo:"1 month ago",monthsAgo:"{delta} months ago",yearAgo:"1 year ago",yearsAgo:"{delta} years ago",lessThanMinuteUntil:"less than a minute from now",minuteUntil:"about a minute from now",minutesUntil:"{delta} minutes from now",hourUntil:"about an hour from now",hoursUntil:"about {delta} hours from now",dayUntil:"1 day from now",daysUntil:"{delta} days from now",weekUntil:"1 week from now",weeksUntil:"{delta} weeks from now",monthUntil:"1 month from now",monthsUntil:"{delta} months from now",yearUntil:"1 year from now",yearsUntil:"{delta} years from now"});
(function(){var a=this.Date;var f=a.Methods={ms:"Milliseconds",year:"FullYear",min:"Minutes",mo:"Month",sec:"Seconds",hr:"Hours"};["Date","Day","FullYear","Hours","Milliseconds","Minutes","Month","Seconds","Time","TimezoneOffset","Week","Timezone","GMTOffset","DayOfYear","LastMonth","LastDayOfMonth","UTCDate","UTCDay","UTCFullYear","AMPM","Ordinal","UTCHours","UTCMilliseconds","UTCMinutes","UTCMonth","UTCSeconds","UTCMilliseconds"].each(function(s){a.Methods[s.toLowerCase()]=s;
});var p=function(u,t,s){if(t==1){return u;}return u<Math.pow(10,t-1)?(s||"0")+p(u,t-1,s):u;};a.implement({set:function(u,s){u=u.toLowerCase();var t=f[u]&&"set"+f[u];
if(t&&this[t]){this[t](s);}return this;}.overloadSetter(),get:function(t){t=t.toLowerCase();var s=f[t]&&"get"+f[t];if(s&&this[s]){return this[s]();}return null;
}.overloadGetter(),clone:function(){return new a(this.get("time"));},increment:function(s,u){s=s||"day";u=u!=null?u:1;switch(s){case"year":return this.increment("month",u*12);
case"month":var t=this.get("date");this.set("date",1).set("mo",this.get("mo")+u);return this.set("date",t.min(this.get("lastdayofmonth")));case"week":return this.increment("day",u*7);
case"day":return this.set("date",this.get("date")+u);}if(!a.units[s]){throw new Error(s+" is not a supported interval");}return this.set("time",this.get("time")+u*a.units[s]());
},decrement:function(s,t){return this.increment(s,-1*(t!=null?t:1));},isLeapYear:function(){return a.isLeapYear(this.get("year"));},clearTime:function(){return this.set({hr:0,min:0,sec:0,ms:0});
},diff:function(t,s){if(typeOf(t)=="string"){t=a.parse(t);}return((t-this)/a.units[s||"day"](3,3)).round();},getLastDayOfMonth:function(){return a.daysInMonth(this.get("mo"),this.get("year"));
},getDayOfYear:function(){return(a.UTC(this.get("year"),this.get("mo"),this.get("date")+1)-a.UTC(this.get("year"),0,1))/a.units.day();},setDay:function(t,s){if(s==null){s=a.getMsg("firstDayOfWeek");
if(s===""){s=1;}}t=(7+a.parseDay(t,true)-s)%7;var u=(7+this.get("day")-s)%7;return this.increment("day",t-u);},getWeek:function(v){if(v==null){v=a.getMsg("firstDayOfWeek");
if(v===""){v=1;}}var x=this,u=(7+x.get("day")-v)%7,t=0,w;if(v==1){var y=x.get("month"),s=x.get("date")-u;if(y==11&&s>28){return 1;}if(y==0&&s<-2){x=new a(x).decrement("day",u);
u=0;}w=new a(x.get("year"),0,1).get("day")||7;if(w>4){t=-7;}}else{w=new a(x.get("year"),0,1).get("day");}t+=x.get("dayofyear");t+=6-u;t+=(7+w-v)%7;return(t/7);
},getOrdinal:function(s){return a.getMsg("ordinal",s||this.get("date"));},getTimezone:function(){return this.toString().replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/,"$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,"$1$2$3");
},getGMTOffset:function(){var s=this.get("timezoneOffset");return((s>0)?"-":"+")+p((s.abs()/60).floor(),2)+p(s%60,2);},setAMPM:function(s){s=s.toUpperCase();
var t=this.get("hr");if(t>11&&s=="AM"){return this.decrement("hour",12);}else{if(t<12&&s=="PM"){return this.increment("hour",12);}}return this;},getAMPM:function(){return(this.get("hr")<12)?"AM":"PM";
},parse:function(s){this.set("time",a.parse(s));return this;},isValid:function(s){if(!s){s=this;}return typeOf(s)=="date"&&!isNaN(s.valueOf());},format:function(s){if(!this.isValid()){return"invalid date";
}if(!s){s="%x %X";}if(typeof s=="string"){s=g[s.toLowerCase()]||s;}if(typeof s=="function"){return s(this);}var t=this;return s.replace(/%([a-z%])/gi,function(v,u){switch(u){case"a":return a.getMsg("days_abbr")[t.get("day")];
case"A":return a.getMsg("days")[t.get("day")];case"b":return a.getMsg("months_abbr")[t.get("month")];case"B":return a.getMsg("months")[t.get("month")];
case"c":return t.format("%a %b %d %H:%M:%S %Y");case"d":return p(t.get("date"),2);case"e":return p(t.get("date"),2," ");case"H":return p(t.get("hr"),2);
case"I":return p((t.get("hr")%12)||12,2);case"j":return p(t.get("dayofyear"),3);case"k":return p(t.get("hr"),2," ");case"l":return p((t.get("hr")%12)||12,2," ");
case"L":return p(t.get("ms"),3);case"m":return p((t.get("mo")+1),2);case"M":return p(t.get("min"),2);case"o":return t.get("ordinal");case"p":return a.getMsg(t.get("ampm"));
case"s":return Math.round(t/1000);case"S":return p(t.get("seconds"),2);case"T":return t.format("%H:%M:%S");case"U":return p(t.get("week"),2);case"w":return t.get("day");
case"x":return t.format(a.getMsg("shortDate"));case"X":return t.format(a.getMsg("shortTime"));case"y":return t.get("year").toString().substr(2);case"Y":return t.get("year");
case"z":return t.get("GMTOffset");case"Z":return t.get("Timezone");}return u;});},toISOString:function(){return this.format("iso8601");}}).alias({toJSON:"toISOString",compare:"diff",strftime:"format"});
var k=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],h=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];var g={db:"%Y-%m-%d %H:%M:%S",compact:"%Y%m%dT%H%M%S","short":"%d %b %H:%M","long":"%B %d, %Y %H:%M",rfc822:function(s){return k[s.get("day")]+s.format(", %d ")+h[s.get("month")]+s.format(" %Y %H:%M:%S %Z");
},rfc2822:function(s){return k[s.get("day")]+s.format(", %d ")+h[s.get("month")]+s.format(" %Y %H:%M:%S %z");},iso8601:function(s){return(s.getUTCFullYear()+"-"+p(s.getUTCMonth()+1,2)+"-"+p(s.getUTCDate(),2)+"T"+p(s.getUTCHours(),2)+":"+p(s.getUTCMinutes(),2)+":"+p(s.getUTCSeconds(),2)+"."+p(s.getUTCMilliseconds(),3)+"Z");
}};var c=[],n=a.parse;var r=function(v,x,u){var t=-1,w=a.getMsg(v+"s");switch(typeOf(x)){case"object":t=w[x.get(v)];break;case"number":t=w[x];if(!t){throw new Error("Invalid "+v+" index: "+x);
}break;case"string":var s=w.filter(function(y){return this.test(y);},new RegExp("^"+x,"i"));if(!s.length){throw new Error("Invalid "+v+" string");}if(s.length>1){throw new Error("Ambiguous "+v);
}t=s[0];}return(u)?w.indexOf(t):t;};var i=1900,o=70;a.extend({getMsg:function(t,s){return Locale.get("Date."+t,s);},units:{ms:Function.from(1),second:Function.from(1000),minute:Function.from(60000),hour:Function.from(3600000),day:Function.from(86400000),week:Function.from(608400000),month:function(t,s){var u=new a;
return a.daysInMonth(t!=null?t:u.get("mo"),s!=null?s:u.get("year"))*86400000;},year:function(s){s=s||new a().get("year");return a.isLeapYear(s)?31622400000:31536000000;
}},daysInMonth:function(t,s){return[31,a.isLeapYear(s)?29:28,31,30,31,30,31,31,30,31,30,31][t];},isLeapYear:function(s){return((s%4===0)&&(s%100!==0))||(s%400===0);
},parse:function(v){var u=typeOf(v);if(u=="number"){return new a(v);}if(u!="string"){return v;}v=v.clean();if(!v.length){return null;}var s;c.some(function(w){var t=w.re.exec(v);
return(t)?(s=w.handler(t)):false;});if(!(s&&s.isValid())){s=new a(n(v));if(!(s&&s.isValid())){s=new a(v.toInt());}}return s;},parseDay:function(s,t){return r("day",s,t);
},parseMonth:function(t,s){return r("month",t,s);},parseUTC:function(t){var s=new a(t);var u=a.UTC(s.get("year"),s.get("mo"),s.get("date"),s.get("hr"),s.get("min"),s.get("sec"),s.get("ms"));
return new a(u);},orderIndex:function(s){return a.getMsg("dateOrder").indexOf(s)+1;},defineFormat:function(s,t){g[s]=t;return this;},parsePatterns:c,defineParser:function(s){c.push((s.re&&s.handler)?s:l(s));
return this;},defineParsers:function(){Array.flatten(arguments).each(a.defineParser);return this;},define2DigitYearStart:function(s){o=s%100;i=s-o;return this;
}}).extend({defineFormats:a.defineFormat.overloadSetter()});var d=function(s){return new RegExp("(?:"+a.getMsg(s).map(function(t){return t.substr(0,3);
}).join("|")+")[a-z]*");};var m=function(s){switch(s){case"T":return"%H:%M:%S";case"x":return((a.orderIndex("month")==1)?"%m[-./]%d":"%d[-./]%m")+"([-./]%y)?";
case"X":return"%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?";}return null;};var j={d:/[0-2]?[0-9]|3[01]/,H:/[01]?[0-9]|2[0-3]/,I:/0?[1-9]|1[0-2]/,M:/[0-5]?\d/,s:/\d+/,o:/[a-z]*/,p:/[ap]\.?m\.?/,y:/\d{2}|\d{4}/,Y:/\d{4}/,z:/Z|[+-]\d{2}(?::?\d{2})?/};
j.m=j.I;j.S=j.M;var e;var b=function(s){e=s;j.a=j.A=d("days");j.b=j.B=d("months");c.each(function(u,t){if(u.format){c[t]=l(u.format);}});};var l=function(u){if(!e){return{format:u};
}var s=[];var t=(u.source||u).replace(/%([a-z])/gi,function(w,v){return m(v)||w;}).replace(/\((?!\?)/g,"(?:").replace(/ (?!\?|\*)/g,",? ").replace(/%([a-z%])/gi,function(w,v){var x=j[v];
if(!x){return v;}s.push(v);return"("+x.source+")";}).replace(/\[a-z\]/gi,"[a-z\\u00c0-\\uffff;&]");return{format:u,re:new RegExp("^"+t+"$","i"),handler:function(y){y=y.slice(1).associate(s);
var v=new a().clearTime(),x=y.y||y.Y;if(x!=null){q.call(v,"y",x);}if("d" in y){q.call(v,"d",1);}if("m" in y||y.b||y.B){q.call(v,"m",1);}for(var w in y){q.call(v,w,y[w]);
}return v;}};};var q=function(s,t){if(!t){return this;}switch(s){case"a":case"A":return this.set("day",a.parseDay(t,true));case"b":case"B":return this.set("mo",a.parseMonth(t,true));
case"d":return this.set("date",t);case"H":case"I":return this.set("hr",t);case"m":return this.set("mo",t-1);case"M":return this.set("min",t);case"p":return this.set("ampm",t.replace(/\./g,""));
case"S":return this.set("sec",t);case"s":return this.set("ms",("0."+t)*1000);case"w":return this.set("day",t);case"Y":return this.set("year",t);case"y":t=+t;
if(t<100){t+=i+(t<o?100:0);}return this.set("year",t);case"z":if(t=="Z"){t="+00";}var u=t.match(/([+-])(\d{2}):?(\d{2})?/);u=(u[1]+"1")*(u[2]*60+(+u[3]||0))+this.getTimezoneOffset();
return this.set("time",this-u*60000);}return this;};a.defineParsers("%Y([-./]%m([-./]%d((T| )%X)?)?)?","%Y%m%d(T%H(%M%S?)?)?","%x( %X)?","%d%o( %b( %Y)?)?( %X)?","%b( %d%o)?( %Y)?( %X)?","%Y %b( %d%o( %X)?)?","%o %b %d %X %z %Y","%T","%H:%M( ?%p)?");
Locale.addEvent("change",function(s){if(Locale.get("Date")){b(s);}}).fireEvent("change",Locale.getCurrent());})();Date.implement({timeDiffInWords:function(a){return Date.distanceOfTimeInWords(this,a||new Date);
},timeDiff:function(f,c){if(f==null){f=new Date;}var h=((f-this)/1000).floor().abs();var e=[],a=[60,60,24,365,0],d=["s","m","h","d","y"],g,b;for(var i=0;
i<a.length;i++){if(i&&!h){break;}g=h;if((b=a[i])){g=(h%b);h=(h/b).floor();}e.unshift(g+(d[i]||""));}return e.join(c||":");}}).extend({distanceOfTimeInWords:function(b,a){return Date.getTimePhrase(((a-b)/1000).toInt());
},getTimePhrase:function(f){var d=(f<0)?"Until":"Ago";if(f<0){f*=-1;}var b={minute:60,hour:60,day:24,week:7,month:52/12,year:12,eon:Infinity};var e="lessThanMinute";
for(var c in b){var a=b[c];if(f<1.5*a){if(f>0.75*a){e=c;}break;}f/=a;e=c+"s";}f=f.round();return Date.getMsg(e+d,f).substitute({delta:f});}}).defineParsers({re:/^(?:tod|tom|yes)/i,handler:function(a){var b=new Date().clearTime();
switch(a[0]){case"tom":return b.increment();case"yes":return b.decrement();default:return b;}}},{re:/^(next|last) ([a-z]+)$/i,handler:function(e){var f=new Date().clearTime();
var b=f.getDay();var c=Date.parseDay(e[2],true);var a=c-b;if(c<=b){a+=7;}if(e[1]=="last"){a-=7;}return f.set("date",f.getDate()+a);}}).alias("timeAgoInWords","timeDiffInWords");
Request.JSONP=new Class({Implements:[Chain,Events,Options],options:{onRequest:function(a){if(this.options.log&&window.console&&console.log){console.log("JSONP retrieving script with url:"+a);
}},onError:function(a){if(this.options.log&&window.console&&console.warn){console.warn("JSONP "+a+" will fail in Internet Explorer, which enforces a 2083 bytes length limit on URIs");
}},url:"",callbackKey:"callback",injectScript:document.head,data:"",link:"ignore",timeout:0,log:false},initialize:function(a){this.setOptions(a);},send:function(c){if(!Request.prototype.check.call(this,c)){return this;
}this.running=true;var d=typeOf(c);if(d=="string"||d=="element"){c={data:c};}c=Object.merge(this.options,c||{});var e=c.data;switch(typeOf(e)){case"element":e=document.id(e).toQueryString();
break;case"object":case"hash":e=Object.toQueryString(e);}var b=this.index=Request.JSONP.counter++;var f=c.url+(c.url.test("\\?")?"&":"?")+(c.callbackKey)+"=Request.JSONP.request_map.request_"+b+(e?"&"+e:"");
if(f.length>2083){this.fireEvent("error",f);}Request.JSONP.request_map["request_"+b]=function(){this.success(arguments,b);}.bind(this);var a=this.getScript(f).inject(c.injectScript);
this.fireEvent("request",[f,a]);if(c.timeout){this.timeout.delay(c.timeout,this);}return this;},getScript:function(a){if(!this.script){this.script=new Element("script",{type:"text/javascript",async:true,src:a});
}return this.script;},success:function(b,a){if(!this.running){return;}this.clear().fireEvent("complete",b).fireEvent("success",b).callChain();},cancel:function(){if(this.running){this.clear().fireEvent("cancel");
}return this;},isRunning:function(){return !!this.running;},clear:function(){this.running=false;if(this.script){this.script.destroy();this.script=null;
}return this;},timeout:function(){if(this.running){this.running=false;this.fireEvent("timeout",[this.script.get("src"),this.script]).fireEvent("failure").cancel();
}return this;}});Request.JSONP.counter=0;Request.JSONP.request_map={};


// this is now implemented in mootool.more (finally!)
Element.implement({
   show: function() {this.setStyle('display','');},
   hide: function() {this.setStyle('display','none');}
});

String.implement({
	decodeEntities: (function() {
		// this prevents any overhead from creating the object each time
		var element = document.createElement('div');

		var decodeHTMLEntities = function() {
			str = this;

			if(str && $type(str) === 'string') {

				// strip script/html tags
				str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
				str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
				element.innerHTML = str;
				str = element.textContent;
				element.textContent = '';
			}

			return str;
		}

		return decodeHTMLEntities;
	})()
});

/*
 * JsTemplate: convert template into an element object.
 *
 * example:
 * <!-- this goes in <head>, the browser will ignore it if the type is not text/javascript -->
 * <script id='tmpl-entry' type='text/html'>
 *   <div>
 *     <b>#{title}<b>
 *     <div>#{text}</div>
 *   </div>
 * </script>
 *
 * // replaces #{title} & #{text} with the actual text in the data object, then
 * // inserts the element into <body>
 * new JsTemplate('tmpl-entry').render({title: 'test', text:'test text'}).inject('body');
 *
 * License: MIT-Style License
 * Nathan Reed (c) 2010
 */
var JsTemplate = new Class({
   initialize: function(elem) {
      this.element = $(elem);
      this.regex = /\\?#\{([^{}]+)\}/g; // matches '#{keyword}'
   },

   render: function(data) {
      if($defined(this.element)) {
         // replaces #{name} with whatever is in data.name
         // but first we need to normalize the innerHTML
         var html_string = this.element.innerHTML.clean().trim(); // collapses mulitple whitespace down to single spaces
         var is_td = false;

         if(html_string.test(/^<td/i)) {
            // tables are treated differently. we are not allow to just parse and insert
            // them willy nilly.
            html_string = "<table><tbody><tr>" + html_string + "</tr></tbody></table>";
            is_td = true;
         }

         var e = new Element('div', {'html': html_string.substitute(data, this.regex)});

         if(is_td) {
            return e.getFirst('table').getFirst('tbody').getFirst('tr').getFirst();
         } else {
            return e.getFirst();
         }
      }
   }
});

// @depends mootools-1.2.4-core.js
//
// $e(): Use the mootools new element function to chain up element creation in a nice way
//
// eg. $e('b', 'bold text'); -> <b>bold text</b>
//     $e('a', {'href': 'http://www.google.com', 'text': 'google'}); -> <a href='http://www.google.com'>google</a>
//
// A more complex example using children:
//
//    $e('a', {
//       'href': './home',
//       'children': [
//          $e('img', {'src': './logo.png', 'title': 'popacular'}),
//          $e('span', 'popacular.com/home')
//       ]
//    });
//
// gives:
// <a href='./home'>
//    <img src='./logo.png' title='popacular' />
//    <span>popacular.com/home<span>
//  </a>
//
// Created:  2010-05-21
// License: MIT-Style License
// Nathan Reed (c) 2010
//
$e = function(tag, props) {
   tag = tag || 'div';

   if($type(tag) == 'object' && $undefined(props)) {
      props = tag;
      tag = 'div'
   }

   if(!$defined(props)) {
      return new Element(tag);
   }

   // normalize the properties element for the
   // mootools element constructor
   if($type(props) == 'string') {
      props = {'text': props};
   } else if($type(props) == 'element' || $type(props) == 'array') {
      props = {'children': props};
   }

   // remove the children property from the array, we don't want it in there.
   // because when we pass these properties to the mootools element function it
   // might get confused.
   var children = props.children;
   props.children = null;

   var new_element = new Element(tag, props);

   if($defined(children)) {

      if($type(children) == 'element') {
         // if they have just passed through one child, then
         // normalize it by turning it into an array with one element.
         children = [children];
      }

      // add the children to the new element one by one
      children.each(function(item) {
         new_element.grab(item);
      });

   }

   return new_element
}

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

		this.unread_count = 0;
		this.no_focus = false;
		this.post_title = null;

		window.addEvent('focus', function() {
			this.no_focus = false;
			this.unread_count = 0;

			// for some strange reason, there needs to be a delay between getting focus and seeting
			// the title, otherwise the title will not change properly. Anything less than
			// 100 ms seems to cause problems.
			var d = function() { document.title = Ui.post_title + ' - redditstream'; }.delay(100);
		}.bind(Ui));

		window.addEvent('blur', function() {
			this.no_focus = true;
		}.bind(Ui));

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
					this.post_title = post_info.data.title;
				}

				this.add_comments(comments.new_list);
				this.refresh_comments(comments.old_list);

				if(this.no_focus == true) {
					// when the windows doesn't have focus we want to show the number of unread messages in the
					// title
					this.unread_count += comments.new_list.length;

				}

				if(this.unread_count != 0) {
					document.title = '(' + this.unread_count + ') ' + this.post_title + ' - reddit-stream.com';
				}

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

		if(in_new == false) {
			// every single comment we received was new, but they all ended up
			// in the old_list, cause we never reached the sentinal at the end
			// that matches something on the page. So we just swap the old and new
			// and return
			result.new_list = result.old_list;
			result.old_list = [];
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

		// only update the title if the page has focus - otherwise we will show the unread count
		if(!this.no_focus) {
			document.title = post_info.data.title + ' - reddit-stream.com';
		}
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
		if (!this.data.author_flair_text) {
			this.data.add_flair_class = 'hidden';
		}
		else {
			this.data.add_flair_class = '';
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

		options.url = '/shared/proxy-wrapper.php?user_agent=' + user_agent + '&send_cookies=1&mode=native&url=' + escape(options.url);
		options.onFailure = function(xhr) {
			alert('Error: ' + xhr.status + ' - ' + xhr.statusText);
		}

		this.parent(options);
	}
});
