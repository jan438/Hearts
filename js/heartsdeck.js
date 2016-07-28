'use strict';
$.urlParam = function(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results == null) {
		return null;
	}
	else {
		return results[1] || 0;
	}
}
var Hearts = {};
var heartsdeck;
var ronde;
var longpress = false;
var validcard;
var maxcardstoselect;
var startTime, endTime;
var deltaxposition;
var deltayposition;
var indexposition;
var endxposition;
var endyposition;
var degrees;
var strid;
var nextplayer = 1;
var winnerplayer;
var currenthand = 0;
var sourceplayer;
var targetplayer;
var gameCopy;
var hand = new Array(4);
var handx = new Array(4);
var handy = new Array(4);
var playedcards;
handx[0] = -153;
handx[1] = -416;
handx[2] = -153;
handx[3] = 416;
handy[0] = 275;
handy[1] = -137;
handy[2] = -275;
handy[3] = -137;
var suitsymbols = "♠♥♣♦";
var othercards = "♠♣♦";
var ranksymbols = "234567890BVHA";
var firstSuit;
Hearts.cardstosymbols = function (cards) {
	var symbols = "";
	for (var i = 0, len = cards.length; i < len; i++) {
		var symbol1 = "";
		var symbol2 = "";
		switch (cards[i].suit) {
			case 0: symbol1 = "♠";
				break;
			case 1: symbol1 = "♥";
				break;
			case 2: symbol1 = "♣";
				break;
			case 3: symbol1 = "♦";
				break;
		}
		switch (cards[i].rank) {
			case 13:symbol2 = "H";
				break;
			case 12:symbol2 = "V";
				break;
			case 11:symbol2 = "B";
				break;
			case 10:symbol2 = "0";
				break;
			case 9: symbol2 = "9";
				break;
			case 8: symbol2 = "8";
				break;
			case 7: symbol2 = "7";
				break;
			case 6: symbol2 = "6";
				break;
			case 5: symbol2 = "5";
				break;
			case 4: symbol2 = "4";
				break;
			case 3: symbol2 = "3";
				break;
			case 2: symbol2 = "2";
				break;
			case 1: symbol2 = "A";
				break;
		}
		symbols = symbols + symbol1 + symbol2;
	}
	return symbols;
}
Hearts.cardtosymbols = function (card) {
	var symbols = "";
	var symbol1 = "";
	var symbol2 = "";
	switch (card.suit) {
		case 0: symbol1 = "♠";
			break;
		case 1: symbol1 = "♥";
			break;
		case 2: symbol1 = "♣";
			break;
		case 3: symbol1 = "♦";
			break;
	}
	switch (card.rank) {
		case 13:symbol2 = "H";
			break;
		case 12:symbol2 = "V";
			break;
		case 11:symbol2 = "B";
			break;
		case 10:symbol2 = "0";
			break;
		case 9: symbol2 = "9";
			break;
		case 8: symbol2 = "8";
			break;
		case 7: symbol2 = "7";
			break;
		case 6: symbol2 = "6";
			break;
		case 5: symbol2 = "5";
			break;
		case 4: symbol2 = "4";
			break;
		case 3: symbol2 = "3";
			break;
		case 2: symbol2 = "2";
			break;
		case 1: symbol2 = "A";
			break;
	}
	symbols = symbol1 + symbol2;
	return symbols;
}
Hearts.sorthand = function (cards) {
	var cardhand = Hearts.cardstosymbols(cards);
	var cardsymbols = [];
	var index;
	for (var i = 0; i < cards.length; i++) {
		index = i * 2;
		var symbols = cardhand.substring(index, index + 2);
		cardsymbols.push(symbols);
	}
	var tempcard;
	var tempsymbols;
	for (var i = cards.length - 1; i >= 1; --i) {
		for (var j = 0; j < i; ++j) {
			if (Hearts.comparecards(cardsymbols[j], cardsymbols[j + 1])) {
				tempcard = cards[j];
				cards[j] = cards[j + 1];
				cards[j + 1] = tempcard;
				tempsymbols = cardsymbols[j];
				cardsymbols[j] = cardsymbols[j + 1];
				cardsymbols[j + 1] = tempsymbols;
			}
		}
	}
}
Hearts.comparecards = function (card1, card2) {
	var suit1;
	var suit2;
	for (var i = 0; i < 4; i++) {
		if (card1[0] === suitsymbols.charAt(i)) {
			suit1 = i;
			break;
		}
	}
	for (var i = 0; i < 4; i++) {
		if (card2[0] === suitsymbols.charAt(i)) {
			suit2 = i;
			break;
		}
	}
	var rank1;
	var rank2;
	for (var i = 0; i < 13; i++) {
		if (card1[1] === ranksymbols.charAt(i)) {
			rank1 = i;
			break;
		}
	}
	for (var i = 0; i < 13; i++) {
		if (card2[1] === ranksymbols.charAt(i)) {
			rank2 = i;
			break;
		}
	}
	var result;
	if (suit1 === suit2) {
		result = rank1 > rank2;
	}
	else {
		result = suit1 > suit2;
	}
	return result;
}
Hearts.speler = function (index, name, cards, state) {
	this.index = index;
	this.name = name;
	this.cards = cards;
	this.selectedcards = [];
	this.selectedcard = null;
	this.state = state;
	this.score = 0;
	this.totalscore = 0;
	this.stub = false;
}
Hearts.speler_stub = function (index, name, cards, state) {
	if (($.urlParam('stubmode') != null) && $.urlParam('stubmode')) {
		console.log("Hearts_stub call count: " + stub.callCount);
	}
	else {
		stub.restore();
	}
	this.index = index;
	this.name = name;
	this.cards = cards;
	this.selectedcards = [];
	this.selectedcard = null;
	this.state = state;
	this.score = 0;
	this.totalscore = 0;
	this.stub = true;
}
var stub = sinon.stub(Hearts, "speler", Hearts.speler_stub);
Hearts.spelerai = function (index, name, cards, state, strategy) {
	Hearts.speler.call(this, index, name, cards, state);
	this.strategy = strategy;
	this.playoutHand = [];
	this.rng = Math.random();
	this.getFirstSuit = function(currentRound) {
		if (currentRound.length === 0)	return " ";
		return suitsymbols[currentRound[0].suit];
	}
	this.getSuitRange = function(firstSuit2, gameHand) {
		var range = [-1, -1];
		if (firstSuit2 === " ")	return range;
		for (var i = 0; i < gameHand.length; i++) {
			if (range[0] === -1 && suitsymbols[gameHand[i].suit] === firstSuit2) range[0] = i;
			if (range[0] !== -1 && suitsymbols[gameHand[i].suit] !== firstSuit2) {
				range[1] = i;
				break;
			}
		}
		if (range[0] !== -1 && range[1] === -1) range[1] = gameHand.length;
//		console.log("Range" + firstSuit2 + "speler" + this.index + ":" + Hearts.cardstosymbols(gameHand) + ":" + range[0] + "-" + range[1]);
		return [range[0],range[1]];
	}
}
var speler1 = new Hearts.speler(1, "Jan1", [], 0);
var speler2 = new Hearts.spelerai(2, "Jan2", [], 0, "LookAhead");
var speler3 = new Hearts.spelerai(3, "Jan3", [], 0, "RandomPlay");
var speler4 = new Hearts.spelerai(4, "Jan4", [], 0, "MCTS");
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
var fulldeck = [];
Hearts.deck = function (deck) {
	this.allCards = deck.slice();
	this.invertDeck = fulldeck.diff(this.allCards);
	this.restockDeck = function(returned) {
		this.allCards.push(returned);
		for (var i = 0; i < this.invertDeck.length; i++) {
			if (this.invertDeck[i] === returned) {
				this.invertDeck.splice(i,1);
				break;
			}
		}
	}
	this.size = function() {
		return allCards.length;
	}
	this.checkDeck = function() {
		if (this.allCards.length === 52 && this.invertDeck.length === 0) return true;
		return false;
	}
}
Hearts.state1 = function (deck, cardsPlayed, playerScores, hasHeartsBroken, index, name) {
	this.cardsPlayed = new Hearts.deck(deck);
	this.currentRound = cardsPlayed.slice();
	this.playerScores = playerScores.slice();
	this.hasHeartsBroken = hasHeartsBroken;
	this.playerIndex = index;
	this.playerName = name;
	this.isGameValid = function() {
		var valid = true;
		if (this.cardsPlayed.allCards.length >= 52) {
			valid = false;
		}
		return valid;
	}
	this.firstMove = function() {
		return this.cardsPlayed.allCards.length === 0;
	}
	this.firstInRound = function() {
		return this.currentRound.length === 0;
	}
	this.validRound = function() {
		return this.currentRound.length < 4;
	}
}
Hearts.state2 = function (secondCopy) {
	this.cardsPlayed = secondCopy.cardsPlayed;
	this.currentRound = secondCopy.currentRound;
	this.playerScores = secondCopy.playerScores;
	this.hasHeartsBroken = secondCopy.hasHeartsBroken;
	this.playerIndex = secondCopy.playerIndex;
	this.playerName = secondCopy.playerName;
	this.advance = function(removedcard, playoutHand, player) {
//		console.log("Adv2remplayerIndex:" + this.playerIndex + ":" + Hearts.cardtosymbols(removedcard) + "handspeler:" + player + ":" + Hearts.cardstosymbols(playoutHand) + "cardsplayed:" + this.cardsPlayed.allCards.length);
		if (!this.checkRound(removedcard, playoutHand))	{
			return -1;
		}
		var playTurn = this.currentRound.length;
		this.playCard(removedcard);
		while (this.validRound()) {
			var index = Math.floor(Math.random() * this.cardsPlayed.invertDeck.length);
			while (this.isInMyHand(this.cardsPlayed.invertDeck[index], playoutHand)) {
				index = Math.floor(Math.random() * this.cardsPlayed.invertDeck.length);
			}
			this.playCard(this.cardsPlayed.invertDeck[index]);
		}
		var firstPlayer = (this.playerIndex - playTurn + 4) % 4;
		var points = this.calculatePoints();
		var taker = this.findTaker(firstPlayer);
		this.playerScores[taker] = this.playerScores[taker] + points;
		var returnpoints = 0;
		if (taker === this.playerIndex) returnpoints = points;
		this.currentRound = [];
		if (this.isGameValid()) {
			while (taker !== this.playerIndex) {
			var index = Math.floor(Math.random() * this.cardsPlayed.invertDeck.length);
				while (this.isInMyHand(this.cardsPlayed.invertDeck[index], playoutHand)) {
					var index = Math.floor(Math.random() * this.cardsPlayed.invertDeck.length);
				}
				this.playCard(this.cardsPlayed.invertDeck[index]);
				taker = (taker + 1) % 4;
			}
		}
		return returnpoints;
	}
	this.isGameValid = function() {
		var valid = true;
		if (this.cardsPlayed.allCards.length >= 52) {
			valid = false;
		}
		return valid;
	}
	this.firstMove = function() {
		return this.cardsPlayed.allCards.length === 0;
	}
	this.hasAllHearts = function(hand) {
		var flag = true;
		for (var i = 0; i < hand.length; i++) {
			if (hand[i].suit !== 1) {
				flag = false;
				break;
			}
		}
		return flag;
	}
	this.checkRound = function(card, playoutHand) {
		if (this.firstMove() && !Hearts.cardtosymbols(card) === "♣2") {
			console.log("Simulation issue: Must play two of clubs to start the game.");
			return false;
		}
		if (this.firstInRound()) {
			if (card.suit === 1 && !this.hasHeartsBroken && !this.hasAllHearts(playoutHand)) {
				return false;
			}
			return true;
		} else {
			var firstSuit2 = this.currentRound[0].suit;
			if (firstSuit2 !== card.suit) {
				var flag = false;
				for (var i = 0; i < playoutHand.length; i++) {
					if (playoutHand[i].suit === firstSuit2) {
						flag = true;
					}
					break;
				}
				if (flag) {
					return false;
				}
			}
			if (card.suit === 1) {
				this.hasHeartsBroken = true;
			}
		}
		return true;
	}
	this.firstInRound = function() {
		return this.currentRound.length === 0;
	}
	this.getScore = function() {
		var index = this.playerIndex;
		var name = this.playerName;
		return this.playerScores[index];
	}
	this.playCard = function(card) {
		for (var j = 0; j < this.cardsPlayed.invertDeck.length; j++) {
			if (this.cardsPlayed.invertDeck[j] === card) {
				this.cardsPlayed.allCards.push(card);
				this.cardsPlayed.invertDeck.splice(j,1);
				this.currentRound.push(card);
				break;
			}
		}
	}
	this.validRound = function() {
		return this.currentRound.length < 4;
	}
	this.isInMyHand = function(card, playoutHand) {
		for (var i = 0; i < playoutHand.length; i++) {
			if (card === playoutHand[i]) return true;
		}
		return false;
	}
	this.calculatePoints = function() {
		var points = 0;
		for (var i = 0; i < this.currentRound.length; i++) {
			var card = this.currentRound[i];
			if (card.suit === 1) points = points + 1;
			if (card.rank === 12 && card.suit === 0) points = points + 13;
		}
		return points;
	}
	this.findTaker = function(firstPlayer) {
		var firstcard = this.currentRound[0];
		var firstSuit2 = firstcard.suit;
		var largestValue = firstcard.rank;
		var taker = firstPlayer;
		for (var i = 0; i < this.currentRound.length; i++) {
			var card = this.currentRound[i];
			var index = (firstPlayer + i) % 4;
			if (card.suit === firstSuit2) {
				if ((largestValue - card.rank) < 0) {
					taker = index;
					largestValue = card.rank;
				}
			}
		}
		return taker % 4;
	}
}
Hearts.hasAllHearts = function (hand) {
	var flag = true;
	for (var i = 0; i < hand.length; i++) {
		if (hand[i].suit !== 1) {
			flag = false;
			break;
		}
	}
	return flag;
}
Hearts.game = function (deck, speler1, speler2, speler3, speler4) {
	this.playerOrder = [];
	this.playerOrder.push(speler1);
	$("#name1").html(speler1.name);
	this.playerOrder.push(speler4);
	$("#name4").html(speler4.name);
	this.playerOrder.push(speler3);
	$("#name3").html(speler3.name);
	this.playerOrder.push(speler2);
	$("#name2").html(speler2.name);
	this.firstPlayer = 0;
	this.cardsPlayed = deck;
	this.currentRound = [];
	this.twoClubsPlayed = false;
	this.hasHeartsBroken = false;
	this.playerScores = [];
	this.isGameValid = function() {
		return this.cardsPlayed.length < 52;
	}
	this.playNewGame = function() {
		this.initNewGame();
	}
	this.playNewCard = function() {
		console.log("Currentplayer: " + ronde.currentplayer + " name: " + ronde.playerOrder[ronde.currentplayer-1].name);
		gameCopy = new Hearts.state1(this.cardsPlayed, this.currentRound, this.playerScores, this.hasHeartsBroken, ronde.currentplayer, ronde.playerOrder[ronde.currentplayer-1].name);
	}
	this.initNewGame = function() {
		this.cardsPlayed.invertDeck = fulldeck.slice();
		this.cardsPlayed.allCards = [];
	}
	this.determineCurrentPlayer = function() {
		if (currenthand === 0) {
			ronde.currentplayer = -1;
			select1card();
			if (ronde.currentplayer === -1) selectai2acard();
			if (ronde.currentplayer === -1) selectai3acard();
			if (ronde.currentplayer === -1) selectai4acard();
		}
		else {
			ronde.currentplayer = winnerplayer;
			if (ronde.currentplayer === 1) nextplayer = 1;
			else nextplayer = -1;
		}
		ronde.playerScores = new Array(speler1.score, speler2.score, speler3.score, speler4.score);
//		console.log("DetermineCurrentPlayer:" + ronde.currentplayer);
		var triggertimeout = 5000;
		if (currenthand === 13) {
			ronde.currentplayer = -1;
			if (speler1.score === 26) {
				speler1.score = 0;
				speler2.score = 26;
				speler3.score = 26;
				speler4.score = 26;
			}
			else if (speler2.score === 26) {
				speler2.score = 0;
				speler1.score = 26;
				speler3.score = 26;
				speler4.score = 26;
			}
			else if (speler3.score === 26) {
				speler3.score = 0;
				speler2.score = 26;
				speler1.score = 26;
				speler4.score = 26;
			}
			else if (speler4.score === 26) {
				speler4.score = 0;
				speler2.score = 26;
				speler3.score = 26;
				speler1.score = 26;
			}
			speler1.totalscore = speler1.totalscore + speler1.score;
			speler2.totalscore = speler2.totalscore + speler2.score;
			speler3.totalscore = speler3.totalscore + speler3.score;
			speler4.totalscore = speler4.totalscore + speler4.score;
			speler1.score = 0;
			speler2.score = 0;
			speler3.score = 0;
			speler4.score = 0;
			$("#score1").html(speler1.totalscore);
			$("#score2").html(speler2.totalscore);
			$("#score3").html(speler3.totalscore);
			$("#score4").html(speler4.totalscore);
			$("#heartsbutton").prop('disabled', false);
			setTimeout(function () { $("#heartsbutton").trigger('click'); }, triggertimeout);
		}
		$(".name").css("background-color","chartreuse");
		$(".score").css("background-color","chartreuse");
		switch (ronde.currentplayer) {
			case 1:	$("td#name1.name").css("background-color","aqua");
				$("td#score1.score").css("background-color","aqua");
				break;
			case 2: $("td#name2.name").css("background-color","aqua");
				$("td#score2.score").css("background-color","aqua");
				if (speler2.state === 0) {
					setTimeout(function () { $("#btn_id2").trigger('click'); }, triggertimeout);
				}
				break;
			case 3:	$("td#name3.name").css("background-color","aqua");
				$("td#score3.score").css("background-color","aqua");
				if (speler3.state === 0) {
					setTimeout(function () { $("#btn_id3").trigger('click'); }, triggertimeout);
				}
				if (speler2.state === 0) {
					setTimeout(function () { $("#btn_id2").trigger('click'); }, triggertimeout);
				}
				break;
			case 4:	$("td#name4.name").css("background-color","aqua");
				$("td#score4.score").css("background-color","aqua");
				if (speler4.state === 0) {
					setTimeout(function () { $("#btn_id4").trigger('click'); }, triggertimeout);
				}
				if (speler3.state === 0) {
					setTimeout(function () { $("#btn_id3").trigger('click'); }, triggertimeout);
				}
				if (speler2.state === 0) {
					setTimeout(function () { $("#btn_id2").trigger('click'); }, triggertimeout);
				}
				break;
		}
	}
	this.gameCopy = function(index) {
		return new Hearts.state1(this.cardsPlayed, hand.cardsPlayed, this.playerScores, this.hasHeartsBroken, index, ronde.playerOrder[index].name);
	}
}
Hearts.determineWinnerPlayer = function () {
	var playedcards = new Array(speler1.selectedcard, speler2.selectedcard, speler3.selectedcard, speler4.selectedcard);
	var playedsymbols = Hearts.cardstosymbols(playedcards);
	var highestcard;
	var rank1 = speler1.selectedcard.rank;
	var rank2 = speler2.selectedcard.rank;
	var rank3 = speler3.selectedcard.rank;
	var rank4 = speler4.selectedcard.rank;
	if (rank1 === 1) rank1 = 14;
	if (rank2 === 1) rank2 = 14;
	if (rank3 === 1) rank3 = 14;
	if (rank4 === 1) rank4 = 14;
	var points = 0;
	if (speler1.selectedcard.suit === 1) points = points + 1;
	if (speler2.selectedcard.suit === 1) points = points + 1;
	if (speler3.selectedcard.suit === 1) points = points + 1;
	if (speler4.selectedcard.suit === 1) points = points + 1;
	if (speler1.selectedcard.suit === 0 && rank1 === 12) points = points + 13;
	if (speler2.selectedcard.suit === 0 && rank2 === 12) points = points + 13;
	if (speler3.selectedcard.suit === 0 && rank3 === 12) points = points + 13;
	if (speler4.selectedcard.suit === 0 && rank4 === 12) points = points + 13;
	switch (ronde.currentplayer) {
		case 1: highestcard = rank1;
			winnerplayer = 1;
			break;
		case 2: highestcard = rank2;
			winnerplayer = 2;
			break;
		case 3: highestcard = rank3;
			winnerplayer = 3;
			break;
		case 4: highestcard = rank4;
			winnerplayer = 4;
			break;
	}
	for (var i = 1; i < 5; i++) {
		if (i !== ronde.currentplayer) {
			if (playedsymbols.charAt((i - 1) * 2) === firstSuit) {
				switch (i) {
					case 1: if (rank1 > highestcard) {
							highestcard = rank1;
							winnerplayer = 1;
						}
						break;
					case 2: if (rank2 > highestcard) {
							highestcard = rank2;
							winnerplayer = 2;
						}
						break;
					case 3: if (rank3 > highestcard) {
							highestcard = rank3;
							winnerplayer = 3;
						}
						break;
					case 4: if (rank4 > highestcard) {
							highestcard = rank4;
							winnerplayer = 4;
						}
						break;
				}
			}
		}
	}
	for (var j = speler1.cards.length - 1; j >= 0; j--) {
		strid = speler1.cards[j].$el.id;
		$("#" + strid).removeClass('movable');
	}
	switch (winnerplayer) {
		case 1: endxposition = handx[0] + 17 * 27;
			endyposition = handy[0];
			speler1.score = speler1.score + points;
			$("#score1").html(speler1.totalscore + "+" + speler1.score);
			var hasallhearts = Hearts.hasAllHearts(speler1.cards);
			if (!hasallhearts) {
				for (var j = speler1.cards.length - 1; j >= 0; j--) {
					strid = speler1.cards[j].$el.id;
					if (!(!ronde.hasHeartsBroken && speler1.cards[j].suit === 1)) $("#" + strid).addClass('movable');
				}
			}
			else {
				for (var j = speler1.cards.length - 1; j >= 0; j--) {
					strid = speler1.cards[j].$el.id;
					$("#" + strid).addClass('movable');
				}
			}
			break;
		case 2: endxposition = handx[1];
			endyposition = handy[1] + 17 * 27;
			speler2.score = speler2.score + points;
			$("#score2").html(speler2.totalscore + "+" + speler2.score);
			break;
		case 3: endxposition = handx[2] + 17 * 27;
			endyposition = handy[2];
			speler3.score = speler3.score + points;
			$("#score3").html(speler3.totalscore + "+" + speler3.score);
			break;
		case 4: endxposition = handx[3];
			endyposition = handy[3] + 17 * 27;
			speler4.score = speler4.score + points;
			$("#score4").html(speler4.totalscore + "+" + speler4.score);
			break;
	}
	speler1.selectedcard.animateTo({
		delay: 5000,
		duration: 250,
		x: endxposition,
		y: endyposition,
		rot: 0,
		onStart: function onStart() {
		},
		onComplete: function onComplete() {
			speler2.selectedcard.animateTo({
				delay: 1000,
				duration: 250,
				x: endxposition,
				y: endyposition,
				rot: 0,
				onStart: function onStart() {
				},
				onComplete: function onComplete() {
					speler3.selectedcard.animateTo({
						delay: 1000,
						duration: 250,
						x: endxposition,
						y: endyposition,
						rot: 0,
						onStart: function onStart() {
						},
						onComplete: function onComplete() {
							speler4.selectedcard.animateTo({
								delay: 1000,
								duration: 250,
								x: endxposition,
								y: endyposition,
								rot: 0,
								onStart: function onStart() {
								},
								onComplete: function onComplete() {
									for (var j = speler1.cards.length - 1; j >= 0; j--) {
										if (typeof speler1.cards[j] !== 'undefined') {
											if (speler1.selectedcard.$el.id === speler1.cards[j].$el.id) {
												speler1.cards[j].setSide("back");
												speler1.cards.splice(j, 1);

												break;
											}
										}
									}
									for (var j = speler2.cards.length - 1; j >= 0; j--) {
										if (typeof speler2.cards[j] !== 'undefined') {
											if (speler2.selectedcard.$el.id === speler2.cards[j].$el.id) {
												speler2.cards[j].setSide("back");
												speler2.cards.splice(j, 1);
												break;
											}
										}
									}
									for (var j = speler3.cards.length - 1; j >= 0; j--) {
										if (typeof speler3.cards[j] !== 'undefined') {
											if (speler3.selectedcard.$el.id === speler3.cards[j].$el.id) {
												speler3.cards[j].setSide("back");
												speler3.cards.splice(j, 1);
												break;
											}
										}
									}
									for (var j = speler4.cards.length - 1; j >= 0; j--) {
										if (typeof speler4.cards[j] !== 'undefined') {
											if (speler4.selectedcard.$el.id === speler4.cards[j].$el.id) {
												speler4.cards[j].setSide("back");
												speler4.cards.splice(j, 1);
												break;
											}
										}
									}
									Hearts.animateSortedCards(1);
									Hearts.animateSortedCards(2);
									Hearts.animateSortedCards(3);
									Hearts.animateSortedCards(4);
//									console.log("WinnerSpeler1:" + speler1.cards.length + ":" + Hearts.cardstosymbols(speler1.cards));
//									console.log("WinnerSpeler2:" + speler2.cards.length + ":" + Hearts.cardstosymbols(speler2.cards));
//									console.log("WinnerSpeler3:" + speler3.cards.length + ":" + Hearts.cardstosymbols(speler3.cards));
//									console.log("WinnerSpeler4:" + speler4.cards.length + ":" + Hearts.cardstosymbols(speler4.cards));
									speler1.selectedcards = [];
									speler2.selectedcards = [];
									speler3.selectedcards = [];
									speler4.selectedcards = [];
									speler1.selectedcard = null;
									speler2.selectedcard = null;
									speler3.selectedcard = null;
									speler4.selectedcard = null;
									firstSuit = " ";
									currenthand = currenthand + 1;
									$("#playcard_button").hide();
									ronde.determineCurrentPlayer();
								}
							});
						}
					});
				}
			});
		}
	});
}
Hearts.playCard = function (sourceplayer) {
	switch (sourceplayer) {
		case 1: play1card(speler1.selectedcard);
			hand.cardsPlayed.push(speler1.selectedcard);
			ronde.cardsPlayed.push(speler1.selectedcard);
			heartsdeck.restockDeck(speler1.selectedcard);
			break;
		case 2: playai2card(speler2.selectedcard);
			hand.cardsPlayed.push(speler2.selectedcard);
			ronde.cardsPlayed.push(speler2.selectedcard);
			heartsdeck.restockDeck(speler2.selectedcard);
			break;
		case 3: playai3card(speler3.selectedcard);
			hand.cardsPlayed.push(speler3.selectedcard);
			ronde.cardsPlayed.push(speler3.selectedcard);
			heartsdeck.restockDeck(speler3.selectedcard);
			break;
		case 4: playai4card(speler4.selectedcard);
			hand.cardsPlayed.push(speler4.selectedcard);
			ronde.cardsPlayed.push(speler4.selectedcard);
			heartsdeck.restockDeck(speler4.selectedcard);
			break;
	}
	if (playedcards === 4) {
		playedcards = 0;
		Hearts.determineWinnerPlayer();
		hand.cardsPlayed = [];
	}
}
Hearts.doAccept = function () {
//	console.log("Accept");
	for (var j = 12; j >= 0; j--) {
		strid = speler1.cards[j].$el.id;
		if ($("#" + strid).hasClass('selected')) {
			$("#" + strid).removeClass('selected');
			endxposition = hand[0][j][0];
			endyposition = hand[0][j][1];
			speler1.cards[j].animateTo({
				delay: 1000,
				duration: 250,
				x: endxposition,
				y: endyposition,
				rot: 0,
				onStart: function onStart() {
				},
				onComplete: function onComplete() {
				}
			});
		}
	}
	maxcardstoselect = 1;
	$("#accept_button").hide();
	ronde.playNewGame();
	ronde.determineCurrentPlayer();
	ronde.playNewCard();
}
Hearts.animateSortedCards = function (player) {
	switch (player) {
		case 1:	var animatedcount = 0;
			for (var j = speler1.cards.length - 1; j >= 0; j--) {
				strid = speler1.cards[j].$el.id;
				var $el = speler1.cards[j].$el;
				$el.style.zIndex = j;
				endxposition = hand[0][j][0];
				endyposition = hand[0][j][1];
				if ($("#" + strid).hasClass('selected')) {
					endyposition = endyposition - 20;
				}
				speler1.cards[j].animateTo({
					delay: 2500,
					duration: 250,
					x: endxposition,
					y: endyposition,
					rot: 0,
					onStart: function onStart() {
						$el.style.zIndex;
					},
					onComplete: function onComplete() {
						animatedcount = animatedcount + 1;
						if (maxcardstoselect === 3 && animatedcount === 3) $("#accept_button").show();
					}
				});
			}
			break;
		case 2:	for (var j = speler2.cards.length - 1; j >= 0; j--) {
				strid = speler2.cards[j].$el.id;
				var $el = speler2.cards[j].$el;
				$el.style.zIndex = 13 + j;
				endxposition = hand[1][j][0];
				endyposition = hand[1][j][1];
				speler2.cards[j].animateTo({
					delay: 2500,
					duration: 250,
					x: endxposition,
					y: endyposition,
					rot: 0,
					onStart: function onStart() {
						$el.style.zIndex;
					},
					onComplete: function onComplete() {
					}
				});
			}
			break;
		case 3:	for (var j = speler3.cards.length - 1; j >= 0; j--) {
				strid = speler3.cards[j].$el.id;
				var $el = speler3.cards[j].$el;
				$el.style.zIndex = 2 * 13 + j;
				endxposition = hand[2][j][0];
				endyposition = hand[2][j][1];
				speler3.cards[j].animateTo({
					delay: 2500,
					duration: 250,
					x: endxposition,
					y: endyposition,
					rot: 0,
					onStart: function onStart() {
						$el.style.zIndex;
					},
					onComplete: function onComplete() {
					}
				});
			}
			break;
		case 4:	for (var j = speler4.cards.length - 1; j >= 0; j--) {
				strid = speler4.cards[j].$el.id;
				var $el = speler4.cards[j].$el;
				$el.style.zIndex = 3 * 13 + j;
				endxposition = hand[3][j][0];
				endyposition = hand[3][j][1];
				speler4.cards[j].animateTo({
					delay: 2500,
					duration: 250,
					x: endxposition,
					y: endyposition,
					rot: 0,
					onStart: function onStart() {
						$el.style.zIndex;
					},
					onComplete: function onComplete() {
					}
				});
			}
			break;
		}
}
Hearts.selectCards = function (player) {
	var result = [];
	switch (player) {
		case 2: result = selectai2cards();
			break;
		case 3: result = selectai3cards();
			break;
		case 4: result = selectai4cards();
			break;
	}
	return result;
}
Hearts.doPass = function (sourceplayer, targetplayer) {
	if (($.urlParam('stubmode') != null) && $.urlParam('stubmode')) {
		$("#pass_button").hide();
		$("#accept_button").show();
		speler1.selectedcards = [];
		firstSuit = "♣";
		currenthand = 0;
		playedcards = 0;
	}
	else {
//		console.log("SourcePlayer:" + sourceplayer + " TargetPlayer:" + targetplayer);
		switch (targetplayer) {
			case 2:	var result = Hearts.selectCards(2);
				speler2.selectedcards = [];
				break;
			case 3:	var result = Hearts.selectCards(3);
				speler3.selectedcards = [];
				break;
			case 4:	var result = Hearts.selectCards(4);
				speler4.selectedcards = [];
				break;
		}
		switch (sourceplayer) {
			case 1:	if (speler1.selectedcards.length === 3) {
					for (var i = 2; i >= 0; i--) {
						var delay = i * 250;
						var tempvar = i / 13;
						deltaxposition = tempvar * 4;
						deltayposition = tempvar * 256;
						switch (targetplayer) {
							case 2: endxposition = speler2.cards[i].x;
								endyposition = speler2.cards[i].y;
								speler2.selectedcards.push(speler2.cards[result[i]]);
								break;
							case 3: endxposition = speler3.cards[i].x;
								endyposition = speler3.cards[i].y;
								speler3.selectedcards.push(speler3.cards[result[i]]);
								break;
							case 4: endxposition = speler4.cards[i].x;
								endyposition = speler4.cards[i].y;
								speler4.selectedcards.push(speler4.cards[result[i]]);
								break;
						}
						speler1.selectedcards[i].player = targetplayer;
						speler1.selectedcards[i].animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
						strid = speler1.selectedcards[i].$el.id;
						$("#" + strid).removeClass('selected');
						for (var j = 12; j >= 0; j--) {
							if (typeof speler1.cards[j] !== 'undefined') {
								if (strid === speler1.cards[j].$el.id) {
									switch (targetplayer) {
										case 2: if (!speler2.stub) speler1.cards[j].setSide("back");
											else speler1.cards[j].setSide("front");
												speler2.cards.push(speler1.cards[j]);
											break;
										case 3: if (!speler3.stub) speler1.cards[j].setSide("back");
											else speler1.cards[j].setSide("front");
											speler3.cards.push(speler1.cards[j]);
											break;
										case 4: if (!speler4.stub) speler1.cards[j].setSide("back");
											else speler1.cards[j].setSide("front");
											speler4.cards.push(speler1.cards[j]);
											break;
									}
									speler1.cards.splice(j, 1);
									break;
								}
							}
						}
					}
					speler1.selectedcards = [];
					sourceplayer = targetplayer;
					targetplayer = 3;
					Hearts.doPass(sourceplayer, targetplayer);
				}
				speler1.selectedcards = [];
				break;
			case 2:	if (speler2.selectedcards.length === 3) {
					for (var i = 2; i >= 0; i--) {
						var delay = i * 250;
						var tempvar = i / 13;
						deltaxposition = tempvar * 4;
						deltayposition = tempvar * 256;
						switch (targetplayer) {
							case 1: for (var j = 12; j >= 0; j--) {
									if (typeof speler1.cards[j] === 'undefined') {
										endxposition = hand[0][j][0];
										endyposition = hand[0][j][1];
										speler1.cards[j] = speler2.selectedcards[i];
										break;
									}
								}
								break;
							case 3: endxposition = speler3.cards[i].x;
								endyposition = speler3.cards[i].y;
								speler3.selectedcards.push(speler3.cards[result[i]]);
								break;
							case 4: endxposition = speler4.cards[i].x;
								endyposition = speler4.cards[i].y;
								speler4.selectedcards.push(speler4.cards[result[i]]);
								break;
						}
						speler2.selectedcards[i].player = targetplayer;
						speler2.selectedcards[i].animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
						strid = speler2.selectedcards[i].$el.id;
						for (var j = 12; j >= 0; j--) {
							if (typeof speler2.cards[j] !== 'undefined') {
								if (strid === speler2.cards[j].$el.id) {
									switch (targetplayer) {
										case 1: speler2.cards[j].setSide("front");
											break;
										case 3: if (!speler3.stub) speler2.cards[j].setSide("back");
											else speler2.cards[j].setSide("front");
											speler3.cards.push(speler2.cards[j]);
											break;
										case 4: if (!speler4.stub) speler2.cards[j].setSide("back");
											else speler2.cards[j].setSide("front");
											speler4.cards.push(speler2.cards[j]);
											break;
									}
									speler2.cards.splice(j, 1);
									break;
								}
							}
						}
					}
					speler2.selectedcards = [];
					Hearts.sorthand(speler2.cards);
					Hearts.animateSortedCards(2);
					switch (targetplayer) {
						case 1: strid = speler1.cards[10].$el.id;
							$("#" + strid).addClass('selected');
							strid = speler1.cards[11].$el.id;
							$("#" + strid).addClass('selected');
							strid = speler1.cards[12].$el.id;
							$("#" + strid).addClass('selected');
							Hearts.sorthand(speler1.cards);
							Hearts.animateSortedCards(1);
							$("#pass_button").hide();
							break;
						case 3: Hearts.sorthand(speler3.cards);
							break;
						case 4: Hearts.sorthand(speler4.cards);
							break;
					}
				}
				speler2.selectedcards = [];
				firstSuit = "♣";
				currenthand = 0;
				playedcards = 0;
				break;
			case 3:	if (speler3.selectedcards.length === 3) {
					for (var i = 2; i >= 0; i--) {
						var delay = i * 250;
						var tempvar = i / 13;
						deltaxposition = tempvar * 4;
						deltayposition = tempvar * 256;
						switch (targetplayer) {
							case 1: endxposition = speler1.cards[i].x;
								endyposition = speler1.cards[i].y;
								break;
							case 2: endxposition = speler2.cards[i].x;
								endyposition = speler2.cards[i].y;
								speler2.selectedcards.push(speler2.cards[result[i]]);
								break;
							case 4: endxposition = speler4.cards[i].x;
								endyposition = speler4.cards[i].y;
								speler4.selectedcards.push(speler4.cards[result[i]]);
								break;
						}
						speler3.selectedcards[i].player = targetplayer;
						speler3.selectedcards[i].animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
						strid = speler3.selectedcards[i].$el.id;
						for (var j = 12; j >= 0; j--) {
							if (typeof speler3.cards[j] !== 'undefined') {
								if (strid === speler3.cards[j].$el.id) {
									switch (targetplayer) {
										case 1: speler3.cards[j].setSide("front");
											speler1.cards.push(speler3.cards[j]);
											break;
										case 2: if (!speler2.stub) speler3.cards[j].setSide("back");
											else speler3.cards[j].setSide("front");
											speler2.cards.push(speler3.cards[j]);
											break;
										case 4: if (!speler4.stub) speler3.cards[j].setSide("back");
											else speler3.cards[j].setSide("front");
											speler4.cards.push(speler3.cards[j]);
											break;
									}
									speler3.cards.splice(j, 1);
									break;
								}
							}
						}
					}
					speler3.selectedcards = [];
					Hearts.sorthand(speler3.cards);
					Hearts.animateSortedCards(3);
					sourceplayer = targetplayer;
					targetplayer = 1;
					Hearts.doPass(sourceplayer, targetplayer);
				}
				speler3.selectedcards = [];
				break;
			case 4:	if (speler4.selectedcards.length === 3) {
					for (var i = 2; i >= 0; i--) {
						var delay = i * 250;
						var tempvar = i / 13;
						deltaxposition = tempvar * 4;
						deltayposition = tempvar * 256;
						switch (targetplayer) {
							case 1: endxposition = speler1.cards[i].x;
								endyposition = speler1.cards[i].y;
								break;
							case 2: endxposition = speler2.cards[i].x;
								endyposition = speler2.cards[i].y;
								speler2.selectedcards.push(speler2.cards[result[i]]);
								break;
							case 3: endxposition = speler3.cards[i].x;
								endyposition = speler3.cards[i].y;
								speler3.selectedcards.push(speler3.cards[result[i]]);
								break;
						}
						speler4.selectedcards[i].player = targetplayer;
						speler4.selectedcards[i].animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
						strid = speler4.selectedcards[i].$el.id;
						for (var j = 12; j >= 0; j--) {
							if (typeof speler4.cards[j] !== 'undefined') {
								if (strid === speler4.cards[j].$el.id) {
									switch (targetplayer) {
										case 1: speler4.cards[j].setSide("front");
											speler1.cards.push(speler4.cards[j]);
											break;
										case 2: if (!speler2.stub) speler4.cards[j].setSide("back");
											else speler4.cards[j].setSide("front");
											speler2.cards.push(speler4.cards[j]);
											break;
										case 3: if (!speler3.stub) speler4.cards[j].setSide("back");
											else speler4.cards[j].setSide("front");
											speler3.cards.push(speler4.cards[j]);
											break;
									}
									speler4.cards.splice(j, 1);
									break;
								}
							}
						}
					}
					speler4.selectedcards = [];
					Hearts.sorthand(speler4.cards);
					Hearts.animateSortedCards(4);
					sourceplayer = targetplayer;
					targetplayer = 2;
					Hearts.doPass(sourceplayer, targetplayer);
				}
				speler4.selectedcards = [];
				break;
		}
	}
}
var Deck = (function () {
  'use strict';
  var ticking;
  var animations = [];
  function animationFrames(delay, duration) {
    var now = Date.now();
    var start = now + delay;
    var end = start + duration;
    var animation = {
      start: start,
      end: end
    };
    animations.push(animation);
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
    var self = {
      start: function start(cb) {
        animation.startcb = cb;
        return self;
      },
      progress: function progress(cb) {
        animation.progresscb = cb;
        return self;
      },
      end: function end(cb) {
        animation.endcb = cb;
        return self;
      }
    };
    return self;
  }
  function tick() {
    var now = Date.now();
    if (!animations.length) {
      ticking = false;
      return;
    }
    for (var i = 0, animation; i < animations.length; i++) {
      animation = animations[i];
      if (now < animation.start) {
        continue;
      }
      if (!animation.started) {
        animation.started = true;
        animation.startcb && animation.startcb();
      }
      var t = (now - animation.start) / (animation.end - animation.start);
      animation.progresscb && animation.progresscb(t < 1 ? t : 1);
      if (now > animation.end) {
        animation.endcb && animation.endcb();
        animations.splice(i--, 1);
        continue;
      }
    }
    requestAnimationFrame(tick);
  }
  window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
    setTimeout(cb, 0);
  });
  var style = document.createElement('p').style;
  var memoized = {};
  function prefix(param) {
    if (typeof memoized[param] !== 'undefined') {
      return memoized[param];
    }
    if (typeof style[param] !== 'undefined') {
      memoized[param] = param;
      return param;
    }
    var camelCase = param[0].toUpperCase() + param.slice(1);
    var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
    var test;
    for (var i = 0, len = prefixes.length; i < len; i++) {
      test = prefixes[i] + camelCase;
      if (typeof style[test] !== 'undefined') {
        memoized[param] = test;
        return test;
      }
    }
  }
  var has3d;
  function translate(a, b, c) {
    typeof has3d !== 'undefined' || (has3d = check3d());
    c = c || 0;
    if (has3d) {
      return 'translate3d(' + a + ', ' + b + ', ' + c + ')';
    } else {
      return 'translate(' + a + ', ' + b + ')';
    }
  }
  function check3d() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      return false;
    }
    var transform = prefix('transform');
    var $p = document.createElement('p');
    document.body.appendChild($p);
    $p.style[transform] = 'translate3d(1px,1px,1px)';
    has3d = $p.style[transform];
    has3d = has3d != null && has3d.length && has3d !== 'none';
    document.body.removeChild($p);
    return has3d;
  }
  function createElement(type) {
    return document.createElement(type);
  }
  var maxZ = 52;
  function _card(i) {
    var transform = prefix('transform');
    var rank = i % 13 + 1;
    var suit = i / 13 | 0;
    var z = (52 - i) / 4;
    var $el = createElement('div');
	$el.id = 'card' + i;
    var $face = createElement('div');
    var $back = createElement('div');
    var isDraggable = false;
    var isFlippable = false;
    var self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide };
    var modules = Deck.modules;
    var module;
    $face.classList.add('face');
    $back.classList.add('back');
    $el.style[transform] = translate(-z + 'px', -z + 'px');
    self.x = -z;
    self.y = -z;
    self.z = z;
    self.rot = 0;
    self.setSide('back');
    addListener($el, 'mousedown', onMousedown);
    addListener($el, 'touchstart', onMousedown);
    for (module in modules) {
      addModule(modules[module]);
    }
    self.animateTo = function (params) {
      var delay = params.delay;
      var duration = params.duration;
      var _params$x = params.x;
      var x = _params$x === undefined ? self.x : _params$x;
      var _params$y = params.y;
      var y = _params$y === undefined ? self.y : _params$y;
      var _params$rot = params.rot;
      var rot = _params$rot === undefined ? self.rot : _params$rot;
      var ease$$ = params.ease;
      var onStart = params.onStart;
      var onProgress = params.onProgress;
      var onComplete = params.onComplete;
      var startX, startY, startRot;
      var diffX, diffY, diffRot;
      animationFrames(delay, duration).start(function () {
        startX = self.x || 0;
        startY = self.y || 0;
        startRot = self.rot || 0;
        onStart && onStart();
      }).progress(function (t) {
        var et = ease[ease$$ || 'cubicInOut'](t);
        diffX = x - startX;
        diffY = y - startY;
        diffRot = rot - startRot;
        onProgress && onProgress(t, et);
        self.x = startX + diffX * et;
        self.y = startY + diffY * et;
        self.rot = startRot + diffRot * et;
        $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '');
      }).end(function () {
        onComplete && onComplete();
      });
    };
    self.setRankSuit = function (rank, suit) {
      var suitName = SuitName(suit);
      $el.setAttribute('class', 'card ' + suitName + ' rank' + rank);
    };
    self.setRankSuit(rank, suit);
    self.enableDragging = function () {
      if (isDraggable) {
        return;
      }
      isDraggable = true;
      $el.style.cursor = 'move';
    };
    self.enableFlipping = function () {
      if (isFlippable) {
        return;
      }
      isFlippable = true;
    };
    self.disableFlipping = function () {
      if (!isFlippable) {
        return;
      }
      isFlippable = false;
    };
    self.disableDragging = function () {
      if (!isDraggable) {
        return;
      }
      isDraggable = false;
      $el.style.cursor = '';
    };
    return self;
    function addModule(module) {
      module.card && module.card(self);
    }
    function onMousedown(e) {
		startTime = new Date().getTime();
		var hand1 = Hearts.cardstosymbols(speler1.cards);
		if (nextplayer === 1) {
			if (self.player === 1 && self.rot === 0) {
				if (ronde.currentplayer === 1) firstSuit = " ";
				if ($("#" + $el.id).hasClass('selected')) {
					$("#" + $el.id).removeClass('selected');
					endxposition = self.x;
					endyposition = self.y + 20;
					self.animateTo({
						delay: 1000,
						duration: 250,
						x: endxposition,
						y: endyposition,
						rot: 0,
						onStart: function onStart() {
							self.$el.style.zIndex;
						},
						onComplete: function onComplete() {
						}
					});
					for (var i = 0; i < speler1.selectedcards.length; i++) {
						if (speler1.selectedcards[i].$el.id ===	$el.id) speler1.selectedcards.splice(i);
					}
					$("#pass_button").hide();
					$("#playcard_button").hide();
				}
				else {
					var onlyhearts = (hand1.indexOf("♥") === 0) && (hand1.lastIndexOf("♥") === hand1.length - 2);
					validcard = true;
					if (maxcardstoselect === 1) {
						for (var i = 0; i < speler1.cards.length; i++) {
							strid = speler1.cards[i].$el.id;
							if ($("#" + strid).hasClass('selected') && speler1.cards[i].$el.id !== $el.id) validcard = false;
						}
					}
					if (!ronde.twoClubsPlayed && currenthand === 0 && ronde.currentplayer === 1) {
						if (!(self.rank === 2 && self.suit === 2)) {
							swal({
								title: "<h4 id='swal2ofClubs'>You must play 2 of clubs!</h4>",
								imageUrl: "Cards.png",
								timer: 2000,
								showConfirmButton: false,
								html: true
							});
							validcard = false;
						}
					}
					var startsuit = hand1.indexOf(firstSuit);
					var indexsuit = suitsymbols.indexOf(firstSuit);
					if (validcard) {
						if (startsuit >= 0 && maxcardstoselect === 1) {
							if (self.suit !== indexsuit) {
								swal({
									title: "<h4 id='swalsamesuit'>You must play a card with a suit of the first card!</h4>",
									imageUrl: "Cards.png",
									timer: 2000,
									showConfirmButton: false,
									html: true
								});
								validcard = false;
							}
						}
						else {
							if (!ronde.hasHeartsBroken && maxcardstoselect === 1 && self.suit === 1 && ronde.currentplayer === 1 && !onlyhearts) {
								swal({
									title: "<h4 id='swalheartsbroken'>You must not play a card of hearts as first!</h4>",
									imageUrl: "Cards.png",
									timer: 2000,
									showConfirmButton: false,
									html: true
								});
								validcard = false;
							}
							else {
								if (currenthand === 0 && maxcardstoselect === 1 && self.suit === 0 && self.rank === 12) {
									swal({
										title: "<h4 id='swalqueenofspades'>You must not play queen of spades in the first hand!</h4>",
										imageUrl: "Cards.png",
										timer: 2000,
										showConfirmButton: false,
										html: true
									});
									validcard = false;
								}
							}
						}
					}
					if (validcard && (speler1.selectedcards.length < maxcardstoselect)) {
						$("#" + $el.id).addClass('selected');
						endxposition = self.x;
						endyposition = self.y - 20;
						self.animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
								self.$el.style.zIndex;
							},
							onComplete: function onComplete() {
							}
						});
						if (firstSuit === " ") {
							switch (self.suit) {
								case 0: firstSuit = "♠";
									break;
								case 1: firstSuit = "♥";
									break;
								case 2: firstSuit = "♣";
									break;
								case 3: firstSuit = "♦";
									break;
							}
						}
						if (maxcardstoselect === 3) {
							speler1.selectedcards.push(self);
							if (speler1.selectedcards.length === 3) {
								$("#pass_button").show();
							}
						}
						if (maxcardstoselect === 1) {
							speler1.selectedcard = self;
							$("#playcard_button").show();
						}
					}
				}
			}
		}
      var startPos = {};
      var pos = {};
      e.preventDefault();
      if (e.type === 'mousedown') {
        startPos.x = pos.x = e.clientX;
        startPos.y = pos.y = e.clientY;
        addListener(window, 'mousemove', onMousemove);
        addListener(window, 'mouseup', onMouseup);
      } else {
        startPos.x = pos.x = e.touches[0].clientX;
        startPos.y = pos.y = e.touches[0].clientY;
        addListener(window, 'touchmove', onMousemove);
        addListener(window, 'touchend', onMouseup);
      }
      if (!isDraggable) {
        return;
      }
      $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      $el.style.zIndex = maxZ++;
      function onMousemove(e) {
        if (!isDraggable) {
          return;
        }
        if (e.type === 'mousemove') {
          pos.x = e.clientX;
          pos.y = e.clientY;
        } else {
          pos.x = e.touches[0].clientX;
          pos.y = e.touches[0].clientY;
        }
        $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      }
      function onMouseup(e) {
	endTime = new Date().getTime();
	if (endTime - startTime < 250) longpress = false;
	else if (endTime - startTime >= 300) longpress = true;
        if (e.type === 'mouseup') {
          removeListener(window, 'mousemove', onMousemove);
          removeListener(window, 'mouseup', onMouseup);
        } else {
          removeListener(window, 'touchmove', onMousemove);
          removeListener(window, 'touchend', onMouseup);
        }
        if (!isDraggable) {
          return;
        }
        self.x = self.x + pos.x - startPos.x;
        self.y = self.y + pos.y - startPos.y;
      }
    }
    function mount(target) {
      target.appendChild($el);
      self.$root = target;
    }
    function unmount() {
      self.$root && self.$root.removeChild($el);
      self.$root = null;
    }
    function setSide(newSide) {
      if (newSide === 'front') {
        if (self.side === 'back') {
          $el.removeChild($back);
        }
        self.side = 'front';
        $el.appendChild($face);
        self.setRankSuit(self.rank, self.suit);
      } else {
        if (self.side === 'front') {
          $el.removeChild($face);
        }
        self.side = 'back';
        $el.appendChild($back);
        $el.setAttribute('class', 'card');
      }
    }
  }
  function SuitName(suit) {
    return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker';
  }
  function addListener(target, name, listener) {
    target.addEventListener(name, listener);
  }
  function removeListener(target, name, listener) {
    target.removeEventListener(name, listener);
  }
  var ease = {
    linear: function linear(t) {
      return t;
    },
    quadIn: function quadIn(t) {
      return t * t;
    },
    quadOut: function quadOut(t) {
      return t * (2 - t);
    },
    quadInOut: function quadInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    cubicIn: function cubicIn(t) {
      return t * t * t;
    },
    cubicOut: function cubicOut(t) {
      return --t * t * t + 1;
    },
    cubicInOut: function cubicInOut(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    quartIn: function quartIn(t) {
      return t * t * t * t;
    },
    quartOut: function quartOut(t) {
      return 1 - --t * t * t * t;
    },
    quartInOut: function quartInOut(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    quintIn: function quintIn(t) {
      return t * t * t * t * t;
    },
    quintOut: function quintOut(t) {
      return 1 + --t * t * t * t * t;
    },
    quintInOut: function quintInOut(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };
  var sort = {
    deck: function deck(_deck) {
      _deck.sort = _deck.queued(sort);
      function sort(next) {
	speler1.cards = [];
	speler2.cards = [];
	speler3.cards = [];
	speler4.cards = [];
        var sorted = _deck.cards;
        _deck.cards.forEach(function (card, i) {
		strid;
		card.disableDragging();
		card.disableFlipping();
		if (($.urlParam('stubmode') != null) && $.urlParam('stubmode')) {
//			var stub1symbols = "♣2♣6♣7♣B♦3♦8♦9♠6♠A♥4♥0♥B♥H";
//			var stub2symbols = "♣4♣5♣0♣H♣A♦V♦A♠2♠4♠B♥3♥7♥9";
//			var stub3symbols = "♦2♦4♦5♦6♦7♦0♦H♠5♠8♠0♠V♥6♥V";
//			var stub4symbols = "♣3♣8♣9♣V♦B♠3♠7♠9♠H♥2♥5♥8♥A";
			var stub1symbols = "♣2♣6♣7♣B♦3♦8♦9♠6♠V♥4♥0♥B♥H";
			var stub4symbols = "♦2♦4♦5♦0♦B♠3♠7♠9♠H♥2♥5♥8♥A";
			var stub3symbols = "♣3♣8♣9♣V♦6♦7♦H♠5♠8♠0♠A♥6♥V";
			var stub2symbols = "♣4♣5♣0♣H♣A♦V♦A♠2♠4♠B♥3♥7♥9";
			var stubsymbols = Hearts.cardtosymbols(card);
			if (stub1symbols.indexOf(stubsymbols) >= 0 ) {
				card.setSide('front');
				card.player = 1;
				speler1.cards.push(card);
			}
			if (stub2symbols.indexOf(stubsymbols) >= 0 ) {
				card.setSide('front');
				card.player = 2;
				speler2.cards.push(card);
			}
			if (stub3symbols.indexOf(stubsymbols) >= 0 ) {
				card.setSide('front');
				card.player = 3;
				speler3.cards.push(card);
			}
			if (stub4symbols.indexOf(stubsymbols) >= 0 ) {
				card.setSide('front');
				card.player = 4;
				speler4.cards.push(card);
			}
		}
		else {
			if (i < 13) {
				card.setSide('front');
				card.player = 1;
				strid = card.$el.id;
				$("#" + strid).addClass('movable');
				speler1.cards.push(card);
			}
			else
			if (i < 26) {
				card.setSide('back');
				card.player = 2;
				speler2.cards.push(card);
			}
			else
			if (i < 39) {
				card.setSide('back');
				card.player = 3;
				speler3.cards.push(card);
			}
			else
			if (i < 52) {
				card.setSide('back');
				card.player = 4;
				speler4.cards.push(card);
			}
		}
		if (i === 51) {
			next();
		}
        });
      }
    }
  };
  function plusminus(value) {
    var plusminus = Math.round(Math.random()) ? -1 : 1;
    return plusminus * value;
  }
  function fisherYates(array) {
    var rnd, temp;
    for (var i = array.length - 1; i; i--) {
      rnd = Math.random() * i | 0;
      temp = array[i];
      array[i] = array[rnd];
      array[rnd] = temp;
    }
    return array;
  }
  function fontSize() {
    return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2);
  }
  var ____fontSize;
  var shuffle = {
    deck: function deck(_deck3) {
      _deck3.shuffle = _deck3.queued(shuffle);
      function shuffle(next) {
        var cards = _deck3.cards;
        ____fontSize = fontSize();
        fisherYates(cards);
        cards.forEach(function (card, i) {
          card.pos = i;
          card.shuffle(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
        return;
      }
    },
    card: function card(_card3) {
      var $el = _card3.$el;
      _card3.shuffle = function (cb) {
        var i = _card3.pos;
        var z = i / 4;
        var delay = i * 2;
        _card3.animateTo({
          delay: delay,
          duration: 200,
          x: plusminus(Math.random() * 40 + 20) * ____fontSize / 16,
          y: -z,
          rot: 0
        });
        _card3.animateTo({
          delay: 200 + delay,
          duration: 200,
          x: -z,
          y: -z,
          rot: 0,
          onStart: function onStart() {
            $el.style.zIndex = i;
          },
          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };
  var __fontSize;
  var hearts = {
    deck: function deck(_deck4) {
      _deck4.hearts = _deck4.queued(hearts);
      function hearts(next) {
			$("#heartsbutton").prop('disabled', true);
			nextplayer = 1;
			heartsdeck = new Hearts.deck(fulldeck);
			ronde = new Hearts.game(heartsdeck, speler1, speler2, speler3, speler4);
			ronde.hasHeartsBroken = false;
			ronde.twoClubsPlayed = false;
			ronde.cardsPlayed = [];
			hand.cardsPlayed = [];
			speler1.state = 0;
			speler2.state = 0;
			speler3.state = 0;
			speler4.state = 0;
			speler1.selectedcards = [];
			speler2.selectedcards = [];
			speler3.selectedcards = [];
			speler4.selectedcards = [];
			speler1.selectedcard = null;
			speler2.selectedcard = null;
			speler3.selectedcard = null;
			speler4.selectedcard = null;
			heartsdeck.allCards = [];
			heartsdeck.invertDeck = [];
			hand[0] = new Array(13);
			hand[1] = new Array(13);
			hand[2] = new Array(13);
			hand[3] = new Array(13);
			hand[0][0] = [handx[0], handy[0], 1];
			hand[0][1] = [handx[0] + 27, handy[0], 2];
			hand[0][2] = [handx[0] + 2 * 27, handy[0], 3];
			hand[0][3] = [handx[0] + 3 * 27, handy[0], 4];
			hand[0][4] = [handx[0] + 4 * 27, handy[0], 5];
			hand[0][5] = [handx[0] + 5 * 27, handy[0], 6];
			hand[0][6] = [handx[0] + 6 * 27, handy[0], 7];
			hand[0][7] = [handx[0] + 7 * 27, handy[0], 8];
			hand[0][8] = [handx[0] + 8 * 27, handy[0], 9];
			hand[0][9] = [handx[0] + 9 * 27, handy[0], 10];
			hand[0][10] = [handx[0] + 10 * 27, handy[0], 11];
			hand[0][11] = [handx[0] + 11 * 27, handy[0], 12];
			hand[0][12] = [handx[0] + 12 * 27, handy[0], 13];
			hand[1][0] = [handx[1], handy[1], 14];
			hand[1][1] = [handx[1], handy[1] + 27, 15];
			hand[1][2] = [handx[1], handy[1] + 2 * 27, 16];
			hand[1][3] = [handx[1], handy[1] + 3 * 27, 17];
			hand[1][4] = [handx[1], handy[1] + 4 * 27, 18];
			hand[1][5] = [handx[1], handy[1] + 5 * 27, 19];
			hand[1][6] = [handx[1], handy[1] + 6 * 27, 20];
			hand[1][7] = [handx[1], handy[1] + 7 * 27, 21];
			hand[1][8] = [handx[1], handy[1] + 8 * 27, 22];
			hand[1][9] = [handx[1], handy[1] + 9 * 27, 23];
			hand[1][10] = [handx[1], handy[1] + 10 * 27, 24];
			hand[1][11] = [handx[1], handy[1] + 11 * 27, 25];
			hand[1][12] = [handx[1], handy[1] + 12 * 27, 26];
			hand[2][0] = [handx[2], handy[2], 27];
			hand[2][1] = [handx[2] + 27, handy[2], 28];
			hand[2][2] = [handx[2] + 2 * 27, handy[2], 29];
			hand[2][3] = [handx[2] + 3 * 27, handy[2], 30];
			hand[2][4] = [handx[2] + 4 * 27, handy[2], 31];
			hand[2][5] = [handx[2] + 5 * 27, handy[2], 32];
			hand[2][6] = [handx[2] + 6 * 27, handy[2], 33];
			hand[2][7] = [handx[2] + 7 * 27, handy[2], 34];
			hand[2][8] = [handx[2] + 8 * 27, handy[2], 35];
			hand[2][9] = [handx[2] + 9 * 27, handy[2], 36];
			hand[2][10] = [handx[2] + 10 * 27, handy[2], 37];
			hand[2][11] = [handx[2] + 11 * 27, handy[2], 38];
			hand[2][12] = [handx[3] + 12 * 27, handy[2], 39];
			hand[3][0] = [handx[3], handy[3], 40];
			hand[3][1] = [handx[3], handy[3] + 27, 41];
			hand[3][2] = [handx[3], handy[3] + 2 * 27, 42];
			hand[3][3] = [handx[3], handy[3] + 3 * 27, 43];
			hand[3][4] = [handx[3], handy[3] + 4 * 27, 44];
			hand[3][5] = [handx[3], handy[3] + 5 * 27, 45];
			hand[3][6] = [handx[3], handy[3] + 6 * 27, 46];
			hand[3][7] = [handx[3], handy[3] + 7 * 27, 47];
			hand[3][8] = [handx[3], handy[3] + 8 * 27, 48];
			hand[3][9] = [handx[3], handy[3] + 9 * 27, 49];
			hand[3][10] = [handx[3], handy[3] + 10 * 27, 50];
			hand[3][11] = [handx[3], handy[3] + 11 * 27, 51];
			hand[3][12] = [handx[3], handy[3] + 12 * 27, 52];
			var cards = speler1.cards;
			Hearts.sorthand(cards);
			var len = cards.length;
			__fontSize = fontSize();
			indexposition = 0;
			cards.slice(-13).forEach(function (card, i) {
				heartsdeck.invertDeck.push(card);
				card.hearts(i, len, function (i) {
					if (i === 12) {
						next();
					}
				});
			});
			cards = speler2.cards;
			Hearts.sorthand(cards);
			var len = cards.length;
			__fontSize = fontSize();
			indexposition = 1;
			cards.slice(-13).forEach(function (card, i) {
				heartsdeck.invertDeck.push(card);
				card.hearts(i, len, function (i) {
					if (i === 12) {
						next();
					}
				});
			});
			cards = speler3.cards;
			Hearts.sorthand(cards);
			var len = cards.length;
			__fontSize = fontSize();
			indexposition = 2;
			cards.slice(-13).forEach(function (card, i) {
				heartsdeck.invertDeck.push(card);
				card.hearts(i, len, function (i) {
					if (i === 12) {
						next();
					}
				});
			});
			cards = speler4.cards;
			Hearts.sorthand(cards);
			var len = cards.length;
			__fontSize = fontSize();
			indexposition = 3;
			cards.slice(-13).forEach(function (card, i) {
				heartsdeck.invertDeck.push(card);
				card.hearts(i, len, function (i) {
					if (i === 12) {
						next();
					}
				});
			});
			maxcardstoselect = 3;
		}
	},
	card: function card(_card4) {
		var $el = _card4.$el;
		_card4.hearts = function (i, len, cb) {
			var delay = i * 250;
			deltaxposition = i * 27;
			deltayposition = i * 27;
			var xpos = handx[indexposition];
			var ypos = handy[indexposition];
			switch (indexposition) {
				case 0: xpos = xpos + deltaxposition;
					break;
				case 1: ypos = ypos + deltayposition;
					break;
				case 2: xpos = xpos + deltaxposition;
					break;
				case 3: ypos = ypos + deltayposition;
					break;
			}
			_card4.animateTo({
				delay: delay,
				duration: 250,
				x: xpos,
				y: ypos,
				rot: 0,
				onStart: function onStart() {
					$el.style.zIndex = len - 1 + i;
				},
				onComplete: function onComplete() {
					cb(i);
				}
			});
		};
	}
  };
  var intro = {
    deck: function deck(_deck5) {
      _deck5.intro = _deck5.queued(intro);
      function intro(next) {
        var cards = _deck5.cards;
        cards.forEach(function (card, i) {
          card.setSide('front');
          card.intro(i, function (i) {
            animationFrames(250, 0).start(function () {
              card.setSide('back');
            });
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card5) {
      var transform = prefix('transform');
      var $el = _card5.$el;
      _card5.intro = function (i, cb) {
        var delay = 500 + i * 10;
        var z = i / 4;
        $el.style[transform] = translate(-z + 'px', '-250px');
        $el.style.opacity = 0;
        _card5.x = -z;
        _card5.y = -250 - z;
        _card5.rot = 0;
        _card5.animateTo({
          delay: delay,
          duration: 1000,
          x: -z,
          y: -z,
          onStart: function onStart() {
            $el.style.zIndex = i;
          },
          onProgress: function onProgress(t) {
            $el.style.opacity = t;
          },
          onComplete: function onComplete() {
            $el.style.opacity = '';
            cb && cb(i);
          }
        });
      };
    }
  };
  function deg2rad(degrees) {
    return degrees * Math.PI / 180;
  }
  function queue(target) {
    var array = Array.prototype;
    var queueing = [];
    target.queue = queue;
    target.queued = queued;
    return target;
    function queued(action) {
      return function () {
        var self = this;
        var args = arguments;
        queue(function (next) {
          action.apply(self, array.concat.apply(next, args));
        });
      };
    }
    function queue(action) {
      if (!action) {
        return;
      }
      queueing.push(action);
      if (queueing.length === 1) {
        next();
      }
    }
    function next() {
      queueing[0](function (err) {
        if (err) {
          throw err;
        }
        queueing = queueing.slice(1);
        if (queueing.length) {
          next();
        }
      });
    }
  }
  function observable(target) {
    target || (target = {});
    var listeners = {};
    target.on = on;
    target.one = one;
    target.off = off;
    target.trigger = trigger;
    return target;
    function on(name, cb, ctx) {
      listeners[name] || (listeners[name] = []);
      listeners[name].push({ cb: cb, ctx: ctx });
    }
    function one(name, cb, ctx) {
      listeners[name] || (listeners[name] = []);
      listeners[name].push({
        cb: cb, ctx: ctx, once: true
      });
    }
    function trigger(name) {
      var self = this;
      var args = Array.prototype.slice(arguments, 1);
      var currentListeners = listeners[name] || [];
      currentListeners.filter(function (listener) {
        listener.cb.apply(self, args);
        return !listener.once;
      });
    }
    function off(name, cb) {
      if (!name) {
        listeners = {};
        return;
      }
      if (!cb) {
        listeners[name] = [];
        return;
      }
      listeners[name] = listeners[name].filter(function (listener) {
        return listener.cb !== cb;
      });
    }
  }
  function Deck(jokers) {
    var cards = new Array(jokers ? 55 : 52);
    var $el = createElement('div');
    var self = observable({ mount: mount, unmount: unmount, cards: cards, $el: $el });
    var $root;
    var modules = Deck.modules;
    var module;
    queue(self);
    for (module in modules) {
      addModule(modules[module]);
    }
    $el.classList.add('deck');
    var card;
    for (var i = cards.length; i; i--) {
      card = cards[i - 1] = _card(i - 1);
      card.mount($el);
    }
    fulldeck = self.cards;
    return self;
    function mount(root) {
      $root = root;
      $root.appendChild($el);
    }
    function unmount() {
      $root.removeChild($el);
    }
    function addModule(module) {
      module.deck && module.deck(self);
    }
  }
  Deck.animationFrames = animationFrames;
  Deck.ease = ease;
  Deck.modules = { intro: intro, hearts: hearts, shuffle: shuffle, sort: sort };
  Deck.Card = _card;
  Deck.prefix = prefix;
  Deck.translate = translate;
  return Deck;
})();
