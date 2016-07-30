'use strict';
const noIterations = 26;
const expansionDepth = 3;
function playai4card(card) {
//	console.log("Speler4play:" + speler4.cards.length + ":" + Hearts.cardstosymbols(speler4.cards) + " playedcards:" + playedcards);
	var playdelay = 1000;
	if (playedcards > 0 && playedcards !== 1 && playedcards !== 2 && playedcards !== 3) playdelay = 5000;
	for (var j = speler4.cards.length - 1; j >= 0; j--) {
		if (card === speler4.cards[j]) {
			endxposition = 100;
			endyposition = 0;
			speler4.cards[j].animateTo({
				delay: playdelay,
				duration: 250,
				x: endxposition,
				y: endyposition,
				rot: 0,
				onStart: function onStart() {
				},
				onComplete: function onComplete() {
				}
			});
			speler4.cards[j].setSide("front");
		}
	}
	playedcards = playedcards + 1;
}
function selectai4cards() {
	var maximum = speler4.cards.length;
	if (maxcardstoselect === 3) {
		var result1;
		var result2;
		var result3;
		do {
			result1 = Math.floor(Math.random() * maximum);
			result2 = Math.floor(Math.random() * maximum);
			result3 = Math.floor(Math.random() * maximum);
		}
		while ((result1 === result2) || (result2 === result3) || (result1 === result3));
		return [result1,result2,result3];
	}
}
function selectai4acard() {
	var hand4 = Hearts.cardstosymbols(speler4.cards);
	var twoofclubs = hand4.indexOf("♣2");
	if (twoofclubs >= 0) {
		ronde.currentplayer = 4;
	}
}
function Node(state, hand, par) {
	this.state = state;
	this.currentHand = hand;
	this.bestReward = 0;
	this.visitCount = 0;
	this.parent = par;
	this.children = new Array(hand.length).fill(null);
	if (par != null)
		this.depth = par.depth + 1;
	else
		this.depth = 0;
}
function runMCTS(origState) {
	var origState2 = origState;
	var aiallplayed = origState.cardsPlayed.allCards.slice();
	var aiallinvert = origState.cardsPlayed.invertDeck.slice();
	var aicurrentround = origState.currentRound.slice();
	var aiplayerscores = origState.playerScores.slice();
	var root = new Node(origState, speler4.playoutHand, null);
	for (var i = 0; i < noIterations; i++) {
		root.state = origState2;
		root.state.cardsPlayed.allCards = aiallplayed.slice();
		root.state.cardsPlayed.invertDeck = aiallinvert.slice();
		root.state.currentRound = aicurrentround.slice();
		root.state.playerScores = aiplayerscores.slice();
		var expanded = treePolicy(root);
//		console.log("iteration: " + i + " length:" + expanded.state.currentRound.length + " " + Hearts.cardstosymbols(expanded.currentHand));
		var valueChange = assignReward(expanded);
		backProp(expanded, valueChange);
	}
	return bestRewardChild(root);
}
function treePolicy(roNode) {
	var thisNode = roNode;
	thisNode.currentHand = speler4.playoutHand.slice();
	while (thisNode.state.isGameValid() && expansionDepth > thisNode.depth && thisNode.currentHand.length > 0) {
		var firstSuit2 = speler4.getFirstSuit(thisNode.state.currentRound); 
		var range = speler4.getSuitRange(firstSuit2, thisNode.currentHand);
		var firstIndex = range[0];
		var lastIndex = range[1];
		if (firstSuit2 === " ") {
			if (thisNode.state.hasHeartsBroken || Hearts.hasAllHearts(thisNode.currentHand)) {
				firstIndex = 0;
				lastIndex = thisNode.currentHand.length;
			}
			else {
				var heartsRange = speler4.getSuitRange("♥", thisNode.currentHand);
				if (heartsRange[0] === -1) {
					firstIndex = 0;
					lastIndex = thisNode.currentHand.length;
				}
				else {
					var starthand = thisNode.currentHand.slice(0, heartsRange[0]);
					var endhand = thisNode.currentHand.slice(heartsRange[1], thisNode.currentHand.length);
					thisNode.currentHand = starthand.concat(endhand);
					firstIndex = 0;
					lastIndex = thisNode.currentHand.length;
//					lastIndex = heartsRange[0];
				}
			}
		}
		else if (firstIndex === -1) {
			firstIndex = 0;
			lastIndex = thisNode.currentHand.length;
		}
		for (var i = firstIndex; i < lastIndex; i++) {
			if (thisNode.children[i] === null) {
				return expandTree(thisNode, i);
			}
		}
		thisNode = bestChild(thisNode, 0.1);
	}
	return thisNode;
}
function expandTree(roNode, childNo) {
	var childState = new Hearts.state2(roNode.state);
	var childHand = roNode.currentHand.slice();
	var removedcard = childHand.splice(childNo, 1);
	var debug = childState.advance(removedcard[0], childHand, 4);
	if (debug === -1) {
		console.log("Error, we've made a mistake.");
	}
	var childNode = new Node(childState, childHand, roNode);
	roNode.children[childNo] = childNode;
	return roNode.children[childNo];
}
function bestChild(someNode, weight) {
	var bestindex = 0;
	var bestValue = -Number.MAX_VALUE;
	var totalVisits = someNode.visitCount;
	for (var i = 0; i < someNode.children.length; i++) {
		if (someNode.children[i] !== null) {
			var child = someNode.children[i];
			var reward = child.bestReward;
			var childVisits = child.visitCount;
			var thisValue = (reward)/(childVisits) + weight * Math.sqrt((2*Math.log(totalVisits))/childVisits);
			if (thisValue > bestValue) {
				bestValue = thisValue;
				bestindex = i;
			}
		}
	}
	return someNode.children[bestindex];
}
function assignReward(baseNode) {
	var finalState = new Hearts.state2(baseNode.state);
	var finalHand = baseNode.currentHand.slice();
	while (finalState.isGameValid() && finalHand.length > 0) {
		var firstSuit2 = speler4.getFirstSuit(finalState.currentRound);
		var range = speler4.getSuitRange(firstSuit2, finalHand);
		if (firstSuit2 === " ") {
			var debug = -1;
			while (debug === -1 && finalHand.length > 0) {
				var index = Math.floor(Math.random() * finalHand.length);
				var playCard = finalHand.splice(index, 1);
				debug = finalState.advance(playCard[0], finalHand, 4);
				if (debug === -1) {
					finalHand.push(playCard[0]);
					Hearts.sorthand(finalHand);
				}
			}
		}
		else {
			if (range[0] === -1) {
				var index = Math.floor(Math.random() * finalHand.length);
				var removedcard = finalHand.splice(index, 1);
				finalState.advance(removedcard[0], finalHand, 4);
			} else {
				var index = range[0] + Math.floor(Math.random() * (range[1] - range[0]));
				var removedcard = finalHand.splice(index, 1);
				finalState.advance(removedcard[0], finalHand, 4);
			}
		}
	}
	var points = finalState.getScore();
	var score = 26 - points;
	return score;
}
function backProp(baseNode, value) {
	var no = baseNode;
	while (no !== null) {
		no.visitCount = no.visitCount + 1;
		no.bestReward = no.bestReward + value;
		no = no.parent;
	}
}
function bestRewardChild(roNode) {
	var highestReward = -999999;
	var bestChildNo = 0;
	for (var i = 0; i < roNode.children.length; i++) {
		if (roNode.children[i] != null) {
			if (roNode.children[i].bestReward > highestReward) {
				highestReward = roNode.children[i].bestReward;
				bestChildNo = i;
			}
		}
	}
	return bestChildNo;
}
function selectai4card(mastercopy) {
	var bestIndex = 0;
	var hand4 = Hearts.cardstosymbols(speler4.cards);
	if (mastercopy.firstMove()) {
		var twoofclubs = hand4.indexOf("♣2");
		bestIndex = (twoofclubs / 2);
		ronde.twoClubsPlayed = true;
		return bestIndex;
	}
	var queenofspades = hand4.indexOf("♠V");
	var hasOtherCards = hand4.indexOf("♠") >= 0 || hand4.indexOf("♣") >= 0 || hand4.indexOf("♦") >= 0;
	if (currenthand === 0 && queenofspades > 0) {
		hand4 = hand4.substring(0, queenofspades) + hand4.substring(queenofspades + 2, hand4.length);
	}
	speler4.playoutHand = speler4.cards.slice();
	bestIndex = runMCTS(mastercopy);
	if (mastercopy.currentRound.length === 0 && !(currenthand === 0)) {
		firstSuit = suitsymbols[speler4.cards[bestIndex].suit];
		var suitcount = 0;
		var hasallhearts = Hearts.hasAllHearts(speler1.cards);
		for (var j = speler1.cards.length - 1; j >= 0; j--) {
			if (speler1.cards[j].suit === suitsymbols.indexOf(firstSuit)) suitcount = suitcount + 1;
		}
		if (!hasallhearts) {
			if (suitcount > 0) {
				for (var j = speler1.cards.length - 1; j >= 0; j--) {
					strid = speler1.cards[j].$el.id;
					if (!(!ronde.hasHeartsBroken && speler1.cards[j].suit === 1) && (speler1.cards[j].suit === suitsymbols.indexOf(firstSuit))) $("#" + strid).addClass('movable');
				}
			}
			else {
				for (var j = speler1.cards.length - 1; j >= 0; j--) {
					strid = speler1.cards[j].$el.id;
					if (!(!ronde.hasHeartsBroken && speler1.cards[j].suit === 1)) $("#" + strid).addClass('movable');
				}
			}
		}
		else {
			for (var j = speler1.cards.length - 1; j >= 0; j--) {
				strid = speler1.cards[j].$el.id;
				$("#" + strid).addClass('movable');
			}
		}
	}
//	console.log("Speler4select:" + firstSuit + " current hand:" + currenthand + " bestIndex:" + bestIndex + Hearts.cardtosymbols(speler4.cards[bestIndex]));
	return bestIndex;
}
