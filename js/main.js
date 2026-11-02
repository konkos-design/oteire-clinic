(function(){
  var root=document.documentElement;
  var unhide=function(){root.classList.remove('js-anim')};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}

  /* header */
  var hdr=document.querySelector('.hdr'),lastY=0;
  function onScroll(){var y=window.scrollY;hdr.classList.toggle('is-solid',y>20);
    if(!document.body.classList.contains('menu-open')){if(y>600&&y>lastY+3)hdr.classList.add('is-hidden');else if(y<lastY-3)hdr.classList.remove('is-hidden')}
    lastY=y}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* mobile menu */
  var burger=document.querySelector('.burger');
  if(burger){burger.addEventListener('click',function(){var o=document.body.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
    $$('.mmenu a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('menu-open');document.body.style.overflow='';burger.setAttribute('aria-expanded','false')})})}

  /* reveal */
  var rv=$$('.rv');
  if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});rv.forEach(function(el){io.observe(el)})}
  else rv.forEach(function(el){el.classList.add('in')});

  /* services explorer */
  var sw=document.querySelector('.switch');
  if(sw){
    var pill=sw.querySelector('.switch__pill'),btns=$$('button',sw),frame=document.querySelector('.ex__frame'),cap=document.querySelector('[data-cap]'),cnt=document.querySelector('[data-count]');
    function movePill(b){pill.style.width=b.offsetWidth+'px';pill.style.transform='translateX('+(b.offsetLeft-6)+'px)'}
    function show(key,name,idx,total){if(!frame)return;$$('img',frame).forEach(function(i){i.classList.toggle('on',i.getAttribute('data-v')===key)});if(cap)cap.textContent=name;if(cnt)cnt.textContent='0'+(idx+1)+' / 0'+total}
    function activate(item){var list=item.parentNode,items=$$('.ex__item',list);items.forEach(function(x){var on=x===item;x.classList.toggle('on',on);x.querySelector('.ex__btn').setAttribute('aria-expanded',on)});
      show(item.getAttribute('data-img'),item.querySelector('.ex__name').textContent,items.indexOf(item),items.length)}
    btns.forEach(function(b){b.addEventListener('click',function(){btns.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});movePill(b);
      var cat=b.getAttribute('data-cat');$$('.ex__list').forEach(function(l){l.classList.toggle('on',l.getAttribute('data-cat')===cat)});
      var first=document.querySelector('.ex__list[data-cat="'+cat+'"] .ex__item');activate(first)})});
    $$('.ex__item').forEach(function(it){var b=it.querySelector('.ex__btn');b.addEventListener('click',function(){activate(it)});if(fine)b.addEventListener('mouseenter',function(){activate(it)})});
    requestAnimationFrame(function(){movePill(sw.querySelector('button.on'))});window.addEventListener('resize',function(){movePill(sw.querySelector('button.on'))});
  }

  /* braces selector */
  var stage=document.querySelector('.br__stage');
  if(stage){var bt=$$(".br__tabs button"),btx=$$(".br__t"),idx=0,timer;
    function setK(k){stage.setAttribute('data-k',k);var lb=stage.querySelector('[data-brl]'),ph=stage.querySelectorAll('.br__ph');for(var q=0;q<ph.length;q++)ph[q].classList.toggle('on',ph[q].getAttribute('data-k')===k);var cb=document.querySelector('.br__tabs button[data-k="'+k+'"]');if(lb&&cb)lb.textContent=cb.textContent;bt.forEach(function(b){b.classList.toggle('on',b.getAttribute('data-k')===k)});btx.forEach(function(t){t.hidden=t.getAttribute("data-k")!==k})}
    bt.forEach(function(b,i){b.addEventListener('click',function(){clearInterval(timer);idx=i;setK(b.getAttribute('data-k'))})});
    if(!reduce&&'IntersectionObserver' in window){var io3=new IntersectionObserver(function(es){es.forEach(function(e){clearInterval(timer);if(e.isIntersecting)timer=setInterval(function(){idx=(idx+1)%bt.length;setK(bt[idx].getAttribute('data-k'))},3800)})},{threshold:.4});io3.observe(stage)}
  }

  /* draggable galleries */
  $$('[data-drag]').forEach(function(s){
    var sec=s.closest('section'),bar=sec.querySelector('.prog i'),cur=sec.querySelector('[data-tcur]'),cards=$$('.tcard',s);
    var down=false,sx=0,sl=0,moved=false,vel=0,lx=0,raf;
    function upd(){var max=s.scrollWidth-s.clientWidth,w=Math.max(.12,s.clientWidth/s.scrollWidth);if(bar){bar.style.width=(w*100)+'%';bar.style.transform='translateX('+(max>0?s.scrollLeft/max*(1/w-1)*100:0)+'%)'}
      if(cur){var best=0,bd=1e9;cards.forEach(function(c,i){var d=Math.abs(c.offsetLeft-s.scrollLeft-parseFloat(getComputedStyle(s.firstElementChild).paddingLeft));if(d<bd){bd=d;best=i}});cur.textContent=(best<9?'0':'')+(best+1)}}
    s.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
    s.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=lx=e.clientX;sl=s.scrollLeft;vel=0;cancelAnimationFrame(raf);s.classList.add('grab')});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>3)moved=true;vel=e.clientX-lx;lx=e.clientX;s.scrollLeft=sl-dx});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;s.classList.remove('grab');(function glide(){vel*=.94;s.scrollLeft-=vel;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide)})()});
    s.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation()}},true);
    var step=function(d){var c=cards[0];var w=c?c.offsetWidth+20:400;s.scrollBy({left:d*w,behavior:'smooth'})};
    var p=sec.querySelector('[data-tprev]'),n=sec.querySelector('[data-tnext]');if(p)p.addEventListener('click',function(){step(-1)});if(n)n.addEventListener('click',function(){step(1)});
  });

  /* reviews slider */
  $$('[data-slider]').forEach(function(sl){var sl_=$$('.slide',sl),pips=$$('.pips button',sl),i=0,t;
    function go(n){i=(n+sl_.length)%sl_.length;sl_.forEach(function(s,k){s.classList.toggle('on',k===i);s.setAttribute('aria-hidden',k!==i)});pips.forEach(function(p,k){p.classList.toggle('on',k===i)})}
    function auto(){clearInterval(t);if(!reduce)t=setInterval(function(){go(i+1)},7000)}
    sl.querySelector('[data-prev]').addEventListener('click',function(){go(i-1);auto()});sl.querySelector('[data-next]').addEventListener('click',function(){go(i+1);auto()});
    pips.forEach(function(p,k){p.addEventListener('click',function(){go(k);auto()})});
    var x0=null;sl.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});sl.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));auto()}x0=null});
    auto()});

  /* faq */
  $$('.qa__i').forEach(function(it){it.querySelector('.qa__q').addEventListener('click',function(){var on=!it.classList.contains('on');$$('.qa__i',it.parentNode).forEach(function(x){x.classList.remove('on');x.querySelector('.qa__q').setAttribute('aria-expanded','false')});if(on){it.classList.add('on');it.querySelector('.qa__q').setAttribute('aria-expanded','true')}})});

  /* services page nav highlight */
  var navLinks=$$('.svc-nav a');
  if(navLinks.length&&'IntersectionObserver' in window){var map={};navLinks.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){navLinks.forEach(function(a){a.classList.remove('on')});var a=map[e.target.id];if(a)a.classList.add('on')}})},{rootMargin:'-45% 0px -50% 0px'});
    $$('.svc[id]').forEach(function(s){io2.observe(s)})}

  /* hero mouse depth */
  var art=document.querySelector('[data-tilt]');
  if(art&&fine&&!reduce){var els=$$('[data-depth]',art),tx=0,ty=0,cx=0,cy=0;
    window.addEventListener('mousemove',function(e){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)});
    (function loop(){cx+=(tx-cx)*.06;cy+=(ty-cy)*.06;els.forEach(function(el){var d=+el.getAttribute('data-depth');el.style.translate=(cx*d)+'px '+(cy*d)+'px'});requestAnimationFrame(loop)})()}

  /* magnetic buttons */
  if(fine&&!reduce)$$('.btn').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.12)+'px '+((e.clientY-r.top-r.height/2)*.2)+'px'});b.addEventListener('mouseleave',function(){b.style.translate=''})});

  $$('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});

  if(!window.gsap||!window.ScrollTrigger){unhide();return}
  gsap.registerPlugin(ScrollTrigger);if(window.SplitText)gsap.registerPlugin(SplitText);
  var mm=gsap.matchMedia();
  mm.add({all:'all',wide:'(min-width: 900px)',reduce:'(prefers-reduced-motion: reduce)'},function(ctx){
    var c=ctx.conditions;
    if(c.reduce){unhide();return}
    if(document.querySelector('.hero')){
      gsap.set('.hero h1 .ln > span',{y:0,yPercent:130});
      gsap.set('.hero .tag,.hero__lead,.hero__cta,.hero__team',{opacity:0,y:22});
      gsap.set('.hero__photo',{clipPath:'inset(100% 0% 0% 0% round 220px 220px 26px 26px)'});
      gsap.set('.hero .float,.hero .badge',{opacity:0,scale:.85,y:20});
      gsap.set('.hero__ring',{opacity:0,scale:.85});
      gsap.set('.hero__photo img',{scale:1.25});
      unhide();
      gsap.timeline({defaults:{ease:'power3.out'}})
        .to('.hero__photo',{clipPath:'inset(0% 0% 0% 0% round 220px 220px 26px 26px)',duration:1.4,ease:'power4.inOut'},0)
        .to('.hero__photo img',{scale:1,duration:2,ease:'power3.out'},.1)
        .to('.hero__ring',{opacity:1,scale:1,duration:1.6},.3)
        .to('.hero .tag',{opacity:1,y:0,duration:.8},.15)
        .to('.hero h1 .ln > span',{yPercent:0,duration:1.15,stagger:.1},.2)
        .to('.hero__lead,.hero__cta,.hero__team',{opacity:1,y:0,duration:.9,stagger:.08},.7)
        .to('.hero .float,.hero .badge',{opacity:1,scale:1,y:0,duration:1,stagger:.1,ease:'back.out(1.5)'},1);
      gsap.to('.hero__photo img',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
      gsap.to('.hero__ring',{rotate:40,scale:1.08,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    }
    if(document.querySelector('.page-hero')){
      gsap.set('.page-hero h1 .ln > span',{y:0,yPercent:130});gsap.set('.page-hero .rv0',{opacity:0,y:20});unhide();
      gsap.timeline({defaults:{ease:'power3.out'}}).to('.page-hero h1 .ln > span',{yPercent:0,duration:1.1,stagger:.1},.1).to('.page-hero .rv0',{opacity:1,y:0,duration:.9,stagger:.08},.4);
    }
    unhide();

    /* split headings */
    if(window.SplitText){$$('.split').forEach(function(h){var st=new SplitText(h,{type:'words',wordsClass:'w'});
      var inner=st.words.map(function(w){var s=document.createElement('span');s.style.display='inline-block';while(w.firstChild)s.appendChild(w.firstChild);w.appendChild(s);return s});
      gsap.from(inner,{yPercent:115,duration:1,ease:'power3.out',stagger:.05,scrollTrigger:{trigger:h,start:'top 88%',once:true}});h.classList.add('in')})}

    gsap.utils.toArray('[data-par]').forEach(function(img){var a=parseFloat(img.getAttribute('data-par'))||10;
      gsap.fromTo(img,{yPercent:-a},{yPercent:0,ease:'none',scrollTrigger:{trigger:img.parentNode,start:'top bottom',end:'bottom top',scrub:true}})});

    var ap=document.querySelector('.aperture__stage');
    if(ap){gsap.timeline({scrollTrigger:{trigger:ap,start:'top 85%',end:'center 45%',scrub:.6}})
      .fromTo('.aperture__win',{clipPath:'circle(20% at 50% 50%)'},{clipPath:'circle(75% at 50% 50%)',ease:'none'},0)
      .fromTo('.aperture__win img',{scale:1.25},{scale:1,ease:'none'},0)
      .fromTo('.aperture__ring',{scale:1,opacity:1},{scale:2.4,opacity:0,ease:'none'},0)}

    var line=document.querySelector('.path .line path');
    if(line){gsap.fromTo('.path .line',{scaleY:0,transformOrigin:'top'},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.path',start:'top 75%',end:'bottom 60%',scrub:true}})}

    if(c.wide){
      gsap.utils.toArray('.intro__small,.kids__note').forEach(function(el){gsap.fromTo(el,{y:60},{y:-30,ease:'none',scrollTrigger:{trigger:el.parentNode,start:'top bottom',end:'bottom top',scrub:true}})});
    }
  });
  setTimeout(unhide,3000);
  window.addEventListener('load',function(){ScrollTrigger.refresh()});
})();
