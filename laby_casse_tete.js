// idée le 2 décembre 2023, début codage le 8déc, version alpha le 10dec, version beta avec timing,resize,tactil le 11dec
const f_back= id=> `background:#${list_icones[id].back} url(\'data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'><g fill=\\'%23ddd\\'><path d=\\'M${list_icones[id].path}z\\'/></g></svg>\') no-repeat center center/contain;`,

init= _=>{

	me= {};
	// -- config --
	me.len= 10;
	me.is_fullscreen= false;

	// -- création tableau html --
	(grid=>{

		if( !grid ){ return; }

		let out="";

		for( let i0= 0, lenn=me.len*me.len; i0<lenn; i0++ ){ out+= "<aside data-tile='"+ (lenn-( ((i0/10)|0)+1 )*10+i0%10) +"'></aside>"; }

		grid.innerHTML= out;

	})( _sel("#grid") );

	// -- création tableau touches --
	(grid=>{

		if( !grid ){ return; }

		grid.innerHTML= list_touches.map( obj=> `<aside style="${f_back(obj.icon)}" onmousedown="list_touches[${obj.id}].act()"></aside>` ).join("");

	})( _sel("#touches") );

	// -- init de base --

	menu_game(0);
	setTimeout("_sel('#menu_game').style.background='#ff04';",200);
	setTimeout("_sel('#menu_game').style.background='#fff0';",300);
	setTimeout("_sel('#menu_game').style.background='#ff04';",700);
	setTimeout("_sel('#menu_game').style.background='#fff0';",800);
	setTimeout("_sel('#menu_game').style.background='#ff04';",1200);
	setTimeout("_sel('#menu_game').style.background='#fff0';",1300);
	setInterval(loop,1000);
	resize();
	if( /webkit.*mobile/i.test(navigator.userAgent) ){ // is_mobile
		_sel("main").classList.remove("w90p");
		_sel("main").classList.remove("px20");
	}

},



list_touches= [

	{ id:0, icon:"fleche gps haut", act:_=>{ kk({keyCode:38,fake:1}); } },
	{ id:1, icon:"fleche gps gauche", act:_=>{ kk({keyCode:37,fake:1}); } },
	{ id:2, icon:"fleche gps droite", act:_=>{ kk({keyCode:39,fake:1}); } },
	{ id:3, icon:"fleche gps bas", act:_=>{ kk({keyCode:40,fake:1}); } }
],



list_icones= {

	"fleche gps haut":{ "path":"50,10l40,80l-40-20l-40,20", "creator":"rand+msnbrest", "back":"8408" },
	"fleche gps gauche":{ "path":"10,50l80-40l-20,40l20,40", "creator":"rand+msnbrest", "back":"8408" },
	"fleche gps droite":{ "path":"90,50l-80,40l20-40l-20-40", "creator":"rand+msnbrest", "back":"8408" },
	"fleche gps bas":{ "path":"50,90l-40-80l40,20l40-20", "creator":"rand+msnbrest", "back":"8408" },
},



menu_game_phrases= [

`But : monter &nbsp; | &nbsp; Touches : haut, bas, gauche, droite. <button onclick='menu_game(1)'>Jouer</button>`,
`<button onclick='menu_game(0)'>Astuces</button> Mode de jeu : <button onclick='reset_game()'>Libre</button> | <button onclick='reset_game( 120, 100 )'>Limité</button> | <button onclick='reset_game( 120, 250 )'>Hard</button>`,
],



menu_game= val=>{

	menu_game_phrases[val] &&( _sel("#menu_game").innerHTML= menu_game_phrases[val] );
},



reset_game= ( _maxduration=null, _maxheight=null, )=>{

	// Info: x=pos, y=pos, decal_y=offset start, len=largeur, pics=picots limitants (zero et...), score, grille=draw & technique
	me.x= 0;
	me.y= 0;
	me.decal_y= 3;
	me.pics= [0,3];
	me.grille= [];
	me.maxduration= _maxduration;
	me.duration= 0;
	me.maxheight= _maxheight;
	
	new_now_score(0);
	new_best_score(0);
	new_last_score(0);
	new_oups(0);
	show_duration();

	// init grille
	add_line(1); // regle : toujours au moins une ligne pleine en bas, pour éviter soucis out of bound, negative index array et generation need last line
	add_line(1);
	add_line(1);

	add_line(0);

	while( me.grille.length<10 ){ add_line(null); } // gene suite grille

	// finalisation
	me.y= me.decal_y; // prepa me
	maybe_move(0,0); // redraw
},



maybe_move= (dirx,diry)=>{

	if( !me.grille ){
		return;
	}
	const obj= test_move(dirx,diry);
	if( obj==null ){
		new_oups( me.oups+1 );
		return;
	}
	me.x= obj.x;
	me.y= obj.y;
	me.now_score< me.y-me.decal_y && new_now_score(me.y-me.decal_y);
	maybe_add_random_line(me.len+me.y-me.decal_y);
	redraw();
	me.maxheight==null ||( me.y-me.decal_y>=me.maxheight &&( game_win() ) );
},



new_now_score= val=>{

	me.now_score= val;
	if( me.best_score<me.now_score ){
		new_best_score(me.now_score);
	}
	_sel("#now_score").innerHTML= `Score : ${me.now_score}` + (me.maxheight==null? "": ` / ${me.maxheight}`);
},



new_best_score= val=>{

	me.best_score= val;
	_sel("#best_score").innerHTML= "Best : "+ me.best_score;
},



new_last_score= val=>{

	me.last_score= val;
	_sel("#last_score").innerHTML= "Last : "+ me.last_score;
},



new_oups= val=>{

	me.oups= val;
	_sel("#oups").innerHTML= "Oups : "+ me.oups;
},



show_duration= _=>{

	_sel("#duration").innerHTML= me.maxduration? `Time: ${me.duration} / ${me.maxduration}`: "";
},



test_move= (dirx,diry)=>{

	let out={x:null,y:null};
	// new pos
	out.x= ( me.x+ ( dirx>0? 1: dirx<0? me.len-1: 0 ) )%me.len;
	out.y= me.y+ ( diry>0? 1: diry<0? (me.y<=me.decal_y?0:-1): 0 );
	// test coll
	if( !player_peut( me.grille[out.y].public, out.x ) ){
		return null;
	}
	// -- ok on peut bouger --
	return out;
},



maybe_add_random_line= line=>{

	while( me.grille.length<=line ){
		add_line(null);
	}
},



add_line= force=>{

	// private (bot) :   0 => impossible d'être dans cette position   1 => ici possible
	// public (draw) :   1 => y'a un bloc   0 => y'a un passage
	let new_line_obj= {
		private: [...Array(10)].map( vv=> force==null?0:(1-force) ),
		public: [...Array(10)].map( vv=> force==null?1:force ),
	}; // remplir une ligne d'un coup

	if( force!=null ){
		me.grille.push( new_line_obj );
		return;
	}

	// -- faire de la place intelligement, sur une ligne de jeu aléatoire --
	const last_line= me.grille.slice(-1)[0];
	// -- selon last line et ses positions possible, créer une nouvelle ligne fonctionelle --

	//! poser x trou. (x étant un nombre totalement aléatoire)
	ajouter_des_trous(new_line_obj.public,[]);

	//! while pas some   private last_line curseur peut juste monter
	while( !last_line.private.some( (vv,kk)=> vv==1 && player_peut( new_line_obj.public, kk ) ) ){
		//! -> ajouter au moins x trou. (x étant le nombre random by case restant /2 +1)
		ajouter_des_trous(new_line_obj.public,new_line_obj.public.map( (vv,kk)=> vv==0?kk:-1 ).filter( vv=> vv>-1 ));
	}

	last_line.private.forEach( (vv,kk)=>{
		// selon chaque possible de last_line, verif juste au dessus c'est possible.
		if( vv==1 && player_peut( new_line_obj.public, kk ) ){
			new_line_obj.private[kk]= 1;
		}
	});

	// selon possible de la nouvelle ligne, bouger un peu à gauche puis un peu à droite voir les autres possibles
	let priv_atester= new_line_obj.private.map( (vv,kk)=> vv==1?kk:-1 ).filter( vv=> vv>-1 );
	let priv_dejatestee= [];
	while( priv_atester.length>0 ){ // selon chaque possible
		if( priv_dejatestee.includes( priv_atester[0] ) ){ // deja testee
			priv_atester.splice(0,1);
			continue;
		}
		if( player_peut( new_line_obj.public, priv_atester[0] ) ){
			new_line_obj.private[ priv_atester[0] ]= 1;
			const go_droite= (priv_atester[0]+me.len-1)%me.len;
			if( !priv_atester.includes( go_droite ) ){
				priv_atester.includes( go_droite ) || priv_dejatestee.includes( go_droite ) ||( priv_atester.push(go_droite) );
			}
			const go_gauche= (priv_atester[0]+1)%me.len;
			if( !priv_atester.includes( go_gauche ) ){
				priv_atester.includes( go_gauche ) || priv_dejatestee.includes( go_gauche ) ||( priv_atester.push(go_gauche) );
			}
		}
		priv_dejatestee.push(priv_atester[0]);
		priv_atester.splice(0,1);
	}

	me.grille.push( new_line_obj );
	return;
},



ajouter_des_trous= (ptr_line_public,trous_deja)=>{

	// nombre de trous à faire, secu 1 + rand max ou rand "restant/2+1"
	const rand_1_9= 1+Math.random()*( trous_deja.length<1? me.len-1: ((me.len-trous_deja.length-1)/2) )|0;

	let tab= [...Array(me.len)].map( (vv,kk)=> kk ).filter( vv=> !trous_deja.includes(vv) ); // liste dont les trous sont ignorés
	let out= 0; // liste de nouveaux trous

	while(out<rand_1_9){ out++; const ind= tab.splice( Math.random()*tab.length|0 ,1 )[0]; ptr_line_public[ind]= 0; } // ajouter les trous à la liste
},



player_peut= (line,pos)=> me.pics.every( vv=> line[(pos+vv)%me.len] == 0 ),



redraw= _=>{

	for( let i0= 0, lenn=me.len*me.len; i0<lenn; i0++ ){
		const n_line= (i0/10|0)+me.y-me.decal_y;
		maybe_add_random_line( n_line );
		_sel("[data-tile='"+ i0 +"']").className= me.pics.some( vv=> (me.x+vv)%me.len+me.decal_y*10 ==i0 ) ? "case_blue" : (me.grille[n_line].public[i0%10]?"case_dark":"");
	}
	// TODO apres, optimiser redraw
},



sw_h= html_elem=>{

	html_elem.style.height=="22px"? (html_elem.style.height="auto"): (html_elem.style.height="22px");
},



game_loose= _=>{

	alert("Perdu, appuyez sur OK pour rejouer");
	new_last_score( me.now_score );
	reset_game( me.maxduration, me.maxheight );
},



game_win= _=>{

	alert("Gagné, appuyez sur OK pour rejouer");
	new_last_score( me.now_score );
	reset_game( me.maxduration, me.maxheight );
},



loop= osef=>{

	me.maxduration==null ||( me.duration++, show_duration(), me.duration>me.maxduration&&( game_loose() ) );
},



resize= _=>{

	src_w= window.innerWidth;
	src_h= window.innerHeight -(me.is_fullscreen?0:220);
	src_m= (src_h>src_w?src_w:src_h);
	_sel("#style1").innerHTML= `
	.grid{ width:${src_m}px; }
	aside{
		width:${src_m/me.len}px;
		height:${src_m/me.len}px;
	}
	#touches>aside{
		width:${src_m/list_touches.length}px;
		height:${src_m/list_touches.length}px;
		border-radius:1em;
	}
	#touches>aside:active{
		box-shadow:0 0 0 1em #000 inset;
	}`;
},



kk= event=>{

	if( event.keyCode==37 ){ maybe_move(-1, 0); event.fake||(event.preventDefault()); } // gauche
	if( event.keyCode==38 ){ maybe_move( 0, 1); event.fake||(event.preventDefault()); } // haut
	if( event.keyCode==39 ){ maybe_move( 1, 0); event.fake||(event.preventDefault()); } // droite
	if( event.keyCode==40 ){ maybe_move( 0,-1); event.fake||(event.preventDefault()); } // bas
};



let me= null;

// TODO apres, faire "defiler" les cases, car là c'est un peu trop brut

/*
ajouter radio


<button onclick="main.pley(this);">play</button>

<audio src=""></audio>



pley: thiss=>{
	_sel("audio").src="http://ice3.securenetsystems.net/BILTMORE";
	//_sel("audio").volume= 0.2;
	_sel("audio").play();
	thiss.remove();
},

*/

window.addEventListener("load",init,false);
window.addEventListener("keydown",kk,0);
window.addEventListener( "resize", resize, 0 );
