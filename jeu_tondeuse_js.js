const ptet_couper= _=>{   if( game.me_stock<game.me_space ){   game.terrain[game.me_pos]= 0;   game.me_stock++;   }   },



draw_tile= (num,is_ton,is_gas,is_com)=> "<div class='tile tile_back"+ num +"'>"+( is_gas?"<aside class='gas'></aside>":"" )+( is_com?"<aside class='compost'></aside>":"" )+( is_ton?"<aside class='ton'></aside><aside class='ton_gas'></aside>":"" )+"</div>",
// regle: toujours 'gas' en dernier



init= _=>{   help.start(null,false);   game.terrain= [...Array(game.size*game.size)].map( vv=> 1 );   fullscreen.resetsize( false );   ku({keyCode:39});   },



redraw_all= all=>{

	// todo: if need, ameliorer perf
	_sel("#cssjs_tondeuse").innerHTML= "aside.ton_gas{width:"+( game.me_gas<10?game.me_gas*game.sizew/7.5:((game.me_gas-game.sizew/10)*game.sizew/37.5) )+"px;height:4px;background:#"+( game.me_gas<game.size?"f20":"2b2" )+";}"+fullscreen.css;
	all &&( _sel("#plateau").innerHTML= game.terrain.map( (vv,kk)=> draw_tile( vv, kk==game.me_pos, kk==game.gas_pos, kk==game.compost_pos ) ).join("") );

},



loin_du_joueur= _=>{

	let choix= [];
	let mult= [-6,-5,-4,-3,3,4,5,6];
	let px= 0;
	let py= 0;
	for( let curxy=0, lig= mult.length, len=lig*lig; curxy<len; curxy++ ){
		px= mult[curxy%lig];
		py= mult[curxy/lig|0];
		if( game.me_pos+py*game.size>-1 && game.me_pos+py*game.size<game.size*game.size && game.me_pos%game.size+px>-1 && game.me_pos%game.size+px<game.size ){
			choix.push( game.me_pos+px+py*game.size );
		}
	}

	if( choix.length<1 ){
		return 0;
	}
	return choix[Math.random()*choix.length|0];

},



ku= event=>{

if( game.me_gas<1 ){ return; }

if( _moved(event) ){
	game.me_gas--;
	// detruire terrain ou conso exageree
	if( game.terrain[game.me_pos] == 1 ){   ptet_couper();   }else{   game.me_gas--;   }
	// recharger
	if( game.me_pos == game.gas_pos ){   game.gas_pos= loin_du_joueur();   game.me_gas= Math.min( game.me_max_gas, game.me_gas+20 );   }
	// vider stock
	if( game.me_pos == 0 ){ game.me_stock= 0; }
	redraw_all(true);
}

},



_moved= event=>{

	if( event.keyCode==38 && game.me_pos>game.size-1 ){ game.me_pos-= game.size; return true;; } // haut
	if( event.keyCode==40 && game.me_pos<game.size*(game.size-1) ){ game.me_pos+= game.size; return true;; } // bas
	if( event.keyCode==37 && game.me_pos%game.size>0 ){ game.me_pos-= 1; return true;; } // gauche
	if( event.keyCode==39 && game.me_pos%game.size<(game.size-1) ){ game.me_pos+= 1; return true;; } // droite
	return false;

},



fullscreen= {

is: 0,

css: "",
css_hidden: "header,footer{display:none;}body{margin:0;}main.my08.py20{padding:0;margin:0 auto;}",

resetsize: sw=>{

    sw &&( fullscreen.is= !fullscreen.is ); // switch is need
    const kdo= document.documentElement;
    let o_masta= kdo.clientHeight < kdo.clientWidth ? kdo.clientHeight: kdo.clientWidth;
    game.sizew= ((o_masta-(fullscreen.is?0:180))/game.size);
    
    fullscreen.css= "#plateau{width:"+ game.size*game.sizew +"px}.tile,aside{width:"
        + game.sizew +"px;height:"+ game.sizew +"px;}aside.ton_gas{top:"
        + game.sizew*0.95 +"px;}"
        + (fullscreen.is?fullscreen.css_hidden:"");
    redraw_all(false);

}

},



resize= osef=>{
    fullscreen.resetsize( false );
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
	{txt:"|",time:500},
	{txt:"Bienvenue !",time:1000},
	{txt:"|",time:500},
	{txt:"Pret à tondre ?",time:1500},
	{txt:"|",time:250},
	{txt:"Le but est de tondre entierement la pelouse.",time:2500},
	{txt:"|",time:250},
	{txt:"Déplacements avec les fleches directionelles",time:3000},
	{txt:"|",time:250},
	{txt:"Attention au niveau de carburant",time:2500},
	{txt:"|",time:250},
	{txt:"Les bidons remontent le niveau du réservoir.",time:3000},
	{txt:"|",time:250},
	{txt:"Le bac de ramassage est à vider dans le compost",time:3500},
	{txt:"[aide]",time:50},
]

};

// todo idee : decharger pelouse toutes les 8 cases sinon ça coupe l'herbe où on passe + ça recréé de l'herbe "ailleurs" déjà coupé + ça consomme 2x
// collecter plus de 20 bidons sans terminer l'herbe
// collecter 10 bidons apres avoir coupé l'herbe plateau vidé
// toucher les 4 coins de l'écran apres avoir coupé l'herbe



let game={   size: 10, terrain: [], me_gas: 8, me_max_gas: 50, me_stock: 0, me_space: 8, me_pos: 11, gas_pos: 28, compost_pos: 0,   sizew: 75,   };
// regle osef: pas de tile avec tondeuse et avec essence vu que essence disparait



window.addEventListener("load",init,false);
window.addEventListener("keyup",ku,false);
window.addEventListener("resize",resize,false);