let ecrans= {

	"reglage":{ kd: kc=>{

		switch(kc){
		case 38://haut
			game.infos.cury= (game.infos.cury+game.infos.menus.length-1)%game.infos.menus.length;
			edit_move_obj( "cur", null, game.infos.menus[game.infos.cury].y );
		break;
		case 40://bas
			game.infos.cury= (game.infos.cury+1)%game.infos.menus.length;
			edit_move_obj( "cur", null, game.infos.menus[game.infos.cury].y );
		break;
		case 37://gauche
			game.infos.menus[game.infos.cury].k37 &&( game.infos.menus[game.infos.cury].k37() );
		break;
		case 39://droite
			game.infos.menus[game.infos.cury].k39 &&( game.infos.menus[game.infos.cury].k39() );
		break;
		case 13://enter
			game.infos.menus[game.infos.cury].k13 &&( game.infos.menus[game.infos.cury].k13() );
		break;
		default:
		break;
		}

	}, init: _=>{

		add_obj( {id:"cur",t:"path",x:50,y:98}, {fill:"#031",rd:"h900v76h-900"} );
		add_obj( {id:"txt_minituto",t:"text",x:346,y:108}, {str:"Mini Tuto >",color:"#369",fs:64} );
		add_obj( {id:"txt_jouer",t:"text",x:398,y:208}, {str:"Jouer >",color:"#494",fs:64} );
		add_obj( {id:"txt_reglages",t:"text",x:120,y:358}, {str:"Reglages :",color:"#666",fs:60} );
		add_obj( {id:"bt_see_pointer",t:"text",x:120,y:458}, {str:game.infos.str_bt_see_pointer(),color:"#999",fs:50} );
		add_obj( {id:"bt_right_clic",t:"text",x:120,y:558}, {str:game.infos.str_bt_right_clic(),color:"#999",fs:50} );
		add_obj( {id:"bt_fullscreen",t:"text",x:120,y:658}, {str:game.infos.str_bt_fullscreen(),color:"#999",fs:50} );
		add_obj( {id:"txt_version",t:"text",x:670,y:950}, {str:"Version: "+version,color:"#222",fs:32} );
		edit_move_obj( "cur", null, game.infos.menus[game.infos.cury].y );

	}, tick: _=>{}, infos: {

		has_see_pointer: 0,
		has_right_click: 0,
		is_fullscreen: 0,
		css_hidden: "header,footer{display:none;}body{margin:0;height:100vh;}main.my08.py20{padding:0;margin:0 auto;}main.mxw1200px{max-width:100%;width:100%;}svg{height:auto;}",

		str_bt_see_pointer: _=>"Voir curseur &nbsp; &#60; "+( game.infos.has_see_pointer?"Visible":"Caché" )+" &#62;",
		str_bt_right_clic: _=>"Clic droit &nbsp; &#60; "+( game.infos.has_right_click?"Visible":"Caché" )+" &#62;",
		str_bt_fullscreen: _=>"Plein écran &nbsp; &#60; "+( game.infos.is_fullscreen?"Total":"Mini" )+" &#62;",
		sw_see_pointer: _=>{ game.infos.has_see_pointer= 1-game.infos.has_see_pointer; _sel("svg").style.cursor= game.infos.has_see_pointer?"default":"none"; },
		sw_right_click: _=>{game.infos.has_right_click= 1-game.infos.has_right_click;},
		menus: [
			{ y:98,
				k39:_=>{ bascule= "le_tuto"; },
				k13:_=>{ bascule= "le_tuto"; }
			}, // JOUER
			{ y:198,
				k39:_=>{ bascule= "jouable"; },
				k13:_=>{ bascule= "jouable"; }
			}, // tuto
			{ y:440,
				k37:_=>{game.infos.sw_see_pointer();edit_str_obj("bt_see_pointer",game.infos.str_bt_see_pointer());},
				k39:_=>{game.infos.sw_see_pointer();edit_str_obj("bt_see_pointer",game.infos.str_bt_see_pointer());},
				k13:_=>{game.infos.sw_see_pointer();edit_str_obj("bt_see_pointer",game.infos.str_bt_see_pointer());}
			},
			{ y:540,
				k37:_=>{game.infos.sw_right_click();edit_str_obj("bt_right_clic",game.infos.str_bt_right_clic());},
				k39:_=>{game.infos.sw_right_click();edit_str_obj("bt_right_clic",game.infos.str_bt_right_clic());},
				k13:_=>{game.infos.sw_right_click();edit_str_obj("bt_right_clic",game.infos.str_bt_right_clic());}
			},
			{ y:640,
				k37:_=>{sw_fullscreen(0);edit_str_obj("bt_fullscreen",game.infos.str_bt_fullscreen());},
				k39:_=>{sw_fullscreen(0);edit_str_obj("bt_fullscreen",game.infos.str_bt_fullscreen());},
				k13:_=>{sw_fullscreen(0);edit_str_obj("bt_fullscreen",game.infos.str_bt_fullscreen());}
			},
		],
		cury: 0,
		elems: [null,null],

	} },



	"jouable":{ kd: kc=>{

		if( kc==27 ){ bascule= "cinemat"; }

		if( scene["ton"].stock == null ){
			// trois fois droite puis ptet retry
			kc==39 ?( game.infos.tripledroite++, game.infos.tripledroite>2 &&( game.infos.system.retry(false) ) ):( game.infos.tripledroite= 0 );
			return false;
		}

		if( game.infos.moved(kc) ){
			scene["ton"].gas--;
			// detruire terrain ou conso exageree
			if( game.infos.all.tiles[scene["ton"].me_pos].vie == 1 ){
				game.infos.a_tile.couper();
			}else{
				scene["ton"].gas--;
				if(scene["ton"].gas<0){ scene["ton"].gas=0; }
				scene["ton"].over_dist++;
				if( scene["ton"].over_dist>3 && game.infos.all.tiles[scene["ton"].me_pos].vie==0 && scene["ton"].stock>scene["ton"].space ){
					scene["ton"].stock--;
					game.infos.all.tiles[scene["ton"].me_pos].vie= 1;
					edit_pt_obj( "tile"+scene["ton"].me_pos, "herbe_max" );
				}
			}

			// recharger
			if( scene["ton"].me_pos == scene["gas"].gas_pos ){
				game.infos.eloigner();
				scene["ton"].gas= Math.min( scene["ton"].max_gas, scene["ton"].gas+scene["gas"].gas_bonus );
				scene["gas"].gas_bonus>20 &&( scene["gas"].gas_bonus-=5 );
			}

			// ptet perdu
			if( scene["ton"].gas<1 ){
				scene["ton"].stock= null;
				game.infos.tripledroite= 0;
				setTimeout( "game.infos.system.over('loose');", 750 );
				return false;
			}

			// vider stock
			if( scene["ton"].me_pos == scene["compost0"].pos ){ game.infos.compostTouch(0); }
			if( scene["ton"].me_pos == scene["compost1"].pos ){ game.infos.compostTouch(1); }

			edit_pt_obj( "ton", "ton" );

		}

	}, init: _=>{

		(scene["ton"] == null || scene["ton"].stock==null) &&( game.infos.system.retry(true) );

	}, tick: _=>{

	}, infos:{
		system: {
			cx100: vv=> vv*100%1000,
			cy100: vv=> (vv/10|0)*100,
			over: type=>{

				if( type==null ){
					del_obj("ecran_over");
					del_obj("GM-loose");
					del_obj("GM-win");
					return;
				} // null==cacher
				if( type=="loose" ){
					scene["ton"].gas= 8;
					edit_pt_obj( "ton", "ton" );
					scene["ton"].me_pos= 11;
					edit_move_obj("ton",game.infos.system.cx100(scene["ton"].me_pos),game.infos.system.cy100(scene["ton"].me_pos));
					scene["gas"].gas_pos= 28;
					edit_move_obj("gas",game.infos.system.cx100(scene["gas"].gas_pos),game.infos.system.cy100(scene["gas"].gas_pos));
					add_obj( {id:"ecran_over",t:"abst_over",x:0,y:0}, {pt:"GM"} );
					add_obj( {id:"GM-loose",t:"abst_over",x:0,y:0}, {pt:"GM-loose"} );
					game.kd(40);
				}else{
					scene["ton"].gas= scene["ton"].max_gas;
					game.infos.eloigner();
					add_obj( {id:"ecran_over",t:"abst_over",x:0,y:0}, {pt:"GM"} );
					add_obj( {id:"GM-win",t:"abst_over",x:0,y:0}, {pt:"GM-win"} );
					game.kd(40);
				}

			},
			retry: all=>{

				if( all ){
					delete_scene();
					game.infos.all.tiles= [...Array(game.infos.all.sizeN*game.infos.all.sizeN)].map( vv=>{ return {vie:1}; });
					game.infos.all.tiles.forEach( (vv,kk)=>{   add_obj( {id:"tile"+kk,t:"svg_g100",x:(kk%10)*100,y:(kk/10|0)*100}, {pt: vv.vie? "herbe_max": "herbe_min" } );   } );
					add_obj( {id:"ton",t:"abst_ton",temp_f:obj=>{game.infos.system.obj_x_y_by_attr(obj,"me_pos");}}, {pt:"ton"} );
					add_obj( {id:"gas",t:"abst_gas",temp_f:obj=>{game.infos.system.obj_x_y_by_attr(obj,"gas_pos");}}, {pt:"gas"} );
					add_obj( {id:"compost0",t:"abst_compost",temp_f:obj=>{game.infos.system.obj_compost_pos(obj,0);game.infos.system.obj_x_y_by_attr(obj,"pos");}}, {pt:"compost_min"} );
					add_obj( {id:"compost1",t:"abst_compost",temp_f:obj=>{game.infos.system.obj_compost_pos(obj,1);game.infos.system.obj_x_y_by_attr(obj,"pos");}}, {pt:"compost_max",stock:12} );
				}else{

					game.infos.all.tiles.forEach( (tile,kk)=>{   tile.vie= 1;   edit_pt_obj( "tile"+kk, "herbe_max" );   });

					scene["compost0"].stock= 0;
					scene["compost1"].stock= 12;
					edit_pt_obj( "compost0", scene["compost0"].stock>=scene["compost0"].space?"compost_max":"compost_min" );
					edit_pt_obj( "compost1", scene["compost1"].stock>=scene["compost1"].space?"compost_max":"compost_min" );

					scene["ton"].stock= 0;
					edit_pt_obj( "ton", "ton" );
					scene["ton"].over_dist= 0;

					scene["gas"].gas_pos= 28;
					edit_move_obj("gas",game.infos.system.cx100(scene["gas"].gas_pos),game.infos.system.cy100(scene["gas"].gas_pos));
					scene["gas"].gas_bonus= 35;
					edit_pt_obj( "gas", "gas" );

				}

				game.infos.system.over(null);
				game.kd(39);

			},
			obj_x_y_by_attr: (obj,attr_name)=>{
				obj.x= game.infos.system.cx100(obj[attr_name]);
				obj.y= game.infos.system.cy100(obj[attr_name]);
			},
			obj_compost_pos: (obj,num)=>{
				obj.pos= num==1? (game.infos.all.sizeN-1)*game.infos.all.sizeN: game.infos.all.sizeN-1;
			},
		}, a_tile: {
			couper: _=>{

				// regle: peut dépasser de 1 mais faut pas rouler trop longtemps :p
				if( scene["ton"].stock<=scene["ton"].space ){
					scene["ton"].over_dist= 0;
					game.infos.all.tiles[scene["ton"].me_pos].vie= 0;
					edit_pt_obj( "tile"+scene["ton"].me_pos, "herbe_min" );
					scene["ton"].stock++;

					if( game.infos.all.tiles.findIndex( vv=> vv.vie==1 )<0 ){
						// mamie contente + agrandi terrain
						game.infos.system.over("win");
						scene["ton"].stock= null;
						game.infos.tripledroite= 0;
					}

				}

			}
		}, all: {
			sizeN: 10, tiles: [], sizew: 75,
		},
		eloigner: _=>{

			let choix= [];
			let mult= [-6,-5,-4,-3,3,4,5,6];
			let px= 0;
			let py= 0;
			for( let curxy=0, lig= mult.length, len=lig*lig; curxy<len; curxy++ ){
				px= mult[curxy%lig];
				py= mult[curxy/lig|0];
				if( scene["ton"].me_pos+py*game.infos.all.sizeN>-1
					&& scene["ton"].me_pos+py*game.infos.all.sizeN<game.infos.all.sizeN*game.infos.all.sizeN
					&& scene["ton"].me_pos%game.infos.all.sizeN+px>-1
					&& scene["ton"].me_pos%game.infos.all.sizeN+px<game.infos.all.sizeN ){
					choix.push( scene["ton"].me_pos+px+py*game.infos.all.sizeN );
				}
			}

			if( choix.length<1 ){ scene["gas"].gas_pos= 0; edit_move_obj("gas",game.infos.system.cx100(scene["gas"].gas_pos),game.infos.system.cy100(scene["gas"].gas_pos)); return; }
			scene["gas"].gas_pos= choix[Math.random()*choix.length|0];
			edit_move_obj("gas",game.infos.system.cx100(scene["gas"].gas_pos),game.infos.system.cy100(scene["gas"].gas_pos));
			edit_pt_obj( "gas", "gas" );

		},
		moved: kc=>{

			if( kc==38 && scene["ton"].me_pos>game.infos.all.sizeN-1 ){ scene["ton"].me_pos-= game.infos.all.sizeN;
				edit_move_obj("ton",game.infos.system.cx100(scene["ton"].me_pos),game.infos.system.cy100(scene["ton"].me_pos)); return 1; } // haut
			if( kc==40 && scene["ton"].me_pos<game.infos.all.sizeN*(game.infos.all.sizeN-1) ){ scene["ton"].me_pos+= game.infos.all.sizeN;
				edit_move_obj("ton",game.infos.system.cx100(scene["ton"].me_pos),game.infos.system.cy100(scene["ton"].me_pos)); return 1; } // bas
			if( kc==37 && scene["ton"].me_pos%game.infos.all.sizeN>0 ){ scene["ton"].me_pos-= 1;
				edit_move_obj("ton",game.infos.system.cx100(scene["ton"].me_pos),game.infos.system.cy100(scene["ton"].me_pos)); return 1; } // gauche
			if( kc==39 && scene["ton"].me_pos%game.infos.all.sizeN<(game.infos.all.sizeN-1) ){ scene["ton"].me_pos+= 1;
				edit_move_obj("ton",game.infos.system.cx100(scene["ton"].me_pos),game.infos.system.cy100(scene["ton"].me_pos)); return 1; } // droite
			return 0;

		},
		compostTouch: num=>{

			// deplacer selon possible
			const transfert= Math.min( scene["compost"+num].space-scene["compost"+num].stock, scene["ton"].stock );
			scene["compost"+num].stock+= transfert;
			scene["ton"].stock-= transfert;
			// vider l'autre si lui est remplis
			if( scene["compost"+num].stock>=scene["compost"+num].space ){
				scene["compost"+(1-num)].stock= 0;
			}
			edit_pt_obj( "compost"+num, scene["compost"+num].stock>=scene["compost"+num].space?"compost_max":"compost_min" );
			edit_pt_obj( "compost"+(1-num), scene["compost"+(1-num)].stock>=scene["compost"+(1-num)].space?"compost_max":"compost_min" );

		},
	} },



	"le_tuto":{ kd: kc=>{

			if( kc==27 || kc==37 ){ bascule= "reglage"; } // gauche

		}, init: _=>{
			game.infos.cur_espacement= 0;
			game.infos.help_list.forEach( obj=>{
				add_obj( {id:game.infos.gene_id(),t:"text",x:obj.x,y:game.infos.cur_espacement+=game.infos.offset_espacement+obj.mt}, {str:obj.txt,color:obj.col,fs:obj.size} );
			});
		}, tick: _=>{
		}, infos:{
			cur_id: 0,
			gene_id: _=>{ return game.infos.cur_id++; },
			cur_espacement: -30,
			offset_espacement: 60,
			help_list:[
				{x:375,mt:0,col:"#8b0",size:52,txt:"Touches :"},
				{x:80,mt:30,col:"#068",size:32,txt:"F11= permet une meilleure experience de jeu"},
				{x:80,mt:0,col:"#068",size:32,txt:"Droite= changer/valider &nbsp; Gauche= changer/quitter"},
				{x:80,mt:0,col:"#068",size:32,txt:"Touches en jeu :"},
				{x:80,mt:0,col:"#068",size:32,txt:"Haut, Bas, Gauche, Droite, &nbsp; Echap= retour au Menu"},
				{x:320,mt:70,col:"#8b0",size:52,txt:"Pret à tondre ?"},
				{x:80,mt:30,col:"#880",size:32,txt:"Le but est de tondre entierement la pelouse"},
				{x:80,mt:0,col:"#880",size:32,txt:"Attention au niveau de carburant (Attrappez des bidons)"},
				{x:80,mt:0,col:"#880",size:32,txt:"Evitez de rouler sur l'herbe coupée"},
				{x:80,mt:0,col:"#880",size:32,txt:"Le bac de ramassage est à vider au compost"},
				{x:80,mt:0,col:"#880",size:32,txt:"car le trop plein d'herbe risque de tomber par terre"},
				{x:80,mt:0,col:"#880",size:32,txt:"Un compost rempli permet de débloquer l'autre."},
				{x:80,mt:0,col:"#922",size:32,txt:"Faites attention, mamie veille au grain."},
			],
		}
	},



	"minijeu":{ kd: kc=>{}, init: _=>{}, tick: _=>{}, infos:{} },



	"cinemat":{ kd: kc=>{
			if( kc==39 ){ game.infos.speed= 0.03; } // droite
	}, init: _=>{

		game.infos.speed= 1;
		game.infos.cur_time= 0;
		game.infos.cur_actu= -1;

	}, tick: _=>{

		game.infos.cur_time+= timeg;
		if( game.infos.cur_actu<0 || game.infos.cur_time >= game.infos.diapos[ game.infos.cur_actu ][0]*game.infos.speed*game.infos.diapospeed() ){

			game.infos.cur_actu<0 ||( game.infos.cur_time= 0 );
			game.infos.cur_actu++;
			if( game.infos.cur_actu < game.infos.diapos.length ){
				game.infos.diapos[ game.infos.cur_actu ][1]();
			}else{
				bascule= "reglage"; // fin cinemat
			}
		}

	}, infos:{

		speed: 1,
		diapospeed: _=> dev_prod.is_prod? 1: 0.1,
		cur_time: null,
		cur_actu: null,
		cur_id: 0,
		gene_id: _=>{ return game.infos.cur_id++; },
		diapos: [
			[0.5,_=>{
				add_obj( {id:game.infos.gene_id(),t:"text",x:684,y:950}, {str:"(Droite pour passer)",color:"#880",fs:32} );
			}],
			[2.2,_=>{
				add_obj( {id:game.infos.gene_id(),t:"text",x:290,y:125}, {str:"LaF3t' prod.",color:"#800",fs:80} );
				add_obj( {id:game.infos.gene_id(),t:"text",x:285,y:120}, {str:"LaF3t' prod.",color:"#f80",fs:80} );
				add_obj( {id:game.infos.gene_id(),t:"text",x:235,y:265}, {str:"vous présente :",color:"#800",fs:80} );
				add_obj( {id:game.infos.gene_id(),t:"text",x:230,y:260}, {str:"vous présente :",color:"#f80",fs:80} );
			}],
			[3.0,_=>{
				add_obj( {id:game.infos.gene_id(),t:"text",x:246,y:614}, {str:"(Gazon en folie)",color:"#800",fs:72} );
				add_obj( {id:game.infos.gene_id(),t:"text",x:286,y:534}, {str:"Crazy garden",color:"#700",fs:72} );
				add_obj( {id:game.infos.gene_id(),t:"text",x:282,y:530}, {str:"Crazy garden",color:"#d70",fs:72} );
				add_obj( {id:game.infos.gene_id(),t:"text",x:242,y:610}, {str:"(Gazon en folie)",color:"#f80",fs:72} );
			}],
//			[0.3,_=>{ delete_scene(); }],
		],

	} },

};
