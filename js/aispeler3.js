'use strict';
function playai3card(card) {
//	console.log("Speler3play:" + speler3.cards.length + ":" + Hearts.cardstosymbols(speler3.cards) + " playedcards:" + playedcards);
	var playdelay = 1000;
	if (playedcards > 0 && playedcards !== 1 && playedcards !== 2 && playedcards !== 3) playdelay = 5000;
	for (var j = speler3.cards.length - 1; j >= 0; j--) {
		if (card === speler3.cards[j]) {
			endxposition = 0;
			endyposition = -100;
			speler3.cards[j].animateTo({
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
			speler3.cards[j].setSide("front");
		}
	}
	playedcards = playedcards + 1;
}
function selectai3cards() {
	var maximum = speler3.cards.length;
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
function selectai3acard() {
	var hand3 = Hearts.cardstosymbols(speler3.cards);
	var twoofclubs = hand3.indexOf("♣2");
	if (twoofclubs >= 0) {
		ronde.currentplayer = 3;
	}
}
function selectai3card(mastercopy) {
	var maximum = speler3.cards.length;
	var bestIndex = 0;
	var hand3 = Hearts.cardstosymbols(speler3.cards);
	if (mastercopy.firstMove()) {
		var twoofclubs = hand3.indexOf("♣2");
		bestIndex = (twoofclubs / 2);
		ronde.twoClubsPlayed = true;
		return bestIndex;
	}
	var hasOtherCards = hand3.indexOf("♠") >= 0 || hand3.indexOf("♣") >= 0 || hand3.indexOf("♦") >= 0;
	var onlyhearts = (hand3.indexOf("♥") === 0) && (hand3.lastIndexOf("♥") === hand3.length - 2);
	var queenofspades = hand3.indexOf("♠V");
	if (firstSuit === " ") {
		if (!ronde.hasHeartsBroken) {
			if (hasOtherCards) {
				var firstindex = hand3.indexOf("♥");
				var lastindex = hand3.lastIndexOf("♥");
				if (firstindex >= 0) {
					var temphand = hand3.substring(0, firstindex) + hand3.substring(lastindex + 2, hand3.length);
					firstSuit = temphand.charAt(Math.floor(Math.random() * temphand.length / 2) * 2);
				}
				else firstSuit = hand3.charAt(Math.floor(Math.random() * maximum) * 2);
			}
			else {
				firstSuit = "♥";
				ronde.hasHeartsBroken = true;
			}
		}
		else firstSuit = hand3.charAt(Math.floor(Math.random() * hand3.length / 2) * 2);
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
	var startsuit = hand3.indexOf(firstSuit);
	var endsuit = hand3.lastIndexOf(firstSuit);
	if (startsuit >= 0) {
		var range = [startsuit/2, (endsuit + 2)/2];
		bestIndex = range[0] + Math.floor(Math.random() * (range[1] - range[0]));
	}
	else {
		if (currenthand === 0 && queenofspades > 0) {
			hand3 = hand3.substring(0, queenofspades) + hand3.substring(queenofspades + 2, hand3.length);
		}
		if (!ronde.hasHeartsBroken) {
			if (hasOtherCards) {
				var firstindex = hand3.indexOf("♥");
				var lastindex = hand3.lastIndexOf("♥");
				if (firstindex >= 0) {
					var temphand = hand3.substring(0, firstindex) + hand3.substring(lastindex + 2, hand3.length);
					var cardindex = Math.floor(Math.random() * temphand.length / 2) * 2;
					var cardsuit = temphand.charAt(cardindex);
					var cardrank = temphand.charAt(cardindex + 1);
					var card = "";
					var card = card.concat(cardsuit + cardrank);
					bestIndex = hand3.indexOf(card)/2;
				}
				else bestIndex = Math.floor(Math.random() * maximum);
			}
			else bestIndex = Math.floor(Math.random() * maximum);
		}
		else bestIndex = Math.floor(Math.random() * maximum);
	}
//	console.log("Speler3select:" + firstSuit + " current hand:" + currenthand + " bestIndex:" + bestIndex + " " + Hearts.cardtosymbols(speler3.cards[bestIndex]));
	return bestIndex;
}
