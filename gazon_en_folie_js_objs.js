const t_g_obj= { // attrs est une liste pour mapper les entrants, ça évite les oublis et ignore les surplus d'informations.

path:{
attrs:[ {n:"stroke",v:"none"}, {n:"fill",v:"#000"}, {n:"rd",v:"h40v40h-40"} ],
svg: obj=> '<path id="obj'+ obj.id +'" stroke="'+ obj.stroke +'" fill="'+ obj.fill +'" d="M'+ obj.x +' '+ obj.y + obj.rd +'z"></path>'
},
text:{
attrs:[ {n:"str",v:""}, {n:"color",v:"#fff"}, {n:"fs",v:"24"} ],
svg: obj=> '<text id="obj'+ obj.id +'" fill="'+ obj.color +'" x="'+ obj.x +'" y="'+ (obj.y+obj.fs*0.75) +'" font-size="'+ obj.fs +'">'+ obj.str +'</text>'
},
svg_g1000:{
attrs:[ {n:"pt",v:"default"} ],
svg: obj=> '<g id="obj'+ obj.id +'" transform="translate('+ obj.x +' '+ obj.y +')">'+ svg_path[obj.pt](obj) +'</g>'
},
svg_g100:{
attrs:[ {n:"pt",v:"default"} ],
svg: obj=> '<g id="obj'+ obj.id +'" transform="translate('+ obj.x +' '+ obj.y +') scale(0.1 0.1)">'+ svg_path[obj.pt](obj) +'</g>'
},

abst_compost:{
attrs:[ {n:"pt",v:"default"}, {n:"stock",v:0}, {n:"space",v:12}, {n:"pos",v:null} ],
svg: obj=> t_g_obj.svg_g100.svg(obj),
},

abst_ton:{
attrs:[ {n:"pt",v:"default"}, {n:"stock",v:0}, {n:"space",v:8}, {n:"gas",v:8}, {n:"max_gas",v:50}, {n:"me_pos",v:11}, {n:"over_dist",v:0} ],
svg: obj=> t_g_obj.svg_g100.svg(obj),
},

abst_gas:{
attrs:[ {n:"pt",v:"default"}, {n:"gas_bonus",v:35}, {n:"gas_pos",v:28} ],
svg: obj=> t_g_obj.svg_g100.svg(obj),
},

abst_over:{
attrs:[ {n:"pt",v:"default"} ],
svg: obj=> t_g_obj.svg_g1000.svg(obj),
},

},



svg_path= {
// regle: pour l'instant, chaque path est (ou pas) relié à une donnée mémoire

"default": obj=> '<path fill="#f00" d="M0 0h100v100h-100z"/>',

"herbe_min": obj=> '<path fill="#232" d="M0 0h990v990h-990z"/>',

"herbe_max": obj=> '<path fill="#080" d="M0 0h990v990h-990z"/>',

"GM": obj=> '<path fill="#000c" d="M0,0h1000v1000h-1000z"/><path fill="#aaa" d="M309 64l22,5l18,15l8,20l1,20l20,18l13,22l6,32l-3,30l-8,18l-10,15l20,1l11,3l132,78l10,13l39,154l-1,22l-13,18l-23,8l-23,-6l-13,-17l-35,-136l-54,-32l68,402l-1,13l-11,6l-61,0l0,180l-11,27l-28,11l-25,-10l-13,-27l0,-181l-68,0l0,178l-13,30l-25,10l-27,-10l-13,-28l0,-180l-59,0l-11,-5l-3,-10l66,-406l-51,30l-22,83l11,11l15,28l3,23l-5,13l-17,5l-10,-5l-6,-13l-3,-17l-11,18l-25,10l-22,-5l-10,-8l0,449l-8,13l-20,0l-10,-11l0,-460l5,-25l11,-18l22,-15l30,-122l3,-6l5,-5l137,-81l6,-1l27,0l-13,-18l-10,-30l3,-40l17,-30l18,-17l3,-5l-1,-10l5,-18l20,-22z"/><path fill="#000c" d="M351,218l34,-51h-68l-20,-20v-127l20,-20h663l20,20v127l-20,20l-552,0z"/>',

"ton": obj=> '<path fill="#aaa" d="M10,220h100l140,294l-44,40l-132-280h-62z"/><path fill="#090" d="M370,560l30-100l400,116l-30,100z"/><path fill="#e40" d="M190,490l740,200v160h-740z"/><path fill="#f52" d="M190,490l370,100v258h-370z"/><path fill="#ccc" d="M450,868h240v12h-240z"/><path fill="#543" d="M850,760h80l36,24l24,36v80l-24,36l-36,24h-80l-36-24l-24-36v-80l24-36l36-24z"/><path fill="#ddf" d="M832,822h80l20,20v40l-20,20h-40l-20-20v-40l20-20z"/><path fill="#543" d="M160,710h80l50,30l30,50v80l-30,50l-50,30h-80l-50-30l-30-50v-80l30-50l50-30z"/><path fill="#ddf" d="M176,766h50l40,40v50l-40,40h-50l-40-40v-50l40-40z"/><text fill="#fff" x="400" y="820" font-size="240" font-family="arial,sans-serif">'+ obj.gas +'</text><text fill="#fff" x="50" y="680" font-size="240" font-family="arial,sans-serif">'+( obj.stock||0 )+'</text>',

"gas": obj=> '<g transform="translate(-90 -70)"><path fill="#910" d="M725,199h-134a18,18,0,0,0-14,7l-56,73a18,18,0,0,0,14,29h191a18,18,0,0,0,18-18V218A18,18,0,0,0,725,199Zm-18,73H571l28-36h107Zm191-35H790V171a18,18,0,0,0-18-18H567a18,18,0,0,0-14,7l-126,163-41,20-6-13,9-4a18,18,0,0,0,8-24l-25-50a18,18,0,0,0-24-8l-114,57a18,18,0,0,0-8,24l25,50a18,18,0,0,0,16,10,18,18,0,0,0,8-1l9-4,6,13-27,13-0 0-0 0-0 0-0 0a8,8,0,0,0-0 0l-0 0c-0 0-0 0-0 0l-0 0c-0 0-0 0-0 0l-0 0-0 0-0 0c-0 0-0 0-0 0s-0 0-0 0-0 0-0 0-0 0-0 0-0 0-0 0l-0 0a6,6,0,0,0-0 0c0, 0,0, 0-0 0a6,6,0,0,0-0 0,7,7,0,0,0,0, 0l0, 0v545a57,57,0,0,0,57,57H898a57,57,0,0,0,57-57V295A57,57,0,0,0,898,237ZM264,324l81-40,8,17-9,4h0l-61,30h0l-9,4Zm80,23L351,361l-28,14-6-13ZM576,189h177v130H475Zm342,771a20,20,0,0,1-20,20H309a20,20,0,0,1-20-20v-528l152-76H772a18,18,0,0,0,18-18V274h107a20,20,0,0,1,20,20ZM827,868a18,18,0,0,1-25,25l-195-195-195,195a18,18,0,0,1-25-25L579,672l-195-195a18,18,0,0,1,25-25l195,195,195-195a18,18,0,1,1,25,25L631,672Z"/></g><text fill="#f40" x="250" y="750" font-size="480" font-family="arial,sans-serif">'+ obj.gas_bonus +'</text>',

"compost_min": obj=> '<path fill="#000" d="M188,74l17,-17h28l17,17v454h113l21,21v213l-28,71l-28,28l-71,28h-78l-71-28l-28-28l-28-71v-213l21-21h113z"/><path fill="#077" d="M113,585h78v113l17,17h28l17-17v-113h78v181l-24,46l-46,24h-78l-46-24l-24-46z"/><path fill="#000" d="M305,781l85-53l49-14l53-31h71l53,28l31,53l31,14l28,28l71,10l63,53l28,60h116l17,17v28l-17,17h-965l-17-17v-28l17-17h92l21-53l63-35l71-24z"/><path fill="#CA8" d="M369,837l60-49h56l28-35l42-7l39,35l7,42l49,10l14,31l85,7l63,56h-642l53,-42l71-17l42,7l21-14z"/><text fill="#ddd" x="450" y="450" font-size="480" font-family="arial,sans-serif">'+ obj.stock +'</text>',

"compost_max": obj=> '<path fill="#000" d="M188,21l17,-17h28l17,17v454h113l21,21v213l-28,71l-28,28l-71,28h-78l-71-28l-28-28l-28-71v-213l21-21h113z"/><path fill="#077" d="M113,532h78v113l17,17h28l17-17v-113h78v181l-24,46l-46,24h-78l-46-24l-24-46z"/><path fill="#000" d="M234,639l85-124l67-14l53-31h71l53,63l39,53l67,31l39,63l71,81l63,71l28,95h114l17,17v28l-17,17h-965l-17-17v-28l17-17h85l21-71l63-71l14-95z"/><path fill="#c02" d="M369,589l60-49h56l53,71l67,28l63,53l28,71l49,42l49,85l17,39h-642l42,-28l28-142l42-71l21-85z"/><text fill="#ddd" x="450" y="450" font-size="480" font-family="arial,sans-serif">'+ obj.stock +'</text>',

"GM-loose": obj=> '<text fill="#fff" x="450" y="68" font-size="42" font-family="arial,sans-serif">Non mais c&#39;est quoi</text><text fill="#fff" x="490" y="124" font-size="40" font-family="arial,sans-serif">ce travail là ! Grrr</text><text fill="#000" x="239" y="978" font-size="36" font-family="arial,sans-serif">( Appuyez trois fois sur &#39;Droite&#39; pour continuer )</text><text fill="#000" x="241" y="982" font-size="36" font-family="arial,sans-serif">( Appuyez trois fois sur &#39;Droite&#39; pour continuer )</text><text fill="#ff0" x="240" y="980" font-size="36" font-family="arial,sans-serif">( Appuyez trois fois sur &#39;Droite&#39; pour continuer )</text>',

"GM-win": obj=> '<text fill="#fff" x="592" y="68" font-size="42" font-family="arial,sans-serif">Merci</text><text fill="#fff" x="440" y="124" font-size="36" font-family="arial,sans-serif">pour cette tonte parfaite</text><text fill="#000" x="239" y="978" font-size="36" font-family="arial,sans-serif">( Appuyez trois fois sur &#39;Droite&#39; pour continuer )</text><text fill="#000" x="241" y="982" font-size="36" font-family="arial,sans-serif">( Appuyez trois fois sur &#39;Droite&#39; pour continuer )</text><text fill="#ff0" x="240" y="980" font-size="36" font-family="arial,sans-serif">( Appuyez trois fois sur &#39;Droite&#39; pour continuer )</text>',

};



// todo idee :
// Trophee, collecter 25+ bidons sans terminer l'herbe
// Trophee, collecter 50 bidons apres avoir coupé l'herbe plateau vidé
// Trophee, toucher les 4 coins de l'écran apres avoir coupé l'herbe
// Trophee, chopper essence sur la case compost + non tondue xD
// Trophee, perdre 3 fois en ayant fait juste une ligne droite ^^ faut pas pousser mémé
// Trophee, buter taupe avec tondeuse ou à la scie
// dechets + main = créer scie

// trois coeurs.   dechets, panne = -1, attente x temps = recup +1, pierre = -3, fleur = -1.
// Augmenter taille lorsque gagné, donc + bidons mais memes compost
// Power up : prout qui propulse de 3 cases, conso essence ( à sec ? marche quand meme )
// perdu = mini jeu pour la réparer soit même (selon essence ou lame hs)

// stats
// total on a tondu
// combien de fois on a vidé
// combien de fois on a ramassé carburant
// timer sec
// "distance parcourue"

// taupe créé trou donc obstable comme dechet
// perso + tondeuse + rotophile
// perso coupe à la main by mini jeu
// perso coupe arbre via mini jeu
// pose une grange sur une case vide
// la grande peut créer et réparer tondeuse&rotophile
// ramasser dechet à la main
// dechet metal bouge pas, dechet papier bouge avec vent
// grange rend parfois jeu dispo pour regagner coeurs
// pimper tondeuse (ou via bonus) pour rouler longtemps, choisir couleur
// nain jardin

/*
ORI gas
data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path fill="%23910" d="M315.3,86.9h-58.6a8,8,0,0,0-6.3,3.1l-24.6,31.8a8,8,0,0,0,6.3,12.9h83.2a8,8,0,0,0,8-8V94.9A8,8,0,0,0,315.3,86.9Zm-8,31.8H248.4l12.2-15.8h46.6Zm83.2-15.4H343.7V74.5a8,8,0,0,0-8-8H246.7a8,8,0,0,0-6.3,3.1l-55.1,71.2-17.9,9-2.9-5.8,4.2-2.1a8,8,0,0,0,3.5-10.7l-11-22a8,8,0,0,0-10.7-3.5l-49.6,24.8a8,8,0,0,0-3.5,10.7l11,21.9a8,8,0,0,0,7.1,4.4,7.9,7.9,0,0,0,3.5-.8l4.2-2.1,2.9,5.7-11.9,5.9-.0 0.0-.4 0.2-.2 0.1-.3 0.2a3.8,3.8,0,0,0-.3 0.2l-.2 0.2c-.1 0.1-.2 0.2-.3 0.3l-.1 0.2c-.1 0.1-.2 0.2-.3 0.3l-.1 0.2-.2 0.3-.2 0.3c-.0 0.1-.1 0.2-.2 0.3s-.1 0.2-.2 0.4-.0 0.1-.1 0.2-.1 0.3-.1 0.4-.0 0.1-.1 0.2l-.1 0.4a2.8,2.8,0,0,0-.0 0.3c0,.1,0,.2-.0 0.3a2.9,2.9,0,0,0-.0 0.4,3.1,3.1,0,0,0,0,.3l0,.4v237a25.0,25.0,0,0,0,25,25H390.5a25.0,25.0,0,0,0,25-25V128.3A25.0,25.0,0,0,0,390.5,103.3ZM115.1,141.2l35.3-17.6,3.8,7.6-4.2,2.1h0l-26.9,13.4h0l-4.2,2.1Zm34.9,10L153,157l-12.6,6.3-2.8-5.7ZM250.6,82.5h77.1v56.6H206.7Zm149,338a9,9,0,0,1-9,9H134.7a9,9,0,0,1-9-9v-232l66.5-33.2H335.7a8,8,0,0,0,8-8V119.3h46.7a9,9,0,0,1,9,9ZM359.7,377.6a8,8,0,0,1-11.3,11.3l-85.1-85.2-85.2,85.2a8,8,0,0,1-11.3-11.3L252,292.4l-85.1-85.1a8,8,0,0,1,11.3-11.3l85.2,85.2,85.1-85.2a8,8,0,1,1,11.3,11.3L274.5,292.4Z"/></svg>
*/
