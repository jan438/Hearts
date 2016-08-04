'use strict';
function playai2card(card) {
//	console.log("Speler2play:" + speler2.cards.length + ":" + Hearts.cardstosymbols(speler2.cards) + " playedcards:" + playedcards);
	var playdelay = 1000;
	if (playedcards > 0 && playedcards !== 1 && playedcards !== 2 && playedcards !== 3) playdelay = 5000;
	for (var j = speler2.cards.length - 1; j >= 0; j--) {
		if (card === speler2.cards[j]) {
			endxposition = -100;
			endyposition = 0;
			speler2.cards[j].animateTo({
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
			speler2.cards[j].setSide("front");
		}
	}
	playedcards = playedcards + 1;
}
function selectai2cards() {
	var maximum = speler2.cards.length;
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
function selectai2acard() {
	var hand2 = Hearts.cardstosymbols(speler2.cards);
	var twoofclubs = hand2.indexOf("♣2");
	if (twoofclubs >= 0) {
		ronde.currentplayer = 2;
	}
}
function playoutGame(gameCopy, gameHand) {
	var totalpoints = 0;
	while (gameCopy.isGameValid()) {
		if (gameHand.length === 0) break;
		var firstSuit2 = speler2.getFirstSuit(gameCopy.currentRound);
		var range = speler2.getSuitRange(firstSuit2, gameHand);
		if (range[0] === -1 && range[1] === -1) {
			var index = Math.floor(Math.random() * gameHand.length);
			while (gameCopy.firstInRound() && !gameCopy.hasHeartsBroken && gameHand[index].suit === 3 && !Hearts.hasAllHearts(gameHand)) {
				index = Math.floor(Math.random() * gameHand.length);
			}
			var removedcard = gameHand.splice(index, 1);
			var points = gameCopy.advance(removedcard[0], gameHand, 2);
			totalpoints = totalpoints + points;
		}
		else {
			var index = Math.floor(Math.random() * (range[1] - range[0]))
			var removedcard = gameHand.splice(range[0] + index, 1);
			var points = gameCopy.advance(removedcard[0], gameHand, 2);
			totalpoints = totalpoints + points;
		}
//		console.log("isGameValid2: " + gameCopy.isGameValid() + " points: " + points);
	}
//	console.log("playoutGame: " + totalpoints);
	return totalpoints;
}
function selectai2card(mastercopy) {
	var maximum = speler2.cards.length;
	var bestIndex = 0;
	var aicardsplayed = mastercopy.cardsPlayed.allCards.slice();
	var aiinvertdeck = mastercopy.cardsPlayed.invertDeck.slice();
	var aicurrentround = mastercopy.currentRound.slice();
	var aiplayerscores = mastercopy.playerScores.slice();
	var hand2 = Hearts.cardstosymbols(speler2.cards);
	if (mastercopy.firstMove()) {
		var twoofclubs = hand2.indexOf("♣2");
		bestIndex = (twoofclubs / 2);
		ronde.twoClubsPlayed = true;
		return bestIndex;
	}
	var hasOtherCards = hand2.indexOf("♠") >= 0 || hand2.indexOf("♣") >= 0 || hand2.indexOf("♦") >= 0;
	var queenofspades = hand2.indexOf("♠V");
	if (currenthand === 0 && queenofspades > 0) {
		hand2 = hand2.substring(0, queenofspades) + hand2.substring(queenofspades + 2, hand2.length);
	}
	if (firstSuit === " ") {
		if (!ronde.hasHeartsBroken) {
			if (hasOtherCards) {
				var firstindex = hand2.indexOf("♥");
				var lastindex = hand2.lastIndexOf("♥");
				if (firstindex >= 0) {
					var temphand = hand2.substring(0, firstindex) + hand2.substring(lastindex + 2, hand2.length);
					firstSuit = temphand.charAt(Math.floor(Math.random() * temphand.length / 2) * 2);
				}
				else firstSuit = hand2.charAt(Math.floor(Math.random() * maximum) * 2);
			}
			else {
				firstSuit = "♥";
				ronde.hasHeartsBroken = true;
			}
		}
		else firstSuit = hand2.charAt(Math.floor(Math.random() * hand2.length / 2) * 2);
		var suitcount = 0;
		var hasallhearts = Hearts.hasAllHearts(speler1.cards);
		for (var j = speler1.cards.length - 1; j >= 0; j--) {
			if (speler1.cards[j].suit === suitsymbols.indexOf(firstSuit)) suitcount = suitcount + 1;
		}
		if (!hasallhearts) {
			if (suitcount > 0) {
				for (var j = speler1.cards.length - 1; j >= 0; j--) {
					strid = speler1.cards[j].$el.id;
					if (!(!ronde.hasHeartsBroken && speler1.cards[j].suit === 3) && (speler1.cards[j].suit === suitsymbols.indexOf(firstSuit))) $("#" + strid).addClass('movable');
				}
			}
			else {
				for (var j = speler1.cards.length - 1; j >= 0; j--) {
					strid = speler1.cards[j].$el.id;
					if (!(!ronde.hasHeartsBroken && speler1.cards[j].suit === 3)) $("#" + strid).addClass('movable');
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
	var startsuit = hand2.indexOf(firstSuit);
	var endsuit = hand2.lastIndexOf(firstSuit);
	speler2.playoutHand = speler2.cards.slice();
	var range;
	var lowestScore = 100;
	if (startsuit >= 0) {
		range = [startsuit/2, (endsuit + 2)/2];
		bestIndex = range[0];
		var rangecards = speler2.cards.slice(range[0], range[1]);
//		console.log("Cards2 in the suit:" + Hearts.cardstosymbols(rangecards));
		for (var i = 0; i < rangecards.length; i++) {
			var gameHand = speler2.cards.slice();
			if (mastercopy.firstInRound() && !mastercopy.hasHeartsBroken && gameHand[i].suit === 3)
				break;
			if (currenthand === 0 && gameHand[i].suit === 2 && gameHand[i].rank === 12)
				break;
			var gameCopy = new Hearts.state2(mastercopy);
			gameCopy.cardsPlayed.allCards = aicardsplayed;
			gameCopy.cardsPlayed.invertDeck = aiinvertdeck;
			gameCopy.currentRound = aicurrentround;
			gameCopy.playerScores = aiplayerscores;
			var removedcard = gameHand.splice(i, 1);
			var score = gameCopy.advance(removedcard[0], gameHand, 2);
			score = score + playoutGame(gameCopy, gameHand);
			if (score < lowestScore) {
				lowestScore = score;
				bestIndex = range[0] + i;
			}
		}
	}
	else {
		for (var i = 0; i <= speler2.playoutHand.length - 1; i++) {
			var gameHand = speler2.cards.slice();
			if (mastercopy.firstInRound() && !mastercopy.hasHeartsBroken && gameHand[i].suit === 3)
				break;
			if (currenthand === 0 && gameHand[i].suit === 2 && gameHand[i].rank === 12)
				break;
			var gameCopy = new Hearts.state2(mastercopy);
			gameCopy.cardsPlayed.allCards = aicardsplayed;
			gameCopy.cardsPlayed.invertDeck = aiinvertdeck;
			gameCopy.currentRound = aicurrentround;
			gameCopy.playerScores = aiplayerscores;
			var removedcard = gameHand.splice(i, 1);
			var score = gameCopy.advance(removedcard[0], gameHand, 2);
			score = score + playoutGame(gameCopy, gameHand);
			if (score < lowestScore) {
				lowestScore = score;
				bestIndex = i;
			}
		}
	}
//	console.log("Speler2select:" + firstSuit + " current hand:" + currenthand + " bestIndex:" + bestIndex + Hearts.cardtosymbols(speler2.cards[bestIndex]));
	return bestIndex;
}
