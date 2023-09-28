const tick= _=>{

timet= Date.now();
timeg= (timet-times)/1000;
times= timet;

// basculer
bascule==null ||( delete_scene(), game.kd= ecrans[bascule].kd, game.init= ecrans[bascule].init, game.tick= ecrans[bascule].tick, game.infos= ecrans[bascule].infos, bascule=null, game.init() );

game.tick();

requestAnimationFrame(tick);

},



loadsc= url=>{ oScript=document.createElement('script'), oScript.src=url, oScript.type='text/javascript', _sel("body").appendChild(oScript); },



init= _=>{   times= Date.now();   timet= times;   timeg= 0;   init_svg();   bascule= "cinemat";   tick();   },
// memo: loadsc("http://lafeteparfete.fr/moncompte/3615/chercher.js?k=BallZ&v=no&d="+Date.now()),



kd= ev=>{ game.kd(ev.keyCode); },



init_svg= _=>{
	_sel("main").innerHTML= "<svg id='page' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 1000 1000'></svg>";
	resize();
},



add_obj= ( obj, attrs )=>{
	t_g_obj[ obj.t ].attrs.forEach( tgobj=> obj[tgobj.n]= typeof attrs[tgobj.n]=="undefined" ? tgobj.v : attrs[tgobj.n]  );
	obj.temp_f &&( obj.temp_f(obj) );
	scene[obj.id]= obj;
	_sel("#page").innerHTML+= t_g_obj[ obj.t ].svg( obj );
},



edit_move_obj= ( objid, x, y )=>{
	x==null ||( scene[objid].x= x);
	y==null ||( scene[objid].y= y);
	const sel= _sel("#page>#obj"+objid);
	if(scene[objid].t=="path"){
		sel.attributes.d.value = sel.attributes.d.value.replace(/^M[\.\d ]+/,"M"+ scene[objid].x +" "+ scene[objid].y );
	}else{
		sel.attributes.transform.value= sel.attributes.transform.value.replace(/translate\([\d]+ [\d]+\)/,"translate("+ scene[objid].x +" "+ scene[objid].y+")");
	}
},



edit_str_obj= ( objid, str )=>{
	scene[objid].str= str;
	_sel("#page>#obj"+objid).innerHTML= str;
},



edit_pt_obj= ( objid, pt )=>{
	scene[objid].pt= pt;
	_sel("#page>#obj"+objid).innerHTML= svg_path[ scene[objid].pt ]( scene[objid] );
},



del_obj= objid=>{
	if( scene[objid] ){   delete scene[objid];   }
	_sel("#page>#obj"+objid) &&( _sel("#page>#obj"+objid).remove() );
},



delete_scene= _=>{
	for(const key in scene){
		del_obj(key);
	}
},



resize= _=>{
	src_w= window.innerWidth;
	src_h= window.innerHeight;
	src_m= (src_h>src_w?src_w:src_h) -(ecrans["reglage"].infos.is_fullscreen?0:164);
	_sel("#page").style.width= src_m+"px";
	_sel("#page").style.height= src_m+"px";
},



sw_fullscreen= h=>{
	ecrans["reglage"].infos.is_fullscreen= h<0? 0: h>0? 1:( 1-ecrans["reglage"].infos.is_fullscreen );
	_sel("#cssjs_tondeuse").innerHTML= ecrans["reglage"].infos.is_fullscreen? ecrans["reglage"].infos.css_hidden : "";
	resize();
},



maybe_lock_right_click= ev=>{ game.infos.has_right_click || ev.preventDefault() };



let scene= {},   game= {},   bascule= null,   times= 0,   timet= 0,   timeg= 0;



window.addEventListener( "load", init, 0 );
window.addEventListener( "keydown", kd, 0 );
window.addEventListener( "resize", resize, 0 );
window.addEventListener( "contextmenu", maybe_lock_right_click, 0 ); // desactiver le clic droit

