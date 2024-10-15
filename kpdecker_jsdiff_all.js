// tiny  Diff + Line + dmp  from kpdecker, by msnbrest

const diff= {

	go: (txt1, txt2)=>{

		txt1= diff.cut(txt1);
		txt2= diff.cut(txt2);

		let l1= txt1.length,
		l2= txt2.length;

		bestPath= [{ oldPos: -1, last: null }],

		newPos= diff.commons(bestPath[0], txt2, txt1, 0, l1, l2);

		if( bestPath[0].oldPos + 2 > l1 && newPos + 2 > l2 ){
			return diff.final([], bestPath[0].last, txt2, txt1); // Identity per the equality
		}

		// Comment https://github.com/kpdecker/jsdiff/blob/master/src/diff/base.js line 48 :
		// perf is O(n+d^2)  but can O(n+d) like page 7 of algorithm Myers's paper
		// d= text2 length - text1 length, and n= text1 length
		let editLen= 1,   minDiago= -Infinity,   maxDiago= Infinity;

		while( editLen <= l2 + l1 ){
			// checks permutations
			for( let diago= Math.max(minDiago, -editLen); diago <= Math.min(maxDiago, editLen); diago += 2 ){

				let removePath= bestPath[diago - 1],   addPath= bestPath[diago + 1];

				if( removePath ){ bestPath[diago - 1]= null; } // clear unusable value

				 // newPos after insertion
				let canAdd= addPath ? ( val=> val >= 0 && val < l2 )( addPath.oldPos - diago ) : false;
				let canRemove= removePath && removePath.oldPos + 1 < l1;

				if( !canAdd && !canRemove ){   bestPath[diago]= null;   continue;   } // prune when path is a terminal

				let is= !canRemove || (canAdd && removePath.oldPos < addPath.oldPos);

				let path= is? addPath: removePath;
				let patch= is? 1: -1;

				let is2= path.last && path.last.patch == patch;

				// Select branch by diagonal. when position in old string is the farthest from origin no bounds of diff graph
				let basePath= {
					oldPos: path.oldPos +( is? 0: 1 ),
					last: { count: ( is2? path.last.count: 0 ) +1, patch: patch, prev: is2? path.last.prev: path.last }
				};

				newPos= diff.commons(basePath, txt2, txt1, diago, l1, l2);

				if( basePath.oldPos + 2 > l1 ){ maxDiago= Math.min(maxDiago, diago - 1); }
				if( newPos + 2 > l2 ){ minDiago= Math.max(minDiago, diago + 1); }
				if( basePath.oldPos + 2 > l1 && newPos + 2 > l2 ){
					// hit end of both strings
					return diff.final([], basePath.last, txt2, txt1);
				}
				bestPath[diago]= basePath;
			}

			editLen++;
		}
	},

	commons: (basePath, txt2, txt1, diago, l1, l2)=>{

		let oldPos= basePath.oldPos+1,   newPos= oldPos - diago,   nb= 0;

		while( newPos < l2 && oldPos < l1 && txt1[oldPos] == txt2[newPos] ){
			newPos++; oldPos++; nb++;
		}

		nb &&( basePath.last= { count: nb, prev: basePath.last, patch: 0 } );
		basePath.oldPos= oldPos-1;
		return newPos-1;
	},

	cut: value=> value.replace(/\r\n/g,"\n").split("\n").map(vv=>vv+="\n"),
	
	final:( arr, last, txt2, txt1 )=>{

		let next;
		while( last ){ // save, unlink, remove, getNext.
			arr.push(last);
			next= last.prev;
			delete last.prev;
			last= next;
		}
		arr.reverse();

		let newPos= 0,   oldPos= 0;

		arr.forEach( blk=>{
			if( blk.patch<0 ){
				blk.value= txt1.slice(oldPos, oldPos + blk.count).join("");
				blk.ligne= oldPos;
				oldPos += blk.count;
			}else{
				blk.value= blk.patch>0?
					txt2.slice(newPos, newPos + blk.count).join("")
					:
					txt2.slice(newPos, newPos + blk.count)
						.map( (value, i)=> ( vv=> vv.length > value.length ? vv : value )( txt1[oldPos + i] ) )
						.join("");
				blk.ligne= newPos;
				newPos += blk.count;
				if( blk.patch==0 ){ oldPos += blk.count; } // =common
			}
		});

		return arr;
	},

	dmp_max_lines: ( str, spc )=>{

		let lines= str.split("\n");
		if( lines.length < spc*2+1 ){ return str; }
		lines.splice( spc, lines.length-1-spc*2, "..." );
		return lines.join("\n");
	},

	toDMP_whites: (arr,simi)=>{ // change "patch" to css transparency, with max similar lines between diffs lines

		let mem= {patch:0};
		arr.forEach( vv=>{
			if( mem.patch<0 && vv.patch>0 && mem.value.split("\n").map(v2=>v2.replace(/^ +| +$/,"")).join("") == vv.value.split("\n").map(v2=>v2.replace(/^ +| +$/,"")).join("") ){   vv.patch+= 3;   mem.patch+= 3;   }
			mem= vv;
		});
		return arr.map( u=> `<div><pr class='${ u.patch==-1||u.patch==2? "c999": "cdc0" }' title='${ u.patch==-1||u.patch==2? "old": "new" }'>${u.ligne}</pr><c${ u.patch }>${ u.patch==0&&simi!=-1? diff.dmp_max_lines(u.value,simi): u.value }</c${ u.patch }></div>` ).join(""); // by util/dmp.js
	}
};

// See: http://code.google.com/p/google-diff-match-patch/wiki/API