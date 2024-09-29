var mouseTimer=null,cursorVisible=true;document.onmousemove=()=>{if(mouseTimer){window.clearTimeout(mouseTimer)};if(!cursorVisible){document.getElementsByTagName("html")[0].style.cursor="default";cursorVisible=true};mouseTimer=window.setTimeout(()=>{mouseTimer=null;document.getElementsByTagName("html")[0].style.cursor="none";cursorVisible=false},3E+3)};
document.onkeydown=(e)=>{if(e.ctrlKey&&e.shiftKey&&["C","J","I"].includes(e.key.toUpperCase())){return(false)};if(e.ctrlKey&&["C","S","U"].includes(e.key.toUpperCase())){return(false)}};
if(!String.prototype.format){String.prototype.format=function(){var args=arguments;return(this.replace(/{(\d+)}/g,function(match,number){return(typeof args[number]!="undefined"?args[number]:match)}))}};
function $(s){return new Elements(document.querySelectorAll(s))}function Elements(e){this.e=e,this.l={}}
Elements.prototype={
    addClass:function(c){this.e[0].classList.add(c);return this},
    append:function(c){this.e[0].appendChild(c);return this},
    attr:function(n,v) {if(v===undefined)return (this.e[0]||this.e).getAttribute(n);else (this.e[0]||this.e).setAttribute(n,v);return this},
    css:function(p,v){if(v){this.e[0].style[p]=v;return this}return this.e[0].style[p]},
    find:function(s){const e=this.e[0].querySelectorAll(s);return new Elements(e)},
    get:function(i){return new Elements(this.e[i])},
    hide:function(){this.e[0].style.display="none";return this},
    html:function(h){if(h){this.e[0].innerHTML=h;return this}return this.e[0].innerHTML},
    insertBefore:function(s){const e=document.querySelector(s);e.parentNode.insertBefore(this.e[0],e);return this},
    off:function(e,c){this.e[0].removeEventListener(e,c);return this},
    on:function(e,c,t=3000){if(this.l[e])this.off(e,this.l[e]);this.l[e]=c;if(e==="longpress"){var o,cancel=function(){clearTimeout(o)};this.e[0].addEventListener("touchstart",function(){o=setTimeout(function(){o=null;c()},t)});this.e[0].addEventListener("mousedown",function(){this.dispatchEvent(new Event("touchstart"))});this.e[0].addEventListener("touchend",cancel);this.e[0].addEventListener("mouseup",cancel);this.e[0].addEventListener("touchmove",cancel);this.e[0].addEventListener("mouseleave",cancel)}else{this.e[0].addEventListener(e,c)}return this},
    removeClass:function(c){this.e[0].classList.remove(c);return this},show:function(){this.e[0].style.display="block";return this},
    style:function(s){if(s){this.e[0].style=s;return this}return this.e[0].style},
    toggle:function(){this.e[0].style.display=this.e[0].style.display=="none"?"block":"none";return this},
    width:function(w){if(w)this.e[0].style.width=`${w}px`;return this.e[0].offsetWidth},
    height:function(h){if(h)this.e[0].style.height=`${h}px`;return this.e[0].offsetHeight}
};
$.cookie=function(n,v,o){if(typeof v!="undefined"){o=o||{};if(v===null){v="";o.expires=-1}var e="";if(o.expires&&(typeof o.expires=="number"||o.expires.toUTCString)){var d;if(typeof o.expires=="number"){d=new Date();d.setHours(23,59,59);d.setDate(d.getDate()+o.expires)}else{d=o.expires}e=";expires="+d.toUTCString()}document.cookie=[n,"=",encodeURIComponent(v),e,";path="+(o.path||"/"),(o.domain?";domain="+o.domain:""),(o.secure?";secure":"")].join("")}else{var r=new RegExp("(?:; )?"+n+"=([^;]*);?");if(r.test(document.cookie)){return decodeURIComponent(RegExp["$1"])}return null}};
$.getSearchObject=function(){if(location.search==="")return{};var o={};location.search.substr(1).split("&").forEach(pair=>{var[k,v]=pair.split("=");k=decodeURIComponent(k),v=decodeURIComponent(v)||null;if(o[k]){if(!(o[k]instanceof Array))o[k]=[o[k]];o[k].push(v)}else o[k]=v});return o};
$.createElements=(e,p)=>{e.forEach((e)=>{const t=document.createElement(e.tag);if(e.attrs){Object.keys(e.attrs).forEach((a)=>{t.setAttribute(a,e.attrs[a])})}if(e.children){e.children.forEach((c)=>{if(typeof c==="string"){t.innerHTML=c}else if(typeof c==="object"){$.createElements([c],t)}})}p.appendChild(t)})};
$.createEvalCSS=(s,r)=>{const t=document.querySelector("style");if(t){t.insertAdjacentText("beforeend",`${s}{${r}}`)}else{console.error("No style element found.")}};


const TWA_ProWebtoons = {
    title:Object.keys($.getSearchObject())[0],
    epsInfo:null,
    prev_eps:null,
    next_eps:null,
    client:{
        qwe:null,
        viewed:null,
        last_view:null
    },

    // full_data_src:"https://raw.githubusercontent.com/prowebtoons-thief/{0}/main/{1}/{2}.jpg",
    full_data_src:"{0}/{2}",
    lastScrollY:window.pageYOffset,
    scrolledStart:false,

    getChapter:function(v){
        const chapterMetaTag = $("meta[name='chapter']");
        if (v)chapterMetaTag.attr("content", v);
        return chapterMetaTag.attr("content");
    },
    fixedTool:function(s=0){
        var active = (this.to_Prev.attr('class')||'').includes('active');
        if (s==1) {
            return {
                active:active,
                show:()=>{
                    this.btn_epsL.addClass('active'),
                    this.to_Top.addClass('active'),
                    this.to_Down.addClass('active'),
                    this.to_Prev.addClass('active'),
                    this.to_Next.addClass('active'),
                    this.opt_episode.addClass('active')
                },
                hide:()=>{
                    this.btn_epsL.removeClass('active'),
                    this.to_Top.removeClass('active'),
                    this.to_Down.removeClass('active'),
                    this.to_Prev.removeClass('active'),
                    this.to_Next.removeClass('active'),
                    this.opt_episode.removeClass('active')
                }
            }
        }
        if (!active) this.fixedTool(1).show();
        else this.fixedTool(1).hide();
    },
    scrolled:function(){
        if(!this.scrolledStart)return;
        updateProgress();
        var ScrollY=window.pageYOffset;
        if(Math.abs(ScrollY-this.lastScrollY)>=10) {
            if(this.scrolling||(scrollY>this.lastScrollY)&&this.fixedTool(1).active)this.fixedTool(1).hide();
            else if(!this.scrolling&&scrollY<this.lastScrollY&&!this.fixedTool(1).active)this.fixedTool(1).show();
            this.lastScrollY=ScrollY
        }
    },
    referer:function(eps){
        if(!Object.keys(this.epsInfo.epsInfo).includes(eps)){this.description.show();return}
        document.title="#{0} .... Chapter {0}".format(eps.padStart(3,0));
        if(eps!==this.client.last_view){
            this.client.last_view=eps;
            this.client.qwe.thumb_img=0;
            this.client.qwe.scrollY=0;
            window.scrollTo(0,0)
        };
        this.description.hide();
        $('#fixed-tool').show();
        this.imageList.show();
        localStorage.setItem(`qwe.${this.title}`, JSON.stringify(this.client.qwe))
        localStorage.setItem(`last_view.${this.title}`, this.client.last_view)
        this.load_content(eps);progress_bar.width(1)
    },
    setImage:function(index){
        var imgTag = $("ul#imageList li img").get(index),
            wh = Math.max(window.innerHeight*3.1, window.innerHeight*3.1+imgTag.e.offsetHeight),
            iph = imgTag.e.offsetTop+imgTag.e.offsetHeight;

        if (window.scrollY-wh <= iph&&iph <= window.scrollY+wh) {
            // console.log('load image: {0}'.format(index+1))
            if (imgTag.attr("data-imglink"))var data_src=imgTag.attr("data-imglink");
            else var data_src=this.full_data_src.format(this.title,this.getChapter(),imgTag.attr("data-fname"));
            this.client.qwe.thumb_img = parseInt(imgTag.attr("data-sortOrder"));
            var isrc=imgTag.attr("src");
            if (isrc&&isrc!==data_src&&window.scrollY>=imgTag.e.offsetTop&&window.scrollY<=imgTag.e.offsetTop+imgTag.e.offsetHeight) {this.reloadImg(imgTag)}
            else if (!isrc) {imgTag.attr("src",data_src)};
        }
    },
    setdescription:function(){
        window.onscroll=undefined;
        if (this.description.html())this.description.html('');

        hr=()=>{var hr=document.createElement("hr");hr.setAttribute("style","margin:4px 12px;border-bottom:solid 2px #adadad88;");return(hr)};
        this.description.append(hr())
        this.description.append(hr())
        this.description.append(hr())
        if (this.epsInfo.description) {
            var p=document.createElement("p");
            p.innerHTML=this.epsInfo.description;
            this.description.append(p);
            this.description.append(hr())
            this.description.append(hr())
        }

        var div=document.createElement("div"),
            ul=document.createElement("ul");
        ul.setAttribute("id","bxcl");

        Object.keys(this.epsInfo.epsInfo).sort().reverse().forEach(eps=>{
            var li=document.createElement("li"),
                div=document.createElement("div");
            div.setAttribute("class","bxch");
            if(this.client.viewed&&this.client.viewed.includes(eps)){div.classList.add("viewed")};
            div.setAttribute("onclick","TWA_ProWebtoons.referer('{0}')".format(eps));
            div.setAttribute("onmouseover","this.getElementsByTagName('span')[0].classList.add('hover')");
            div.setAttribute("onmouseleave","this.getElementsByTagName('span')[0].classList.remove('hover')");
            var a=document.createElement("a"),
                sp=document.createElement("span");
            sp.setAttribute("class","epsTitle");
            if(eps==this.client.last_view){sp.classList.add("view")};
            sp.innerHTML="Chapter {0}".format(eps);
            a.appendChild(sp);
            var sp=document.createElement("span");
            sp.setAttribute("class","epsDate");
            sp.innerHTML=this.epsInfo.epsInfo[eps].date;
            a.appendChild(sp);
            div.appendChild(a);
            li.appendChild(div);
            ul.appendChild(li)
        });
        this.description.append(ul);

        var b=document.createElement("b");
        b.setAttribute("style","padding:1px 12px;");
        this.description.append(b);
        this.description.append(hr());
        this.description.append(hr());

        $('#fixed-tool').hide();
        this.imageList.hide();
        this.description.show();
        window.scrollTo(0,0);
        window.onscroll = function() {updateProgress()}
    },
    load_content:function(episode){
        this.getChapter(episode);
        Array.from(this.opt_episode.find('option').e).slice(1).forEach(e=>{
            if (e.value==episode) e.selected=true;
        });
        this.prev_eps = (""+(parseInt(episode)-1)).padStart(3, 0);
        this.next_eps = (""+(parseInt(episode)+1)).padStart(3, 0);
        // console.log(TWA_ProWebtoons.prev_eps, TWA_ProWebtoons.next_eps)
        if(Object.keys(this.epsInfo.epsInfo).indexOf(this.prev_eps)>=0){
            this.to_Prev.show();
            this.to_Prev.on('click', ()=>{
                TWA_ProWebtoons.referer(TWA_ProWebtoons.prev_eps)
            })
        } else this.to_Prev.hide();
        if(Object.keys(this.epsInfo.epsInfo).indexOf(this.next_eps)>=0){
            this.to_Next.show();
            this.to_Next.on("click", ()=>{
                TWA_ProWebtoons.referer(TWA_ProWebtoons.next_eps)
            })
        }else this.to_Next.hide();

        var imageList=$("ul#imageList").e[0].getElementsByTagName("li");
        if (imageList.length) Array.from(imageList).forEach(elem=>{elem.remove()});
        for (i=0;i<this.epsInfo.epsInfo[episode].imgInfo.length;i++) {
            var imgI = this.epsInfo.epsInfo[episode].imgInfo[i];
            var img_ctn = document.createElement("img");
            img_ctn.setAttribute("data-sortOrder","{0}".format(i+1));
            if (imgI.height>0) {
                img_ctn.width = imgI.width-2;
                img_ctn.height = (imgI.height *(window.innerWidth/imgI.width))
            }
            else img_ctn.style = 'min-height: 240px;';

            if (imgI.fname) img_ctn.setAttribute("data-fname", imgI.fname);
            else if (imgI.link) img_ctn.setAttribute("data-imglink", imgI.link);
            img_ctn.setAttribute("onerror","TWA_ProWebtoons.onImgError(this);");
            img_ctn.setAttribute("oncontextmenu","return false;");
            var li_img=document.createElement("li");
            li_img.setAttribute("onclick","TWA_ProWebtoons.fixedTool();");
            li_img.appendChild(img_ctn);
            this.imageList.append(li_img)
        };

        var thumb_img = this.client.qwe.thumb_img||3;
        for (var i=Math.max(0,thumb_img-3);i<thumb_img;i++) {this.setImage(i)};

        var scrollStart,lastPageYOffset=window.pageYOffset;
        window.onscroll = function() {
            TWA_ProWebtoons.scrolled();

            for (var i=0;i<imageList.length;i++) {TWA_ProWebtoons.setImage(i)};

            if (window.scrollY>=(document.body.scrollHeight-window.innerHeight*1.1)) {
                if (!TWA_ProWebtoons.client.viewed.includes(episode)) {
                    TWA_ProWebtoons.client.viewed.push(episode);
                    localStorage.setItem(`viewed.${TWA_ProWebtoons.title}`, TWA_ProWebtoons.client.viewed.join(''))
                };
                TWA_ProWebtoons.fixedTool(1).show()
            }

            TWA_ProWebtoons.client.qwe.scrollY = scrollStart = window.scrollY;
            if (Math.abs(window.pageYOffset-lastPageYOffset)>=100) {
                localStorage.setItem(`qwe.${TWA_ProWebtoons.title}`, JSON.stringify(TWA_ProWebtoons.client.qwe))
                lastPageYOffset = window.pageYOffset
            }
        };

        scrollStart = lastPageYOffset = this.client.qwe.scrollY;
        window.scrollTo(0,scrollStart);
        setTimeout(()=>{this.scrolledStart=true},666)
    },

    init:function(){

        this.btn_epsL = $('#fixed-tool #list-Episode'),
        this.btn_scroll = $('#fixed-tool #btn-scroll'),
        this.to_Top = this.btn_scroll.find('#to-Top'),
        this.to_Down = this.btn_scroll.find('#to-Down'),
        this.footer_bar = $('#fixed-tool #footer-bar'),
        this.to_Prev = this.footer_bar.find('#to-Prev'),
        this.to_Next = this.footer_bar.find('#to-Next'),
        this.opt_episode = this.footer_bar.find('#opt-Episode'),
        this.content = $("section#content"),
        this.description = $("div#description"),
        this.imageList = $("ul#imageList");

        this.scrolling = false;
        var windowHeight = window.innerHeight;
        var scrollTo = function(to=0) {window.scrollTo({top: to, behavior: 'auto'})};
        this.to_Top.on('click', function(event) {
            event.preventDefault();
            var scrollAnimation = function() {
                var currentScroll = window.scrollY;
                if (currentScroll == 0) {
                    TWA_ProWebtoons.scrolling = false;
                    TWA_ProWebtoons.fixedTool(1).show()
                }
                else TWA_ProWebtoons.scrolling = true;
                if (currentScroll > 0) {
                    scrollTo(currentScroll -windowHeight);
                    setTimeout(scrollAnimation, 10);
                } else scrollTo();
                
            };
            if (!TWA_ProWebtoons.scrolling) scrollAnimation();
        });
        this.to_Down.on('click', function(event) {
            event.preventDefault();
            var documentHeight = document.body.scrollHeight -windowHeight;
            var scrollAnimation = function() {
                var currentScroll = window.scrollY;
                if (currentScroll == documentHeight) TWA_ProWebtoons.scrolling = false;
                else TWA_ProWebtoons.scrolling = true;
                if (currentScroll < documentHeight) {
                    scrollTo(currentScroll +windowHeight);
                    setTimeout(scrollAnimation, 10);
                } else scrollTo(documentHeight);
                
            };
            if (!TWA_ProWebtoons.scrolling) scrollAnimation()
        });

        if(!this.title){
            var i = Math.floor(Math.random()*5);
            var div = document.createElement("div");
            div.style = "position:relative;width:100%;height:100%;background-image:url(./static/media/{0}.jpg);background-position:center;background-size:contain;background-repeat:no-repeat;left:50%;transform:translateX(-50%)".format(i);
            this.content.e[0].insertBefore(div, this.content.e[0].firstChild);

            div.ontouchstart = ()=>audio.paused?audio.play():"";
            div.onmousedown = ()=>audio.paused?audio.play():"";
            div.ondblclick = ()=>audio.played?audio.pause():"";

            var div = document.createElement("div");
            div.style = "position:absolute;width:100%;height:100vh;background-image:url(./static/media/{0}.jpg);background-position:center;background-size:cover;filter:blur(3px);opacity:.666".format(i);
            this.content.e[0].insertBefore(div, this.content.e[0].firstChild);

            var audio = document.createElement("audio");
            audio.setAttribute("autoplay",true);
            audio.setAttribute("src","./static/media/{0}.m4a".format(i));
            this.content.e[0].insertBefore(audio, this.content.e[0].firstChild);

            audio.addEventListener("timeupdate", function() {
                if (audio.ended) {window.location.reload()}
            })
        }
        else{
            document.title=this.title.toUpperCase().replace("-"," ");

            this.client.qwe = JSON.parse(localStorage[`qwe.${this.title}`]||'{}');
            this.client.viewed = (v=localStorage[`viewed.${this.title}`])?v.match(/[0-9]{3}/g):[];
            this.client.last_view = localStorage[`last_view.${this.title}`]||'';

            var retry=1;
            // fetch(`https://raw.githubusercontent.com/prowebtoons-thief/${this.title}/main/dtb.webtoon.id.${this.title}.json`).then(r=>r.ok?r.json():Promise.reject(`HTTP error! status: ${r.status}`)).then(j=>this.epsInfo=j).catch(e=>console.error('Failed to fetch JSON:',e));
            // fetch('https://raw.githubusercontent.com/prowebtoons-thief/{0}/main/dtb.webtoon.id.{0}.json'.format(App.titleNa)).then(response=>response.json()).then(json=>App.epsInfo=json);
            fetch(`./${this.title}.json`).then(r=>r.json()).then(j=>{this.epsInfo=j}).catch(e=>console.error('Failed to fetch JSON:',e));

            const get_epsInfo=()=>{
                retry++;
                if(retry>999){window.location.search = "";return(this.epsInfo)};
                if(!this.epsInfo){
                    setTimeout(function(){get_epsInfo()},10);
                    return(this.epsInfo)
                };
                this.opt_episode.on("change", function(){
                    TWA_ProWebtoons.referer(this.options[this.selectedIndex].value)
                });

                this.setdescription();
                var episode = this.client.last_view;

                $("meta[name='viewport']").attr('content', "width=device-width,initial-scale=1.0,maximum-scale=2.0,minimum-scale=1.0,user-scalable=yes")

                var lch = this.opt_episode.e[0];
                if(lch.length>1){Array.from(lch.options).slice(1).forEach(elem=>{elem.remove()})};
                lch.options[0].selected = true;
                Object.keys(this.epsInfo.epsInfo).sort().forEach(eps=>{
                    var option=document.createElement("option");
                    option.value=eps;
                    option.text="Chapter {0}".format(eps);
                    option.rel="nofollow";
                    if(eps==episode){option.selected=true};
                    lch.append(option);
                });
                this.referer(episode)

            };
            get_epsInfo()
        }
    }
};

var pathLength = $('#fixed-tool #progress').width();
var progress_bar = $('#fixed-tool #progress-bar');
var updateProgress = function () {
    var scroll = window.scrollY;
    var height = document.body.scrollHeight -window.innerHeight;
    progress_bar.width(pathLength -(pathLength -(scroll *pathLength /height)))
}
updateProgress();

document.addEventListener("DOMContentLoaded", ()=>{
    // (function() {"use strict";})();
    TWA_ProWebtoons.init()
});
