// bot.js (fixed & improved, edge-friendly for normal moves)
(function(root) {
  const Bot = {};

  // --- helpers ---
  const deltas8 = [
    [-1,-1],[-1,0],[-1,1],
    [0,-1],        [0,1],
    [1,-1],[1,0],[1,1]
  ];
  const deltas4 = [
    [-1,0],[0,-1],[0,1],[1,0]
  ];

  function inBounds(cells, r, c) {
    return !!(cells[r] && cells[r][c]);
  }

  function isEdgeCell(cells, r, c) {
    return r <= 1 || c <= 1 || r >= cells.length - 2 || c >= cells[0].length - 2;
  }

  function defaultCheckLength(cells, row, col, player, mode) {
    const deltas = mode === '8' ? deltas8 : deltas4;
    for (let [dr,dc] of deltas) {
      const nr = row + dr, nc = col + dc;
      if (!inBounds(cells, nr, nc)) continue;
      if (cells[nr][nc].token === player) return true;
    }
    return false;
  }

  function isLegalMove(cells, row, col, player, secondPlayer, forFortress=false) {
    const cell = inBounds(cells, row, col) ? cells[row][col] : null;
    if (!cell) return false;
    if (cell.castle) return false;
    if (cell.fortress) return false;
    if (cell.token && cell.token === player) return false;
    if (player === 'one' && cell.fortressRadiusTwo) return false;
    if (player === 'two' && cell.fortressRadiusOne) return false;
    if (!defaultCheckLength(cells, row, col, player, '4')) return false;
    if (forFortress && isEdgeCell(cells, row, col)) return false; // forbid edge placement only for fortress
    return true;
  }

  function countAdjacentOwn4(cells, row, col, player) {
    let count = 0;
    for (let [dr,dc] of deltas4) {
      const nr = row + dr, nc = col + dc;
      if (inBounds(cells, nr, nc) && cells[nr][nc].token === player) count++;
    }
    return count;
  }

  function wouldSurroundAnyCastle(cells, row, col, player) {
    for (let rr = row-1; rr <= row+1; rr++) {
      for (let cc = col-1; cc <= col+1; cc++) {
        const maybe = inBounds(cells, rr, cc) ? cells[rr][cc] : null;
        if (!maybe || !maybe.castle) continue;
        let ok = true;
        for (let [dr,dc] of deltas8) {
          const nr = rr + dr, nc = cc + dc;
          if (nr === row && nc === col) continue;
          const neigh = inBounds(cells, nr, nc) ? cells[nr][nc] : null;
          if (!neigh || !neigh.token || neigh.token !== player) { ok = false; break; }
        }
        if (ok) return true;
      }
    }
    return false;
  }

  function countPotentialFortressRadiusGain(cells, row, col, player) {
    let count = 0;
    for (let [dr,dc] of deltas8) {
      const nr = row + dr, nc = col + dc;
      const neigh = inBounds(cells, nr, nc) ? cells[nr][nc] : null;
      if (!neigh) continue;
      const hasOne = !!neigh.fortressRadiusOne;
      const hasTwo = !!neigh.fortressRadiusTwo;
      if (player === 'one') {
        if (!hasOne && !hasTwo) count += 1;
        else if (!hasOne && hasTwo) count += 0.2;
      } else {
        if (!hasTwo && !hasOne) count += 1;
        else if (!hasTwo && hasOne) count += 0.2;
      }
    }
    return count;
  }

  function ownFortressRadiusNearby(cells, row, col, player) {
    let count = 0;
    for (let [dr,dc] of deltas8) {
      const nr = row + dr, nc = col + dc;
      const neigh = inBounds(cells, nr, nc) ? cells[nr][nc] : null;
      if (!neigh) continue;
      if (player === 'one' && neigh.fortressRadiusOne) count++;
      if (player === 'two' && neigh.fortressRadiusTwo) count++;
    }
    return count;
  }

  function distanceToNearestCastle(cells, row, col) {
    let best = Infinity;
    for (let r = 1; r < cells.length-1; r++) {
      for (let c = 1; c < cells[r].length-1; c++) {
        if (cells[r][c] && cells[r][c].castle) {
          const d = Math.abs(r - row) + Math.abs(c - col);
          if (d < best) best = d;
        }
      }
    }
    return best === Infinity ? 999 : best;
  }

  function distanceToNearestOwnToken(cells, row, col, player) {
    let best = Infinity;
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (cells[r][c] && cells[r][c].token === player) {
          const d = Math.abs(r - row) + Math.abs(c - col);
          if (d < best) best = d;
        }
      }
    }
    return best === Infinity ? 999 : best;
  }

  function countOwnInRadius(cells, row, col, player, radius=2) {
    let count = 0;
    for (let dr=-radius; dr<=radius; dr++) {
      for (let dc=-radius; dc<=radius; dc++) {
        const nr = row+dr, nc = col+dc;
        if (!inBounds(cells, nr, nc)) continue;
        if (cells[nr][nc].token === player) count++;
      }
    }
    return count;
  }

  function getAllLegalMoves(cells, player, secondPlayer, forFortress=false) {
    const moves = [];
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (isLegalMove(cells, r, c, player, secondPlayer, forFortress)) {
          moves.push({row:r, col:c});
        }
      }
    }
    return moves;
  }

  // Decide whether to build a fortress
// Replace existing decideUseFortress with this
function decideUseFortress(cells, row, col, player, secondPlayer, score, allowFortress) {
  if (!allowFortress) return false;
  if (typeof score !== 'number' || score < 4) return false; // need -1 + -3

  // Always allow if this move completes surround of a castle (top priority)
  if (wouldSurroundAnyCastle(cells, row, col, player)) return true;

  // Strict: disallow fortress on map edge
  if (isEdgeCell(cells, row, col)) return false;

  // Disallow if immediate neighbor already has fortress
  for (let [dr,dc] of deltas8) {
    const nr = row + dr, nc = col + dc;
    if (!inBounds(cells, nr, nc)) continue;
    if (cells[nr][nc] && cells[nr][nc].fortress) return false;
  }

  const potentialGain = countPotentialFortressRadiusGain(cells, row, col, player); // how many cells would get radius
  if (potentialGain < 1) return false; // useless fortress

  const distToOwn = distanceToNearestOwnToken(cells, row, col, player);
  const distToCastle = distanceToNearestCastle(cells, row, col);

  // If very far from any own token — forbid (vacuum)
  if (distToOwn > 4 && distToCastle > 3) return false;

  // Opponent threat nearby relaxes rules a bit
  let opponentNearby = 0;
  for (let dr=-3; dr<=3; dr++) {
    for (let dc=-3; dc<=3; dc++) {
      const nr = row + dr, nc = col + dc;
      if (!inBounds(cells, nr, nc)) continue;
      const t = cells[nr][nc].token;
      if (t && t !== player) opponentNearby++;
    }
  }
  // If opponent is right nearby, allow small-gain forts
  if (opponentNearby >= 2 && potentialGain >= 1) return true;

  // If near castle (we want to protect it / approach it), allow modest gains
  if (distToCastle <= 3 && potentialGain >= 1.5) return true;

  // Defensive line: if there are own tokens nearby and fortress covers >=2 cells -> allow
  const ownTokensRadius2 = countOwnInRadius(cells, row, col, player, 2);
  if (ownTokensRadius2 >= 2 && potentialGain >= 2) return true;

  // Avoid building if already saturated with own radii
  const ownNearby = ownFortressRadiusNearby(cells, row, col, player);
  if (ownNearby >= 6) return false;

  // As last resort allow when potentialGain large and not too far from own
  if (potentialGain >= 3 && distToOwn <= 3) return true;

  return false;
}

  // --- Public API ---
Bot.chooseMove = function(cellsArg, playerArg, secondPlayerArg, scoreArg, options={}) {
  const allowFortress = options.allowFortress !== undefined ? !!options.allowFortress : true;
  const moves = getAllLegalMoves(cellsArg, playerArg, secondPlayerArg, false); // normal moves allowed anywhere
  if (!moves || !moves.length) return null;

  const logger = typeof options.logger === 'function' ? options.logger : ()=>{};

  // First pass: find best NON-FORTRESS move (this ensures we always have a fallback)
  let bestNonFort = null;
  let bestNonFortNet = -Infinity;
  for (const mv of moves) {
    const r = mv.row, c = mv.col;
    const adj = countAdjacentOwn4(cellsArg, r, c, playerArg);
    const surround = wouldSurroundAnyCastle(cellsArg, r, c, playerArg) ? 1 : 0;
    const dist = distanceToNearestCastle(cellsArg, r, c);
    const pathBias = Math.max(0, 60 - dist); // stronger bias to approach castles
    const linePreference = (adj <= 1) ? 3 : 1;
    const baseWeight = (adj * 2 * linePreference) + (surround * 5000) + pathBias - (dist * 2);
    const placeCost = -1;
    const netNoFort = baseWeight + placeCost;

    logger(`NON-FORT eval ${r},${c} base=${baseWeight} surround=${surround} net=${netNoFort}`);
    if (scoreArg + placeCost >= 0 && netNoFort > bestNonFortNet) {
      bestNonFortNet = netNoFort;
      bestNonFort = { row: r, col: c, useFortress: false, weight: baseWeight, net: netNoFort };
    }
  }

  // If best non-fort move completes surround, choose it immediately (highest priority)
  if (bestNonFort && wouldSurroundAnyCastle(cellsArg, bestNonFort.row, bestNonFort.col, playerArg)) {
    logger(`Choosing non-fort surround move ${bestNonFort.row},${bestNonFort.col}`);
    return bestNonFort;
  }

  // Second pass: consider fortress moves (but only inside map and not adjacent to other forts)
  let bestOverall = bestNonFort;
  let bestOverallNet = bestNonFort ? bestNonFortNet : -Infinity;

  for (const mv of moves) {
    const r = mv.row, c = mv.col;
    // skip fortress attempts on edge or if adjacent fortress exists
    if (isEdgeCell(cellsArg, r, c)) continue;
    let neighFort = false;
    for (let [dr,dc] of deltas8) {
      const nr = r + dr, nc = c + dc;
      if (!inBounds(cellsArg, nr, nc)) continue;
      if (cellsArg[nr][nc] && cellsArg[nr][nc].fortress) { neighFort = true; break; }
    }
    if (neighFort) continue;

    // compute same base weight as before (so weights comparable)
    const adj = countAdjacentOwn4(cellsArg, r, c, playerArg);
    const surround = wouldSurroundAnyCastle(cellsArg, r, c, playerArg) ? 1 : 0;
    const dist = distanceToNearestCastle(cellsArg, r, c);
    const pathBias = Math.max(0, 60 - dist);
    const linePreference = (adj <= 1) ? 3 : 1;
    const baseWeight = (adj * 2 * linePreference) + (surround * 5000) + pathBias - (dist * 2);
    const placeCost = -1;
    const fortCost = -3;

    // check fortress heuristic
    if (!decideUseFortress(cellsArg, r, c, playerArg, secondPlayerArg, scoreArg, allowFortress)) continue;

    const netWithFort = baseWeight + placeCost + fortCost;
    if (scoreArg + placeCost + fortCost < 0) continue;

    // penalties/bonuses for fortress
    const distToOwn = distanceToNearestOwnToken(cellsArg, r, c, playerArg);
    const distancePenalty = Math.max(0, distToOwn - 1) * 6;
    const fortressProtectionBonus = countPotentialFortressRadiusGain(cellsArg, r, c, playerArg) * 2.5;
    const pathBonus = Math.max(0, 6 - distanceToNearestCastle(cellsArg, r, c));
    const finalNet = netWithFort - distancePenalty + fortressProtectionBonus + pathBonus;

    logger(`FORT eval ${r},${c} finalNet=${finalNet} distToOwn=${distToOwn} gain=${fortressProtectionBonus/2.5}`);

    // Only accept fortress if it is strictly better than best non-fort by margin,
    // or if it completes surround (completing surround allowed above already)
    const advantageThreshold = 1.0; // require a little improvement to prefer fortress
    if (finalNet > bestOverallNet + advantageThreshold) {
      bestOverallNet = finalNet;
      bestOverall = { row: r, col: c, useFortress: true, weight: baseWeight, net: finalNet };
    }
  }

  if (bestOverall) {
    logger(`Chosen move ${bestOverall.row},${bestOverall.col} fort=${!!bestOverall.useFortress} net=${bestOverall.net}`);
  } else {
    logger('No move chosen (should not happen) — returning null');
  }

  return bestOverall;
};

  Bot.applyMove=function(cellsArg,move,playerArg){
    if(!move) return null;
    const row=move.row,col=move.col;
    const cell=inBounds(cellsArg,row,col)?cellsArg[row][col]:null;
    if(!cell) return null;
    if(cell.fortressRadiusOne===undefined) cell.fortressRadiusOne=false;
    if(cell.fortressRadiusTwo===undefined) cell.fortressRadiusTwo=false;
    let deltaScore=0;
    if(!cell.token || cell.token!==playerArg) deltaScore-=1;
    cell.token=playerArg;

    if(move.useFortress){
      cell.fortress=true;
      deltaScore-=3;
      for(const [dr,dc] of deltas8){
        const nr=row+dr,nc=col+dc;
        if(!inBounds(cellsArg,nr,nc)) continue;
        if(playerArg==='one') cellsArg[nr][nc].fortressRadiusOne=true;
        else cellsArg[nr][nc].fortressRadiusTwo=true;
      }
    }
    return {changedCell:cell,deltaScore};
  };

  Bot.chooseAndApply=function(cellsArg,playerArg,secondPlayerArg,scoreArg,options={}) {
    const move=Bot.chooseMove(cellsArg,playerArg,secondPlayerArg,scoreArg,options);
    if(!move) return {move:null,result:null,newScore:scoreArg};
    const res=Bot.applyMove(cellsArg,move,playerArg);
    const newScore=scoreArg+(res?res.deltaScore:0);
    return {move,res,newScore};
  };

  Bot.playUntilExhausted=function(cellsArg,botToken,secondPlayerToken,startingBotScore,options={}) {
    const allowFortress=options.allowFortress!==undefined?!!options.allowFortress:true;
    const maxMoves=typeof options.maxMoves==='number'?options.maxMoves:1000;
    const logger=typeof options.logger==='function'?options.logger:()=>{};
    let botScore=typeof startingBotScore==='number'?startingBotScore:0;
    const movesDone=[];
    for(let iter=0;iter<maxMoves;iter++){
      if(botScore<=0) break;
      const move=Bot.chooseMove(cellsArg,botToken,secondPlayerToken,botScore,{allowFortress,logger});
      if(!move) break;
      const placeCost=-1;
      const fortCost=move.useFortress?-3:0;
      const totalCost=placeCost+fortCost;
      if(botScore+totalCost<0){
        if(move.useFortress){
          const fallback=Object.assign({},move,{useFortress:false});
          if(botScore+placeCost>=0){
            const resFb=Bot.applyMove(cellsArg,fallback,botToken);
            botScore+=resFb.deltaScore;
            movesDone.push({row:fallback.row,col:fallback.col,useFortress:false,deltaScore:resFb.deltaScore,weight:move.weight});
            continue;
          } else break;
        } else break;
      }
      const res=Bot.applyMove(cellsArg,move,botToken);
      botScore+=res.deltaScore;
      movesDone.push({row:move.row,col:move.col,useFortress:!!move.useFortress,deltaScore:res.deltaScore,weight:move.weight});
    }
    return {moves:movesDone,finalScore:botScore,movesApplied:movesDone.length};
  };

  if(typeof module!=='undefined' && module.exports) module.exports=Bot;
  else root.Bot=Bot;

})(typeof window!=='undefined'?window:global);
