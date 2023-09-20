const version= "0.230919-23",



init= _=>{

game= {
	system: {}, g_tile: {}, all: {
		sizeN: 10, tiles: [], sizew: 75,
		me_gas: 8, me_max_gas: 50, gas_bonus: 35, gas_pos: 28,
		me_stock: null, me_space: 8, me_pos: 11, me_over_dist: 0,
		composts: {
			pos: [null,null],
			stock: [0,12],
			space: 12,
		},
	},
	tiles_videy: null, eloigner: null, moved: null,
	compostTouch: null,
};

game.system.over= type=>{

	if( type==null ){   _sel(".over").style.display= "none";   return;   } // null==cacher
	if( type=="loose" ){
		game.all.me_gas= 8;
		game.all.gas_pos= 28;
	}else{
		game.all.me_gas= game.all.me_max_gas;
		game.eloigner();
	}
	_sel(".over").style.display= "block";
	_sel(".over").innerHTML= tab_html_over[ type ]();

};

game.system.retry= osef=>{

	game.all.me_pos= 11;
	game.all.me_stock= 0;
	game.all.gas_bonus= 35;
	game.all.composts.pos[0]= game.all.sizeN-1;
	game.all.composts.pos[1]= (game.all.sizeN-1)*game.all.sizeN;
	game.all.composts.stock[0]= 0;
	game.all.composts.stock[1]= 12;

	game.all.tiles= [...Array(game.all.sizeN*game.all.sizeN)].map( vv=> 1 );

	game.system.over(null);
	ku({keyCode:39});

};

game.g_tile.couper= _=>{

	// regle: peut dépasser de 1 mais faut pas rouler trop longtemps :p
	if( game.all.me_stock<=game.all.me_space ){
		game.all.me_over_dist= 0;
		game.all.tiles[game.all.me_pos]= 0;
		game.all.me_stock++;

		if( game.all.tiles.findIndex( vv=> vv==1 )<0 ){
			// mamie contente + agrandi terrain
			game.system.over("win");
			game.all.me_stock= null;
			game.tripledroite= 0;
		}

	}

};

game.g_tile.draw= (num,is_ton,is_gas,niv_com1)=> "<div class='tile tile_back"+ num +"'>"
+( is_gas?"<aside class='gas'>+ "+game.all.gas_bonus+"</aside>":"" )
+( niv_com1<1?"":"<aside class='compost_"+( niv_com1-1<game.all.composts.space?"min":"max" )+"'>"+(niv_com1-1)+"/"+game.all.composts.space+"</aside>" )
+( is_ton?"<aside class='ton'>"+(game.all.me_stock||0)+"/"+game.all.me_space+"</aside><aside class='ton_gas'></aside>":"" )
+"</div>";
// regle: toujours 'gas' en dernier
// scotch: niv_com1... (pas de -1 ou null, minimum est 0 donc niveau minimum "+1" ...)

game.eloigner= _=>{

	let choix= [];
	let mult= [-6,-5,-4,-3,3,4,5,6];
	let px= 0;
	let py= 0;
	for( let curxy=0, lig= mult.length, len=lig*lig; curxy<len; curxy++ ){
		px= mult[curxy%lig];
		py= mult[curxy/lig|0];
		if( game.all.me_pos+py*game.all.sizeN>-1 && game.all.me_pos+py*game.all.sizeN<game.all.sizeN*game.all.sizeN && game.all.me_pos%game.all.sizeN+px>-1 && game.all.me_pos%game.all.sizeN+px<game.all.sizeN ){
			choix.push( game.all.me_pos+px+py*game.all.sizeN );
		}
	}

	if( choix.length<1 ){ game.all.gas_pos= 0; eturn; }
	game.all.gas_pos= choix[Math.random()*choix.length|0];

};

game.compostTouch= num=>{

	// deplacer selon possible
	const transfert= Math.min( game.all.composts.space-game.all.composts.stock[num], game.all.me_stock );
	game.all.composts.stock[num]+= transfert;
	game.all.me_stock-= transfert;
	// vider l'autre si lui est remplis
	game.all.composts.stock[num]<game.all.composts.space ||( game.all.composts.stock[1-num]= 0 );

};

game.moved= event=>{

	if( event.keyCode==38 && game.all.me_pos>game.all.sizeN-1 ){ game.all.me_pos-= game.all.sizeN; return 1; } // haut
	if( event.keyCode==40 && game.all.me_pos<game.all.sizeN*(game.all.sizeN-1) ){ game.all.me_pos+= game.all.sizeN; return 1; } // bas
	if( event.keyCode==37 && game.all.me_pos%game.all.sizeN>0 ){ game.all.me_pos-= 1; return 1; } // gauche
	if( event.keyCode==39 && game.all.me_pos%game.all.sizeN<(game.all.sizeN-1) ){ game.all.me_pos+= 1; return 1; } // droite
	return 0;

};

fullscreen.resetSize( false );
help.start(null,false);
setTimeout( game.system.retry, 1500 );

},



tab_html_over= {

"win": _=> `<div class='tile4x4 grandma ma'><div class='grandmamess win'></div></div><span onclick="game.system.retry(null);" class='tag btn big jaune'>Rejouer</span><br><br><span class='c666'>Appuyez 3 fois sur droite pour rejouer</span>`,

"loose": _=> `<div class='tile4x4 grandma ma'><div class='grandmamess loose'></div></div><span onclick="game.system.retry(null);" class='tag btn big jaune'>Rejouer</span><br><br><span class='c666'>Appuyez 3 fois sur droite pour rejouer</span>`,

},



redraw= all=>{

	// todo: if need, ameliorer perf
	_sel("#cssjs_tondeuse").innerHTML= "aside.ton_gas{width:"+( game.all.me_gas<10?game.all.me_gas*game.all.sizew/7.5:((game.all.me_gas-game.all.sizew/10)*game.all.sizew/37.5) )+"px;height:4px;background:#"+( game.all.me_gas<game.all.sizeN?"f20":"2b2" )+";}"+fullscreen.css;

	_sel("#stats").innerHTML= "Essence: "+game.all.me_gas+"/"+game.all.me_max_gas+"<br>Stock: "+(game.all.me_stock||0)+"/"+game.all.me_space+"<br>Compost1: "+game.all.composts.stock[0]+"/"+game.all.composts.space+"<br>Compost2: "+game.all.composts.stock[1]+"/"+game.all.composts.space+"<br><span class='c666'>-v: "+version+"</span>";

	all &&( _sel(".ingame").innerHTML= game.all.tiles.map( (vv,kk)=> game.g_tile.draw( vv, kk==game.all.me_pos, kk==game.all.gas_pos, (kk==game.all.composts.pos[0]?game.all.composts.stock[0]+1:0)+(kk==game.all.composts.pos[1]?game.all.composts.stock[1]+1:0) ) ).join("") );

},



ku= event=>{

if( game.all.me_stock == null ){
	// trois fois droite puis ptet retry
	event.keyCode==39 ?( game.tripledroite++, game.tripledroite>2 &&( game.system.retry(null) ) ):( game.tripledroite= 0 );
	return false;
}

if( game.moved(event) ){
	game.all.me_gas--;
	// detruire terrain ou conso exageree
	if( game.all.tiles[game.all.me_pos] == 1 ){
		game.g_tile.couper();
	}else{
		game.all.me_gas--;
		if(game.all.me_gas<0){ game.all.me_gas=0; }
		game.all.me_over_dist++;
		if( game.all.me_over_dist>3 && game.all.tiles[game.all.me_pos]==0 && game.all.me_stock>game.all.me_space ){
			game.all.me_stock--;
			game.all.tiles[game.all.me_pos]= 1;
		}
	}

	// recharger
	if( game.all.me_pos == game.all.gas_pos ){   game.eloigner();   game.all.me_gas= Math.min( game.all.me_max_gas, game.all.me_gas+game.all.gas_bonus );   game.all.gas_bonus>20 &&( game.all.gas_bonus-=5 );   }

	// ptet perdu
	if( game.all.me_gas<1 ){
		game.all.me_stock= null;
		game.tripledroite= 0;
		redraw(1);
		setTimeout( "game.system.over('loose');", 750 );
		return false;
	}

	// vider stock
	if( game.all.me_pos == game.all.composts.pos[0] ){ game.compostTouch(0); }
	if( game.all.me_pos == game.all.composts.pos[1] ){ game.compostTouch(1); }

	redraw(1);
}

},



fullscreen= {

is: 0,

css: "",

css_hidden: "header,footer{display:none;}body{margin:0;}main.my08.py20{padding:0;margin:0 auto;}main.mxw1200px{max-width:100%;width:100%;}",

resetSize: sw=>{

    sw &&( fullscreen.is= !fullscreen.is ); // switch is need
    const kdo= document.documentElement;
    let o_masta= kdo.clientHeight < kdo.clientWidth ? kdo.clientHeight: kdo.clientWidth;
    game.all.sizew= (o_masta-(fullscreen.is?0:180))/game.all.sizeN;

    fullscreen.css= ".plateau_w{width:"+ game.all.sizeN*game.all.sizew +"px}.tile,aside{width:"
        + game.all.sizew +"px;height:"+ game.all.sizew +"px;}.tile4x4{width:"
        + (game.all.sizew*4) +"px;height:"+ (game.all.sizew*4) +"px;}aside.ton_gas{top:"
        + game.all.sizew*0.95 +"px;}aside.compost_min,aside.compost_max,aside.gas,aside.ton{padding-top:"+game.all.sizew*.4+"px;text-align:center;text-shadow:1px 1px 2px #000,0 0 3px #000;font-size:1.1em;}aside.ton{padding-top:"+game.all.sizew*.5+"px;}aside.compost_min{padding-left:"+game.all.sizew*.02+"rem;padding-top:"+game.all.sizew*.2+"px;}aside.compost_max{padding-left:"+game.all.sizew*.01+"rem;padding-top:"+game.all.sizew*.6+"px;}"
        + (fullscreen.is?fullscreen.css_hidden:"");

    redraw(0);

},

},



help= {

cur: -1,

is_on: 0,

start: (osef,human)=>{   help.cur= human? 1: -1;   help.is_on ||( help.tick(null) );   },

tick: osef=>{

	if( help.cur<help.txts.length-1 ){
		help.is_on= 1;
		help.cur++;
		_sel("#help").innerHTML= help.txts[help.cur].txt;
		setTimeout( help.tick, help.txts[help.cur].time );
	}else{
		help.is_on= 0;
	}

},

txts:[
	{txt:"Bienvenue !",time:1000},
	{txt:"|",time:200},
	{txt:"Pret à tondre ?",time:1500},
	{txt:"|",time:200},
	{txt:"Le but est de tondre entierement la pelouse.",time:2500},
	{txt:"|",time:200},
	{txt:"Déplacements avec les fleches directionelles",time:3000},
	{txt:"|",time:200},
	{txt:"Attention au niveau de carburant",time:2500},
	{txt:"|",time:200},
	{txt:"Les bidons remontent le niveau du réservoir.",time:3000},
	{txt:"|",time:200},
	{txt:"Rouler sur l'herbe coupée génère un Malus.",time:3000},
	{txt:"|",time:200},
	{txt:"Le bac de ramassage est à vider dans le compost,",time:3500},
	{txt:"|",time:200},
	{txt:"S'il déborde longtemps alors de l'herbe se replantera,",time:4000},
	{txt:"|",time:200},
	{txt:"il faut remplir un compost pour débloquer l'autre.",time:3500},
	{txt:"|",time:200},
	{txt:"Faites attention, mamie veille au grain.",time:3000},
	{txt:"[aide]",time:50},
]

};



// todo idee :
// Trophee, collecter 25+ bidons sans terminer l'herbe
// Trophee, collecter 50 bidons apres avoir coupé l'herbe plateau vidé
// Trophee, toucher les 4 coins de l'écran apres avoir coupé l'herbe
// Trophee, chopper essence sur la case compost + non tondue xD

// trois coeurs.   dechets, panne = -1, attente x temps = recup +1, pierre = -3, fleur = -1.
// Augmenter taille lorsque gagné, donc + bidons mais memes compost
// Power up : prout qui propulse de 3 cases, conso essence ( à sec ? marche quand meme )
// perdu = mini jeu pour la réparer soit même (selon essence ou lame hs)

let game= {};
// regle osef: pas de tile avec tondeuse et avec essence vu que essence disparait



window.addEventListener("load", init, false);
window.addEventListener("keyup", ku, false);
window.addEventListener("resize", osef=>{ fullscreen.resetSize( false ); }, false);
