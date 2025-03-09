let des= [0,0],   veut= [],   plateau= [1,2,3,4,5,6,7,8,9],   destry= [],
msg_end= ["S","H","U","T"," ","T","H","E"," ","B","O","X"],

kd_act= { 49: _=>{ numclic("1"); }, 50: _=>{ numclic("2"); }, 51: _=>{ numclic("3"); }, 52: _=>{ numclic("4"); }, 53: _=>{ numclic("5"); },
54: _=>{ numclic("6"); }, 55: _=>{ numclic("7"); }, 56: _=>{ numclic("8"); }, 57: _=>{ numclic("9"); }, 32: _=>{ lancer(); }, 16: _=>{ rejouer(); } },

lancer= _=>{   if( !destroy(des[0]+des[1]) ){ return; }   if( restants().length<1 ){ show_end(); return; }
	des[0]= (Math.random()*6|0)+1;   des[1]= (Math.random()*6|0)+1;   _sel("#res_des").innerHTML= "";
	setTimeout( _=>{ _sel("#res_des").innerHTML= `<div class='tile hl'>${des[0]}</div>&nbsp;<div class='tile hl'>${des[1]}</div>`; }, 25 );   },

destroy= need=>{   let tot= 0;   veut.forEach( vv=>{ tot+= vv; });   if( tot!=need && not_1(restants()) ){ return false; }
	veut.forEach( vv=>{ destry.push(vv); });   veut= [];   all();   return true;   },

restants= _=> plateau.filter( vv=> !destry.includes(vv) ),

show_end= _=>{   _sel("#res_des").innerHTML= "&nbsp;";   _sel("#plato").innerHTML= msg_end.map( chr=> chr_bt(chr) ).join("");   },

not_1= rest=> rest.length!=1 || rest[0]!=1 || ( des[0]!=1 && des[1]!=1 ), // verif is not just [1]

num_bt= (num,hl)=> `<div class='tile ${hl?"hl":destry.includes(num)?"destry":""}' onclick='numclic(this.innerText)'>${num}</div>`,

chr_bt= (chr)=> `<div class='tile hl'>${chr}</div>`,

numclic= num=>{   if( destry.includes(+num) ){ return; }   if( veut.includes(+num) ){ veut= veut.filter(vv=>+num!=vv); }else{ veut.push( +num ); }   all();   },

all= _=>{   _sel("#plato").innerHTML= plateau.map( num=> num_bt(num,veut.includes(num)) ).join("");   },

rejouer= _=>{   des= [0,0];   veut=[];   plateau= [1,2,3,4,5,6,7,8,9];   destry= [];   lancer();   all();   },   init= _=>{ all(); },

sw_h= html_elem=>{ html_elem.style.opacity=="0.02"? (html_elem.style.opacity="1"): (html_elem.style.opacity="0.02"); },

kd= event=>{   if( event.keyCode in kd_act ){   kd_act[event.keyCode]();   event.preventDefault();   }   };


window.addEventListener("load",init,false);   window.addEventListener("keydown",kd,0);