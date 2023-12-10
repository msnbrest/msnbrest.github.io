const init= _=>{

	// init de base
	new_score(0);
	setTimeout("_sel('#temp_help').style.background='#ff04';",400);
	setTimeout("_sel('#temp_help').style.background='#fff0';",600);
	setTimeout("_sel('#temp_help').style.background='#ff04';",1400);
	setTimeout("_sel('#temp_help').style.background='#fff0';",1600);
	setTimeout("_sel('#temp_help').style.background='#ff04';",2400);
	setTimeout("_sel('#temp_help').style.background='#fff0';",2600);
	setTimeout("_sel('#temp_help').remove();",8500);

	// création tableau html
	(grid=>{

		if( !grid ){ return; }

		let out="";

		for( let i0= 0, lenn=me.len*me.len; i0<lenn; i0++ ){ out+= "<aside class='' data-tile='"+ (lenn-( ((i0/10)|0)+1 )*10+i0%10) +"'></aside>"; }

		grid.innerHTML= out;

	})( document.querySelector("#grid") );

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

	const obj= maybe_coll(dirx,diry);
	if( obj==null ){ return; }
	me.x= obj.x;
	me.y= obj.y;
	me.score< me.y-me.decal_y && new_score(me.y-me.decal_y);
	maybe_add_random_line(me.len+me.y-me.decal_y);
	redraw();
},



new_score= val=>{

	me.score= val;
	_sel("#score").innerHTML= "Score : "+ me.score;
},



maybe_coll= (dirx,diry)=>{

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
	// selon last line et ses positions possible, créer une nouvelle ligne fonctionelle


console.info("--Create--");
// poser x trou. (x étant un nombre totalement aléatoire)
	ajouter_des_trous(new_line_obj.public,[]);

console.info("--verif by private");
console.info(JSON.stringify(last_line.private));
// while pas some   private last_line curseur peut juste monter
	while( !last_line.private.some( (vv,kk)=> vv==1 && player_peut( new_line_obj.public, kk ) ) ){
// -> ajouter au moins x trou. (x étant le nombre random by case restant /2 +1)
console.info("+Retry");
	ajouter_des_trous(new_line_obj.public,new_line_obj.public.map( (vv,kk)=> vv==0?kk:-1 ).filter( vv=> vv>-1 ));
//alert("retry");
	}
console.info("--OK--");
// TODO lorsqu'on fera le private final, evidement que ce sera selon ligne precedente mais aussi selon les position validées de cette ligne alors on bougera le curseur pour tester depuis les pos de base :D, opti

console.info("--priv");
console.info(JSON.stringify(new_line_obj.private));
	last_line.private.forEach( (vv,kk)=>{
		// selon chaque possible de last_line, verif juste au dessus c'est possible.
		if( vv==1 && player_peut( new_line_obj.public, kk ) ){
			new_line_obj.private[kk]= 1;
		}
	});
console.info(JSON.stringify(new_line_obj.private));

	// selon possible de la nouvelle ligne, bouger un peu à gauche puis un peu à droite voir les autres possibles
	let priv_atester= new_line_obj.private.map( (vv,kk)=> vv==1?kk:-1 ).filter( vv=> vv>-1 );
	let priv_dejatestee= [];
console.info("XX oh putain XX");
	while( priv_atester.length>0 ){ // selon chaque possible
//alert("go un tour");
console.info("go un tour");
console.info(JSON.stringify(priv_atester));
console.info(JSON.stringify(priv_dejatestee));
console.info(JSON.stringify(new_line_obj.private));
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
console.info("fin");

	me.grille.push( new_line_obj );
	return;
},



ajouter_des_trous= (ptr_line_public,trous_deja)=>{

	// nombre de trous à faire, secu 1 + rand max ou rand "restant/2+1"
	const rand_1_9= 1+Math.random()*( trous_deja.length<1? me.len-1: ((me.len-trous_deja.length-1)/2) )|0;
console.info(rand_1_9);
console.info(JSON.stringify(ptr_line_public));
	let tab= [...Array(me.len)].map( (vv,kk)=> kk ).filter( vv=> !trous_deja.includes(vv) ); // liste dont les trous sont ignorés
	let out= 0; // liste de nouveaux trous
	while(out<rand_1_9){ out++; const ind= tab.splice( Math.random()*tab.length|0 ,1 )[0]; ptr_line_public[ind]= 0; } // ajouter les trous à la liste
console.info(JSON.stringify(ptr_line_public));
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



kk= event=>{

	if( event.keyCode==37 ){ maybe_move(-1, 0); } // gauche
	if( event.keyCode==38 ){ maybe_move( 0, 1); } // haut
	if( event.keyCode==39 ){ maybe_move( 1, 0); } // droite
	if( event.keyCode==40 ){ maybe_move( 0,-1); } // bas
};



// x=pos, y=pos, decal_y=offset start, len=largeur, pics=picots limitants (zero et...), score, grille=draw & technique
let me={ x:0, y:0, decal_y:3, len:10, pics:[0,3], score:0, grille:[] };



window.addEventListener("load",init,false);
window.addEventListener("keydown",kk,0);

