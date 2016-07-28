function play1card(card) {
	if (!ronde.twoClubsPlayed && speler1.selectedcard.rank === 2 && speler1.selectedcard.suit === 2) {
		ronde.twoClubsPlayed = true;
	}
	if (!ronde.hasHeartsBroken && ronde.currentplayer === 1 && speler1.selectedcard.suit === 1) {
		ronde.hasHeartsBroken = true;
	}
	endxposition = 0;
	endyposition = 100;
	speler1.selectedcard.animateTo({
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
	playedcards = playedcards + 1;
}
function select1card() {
	for (var j = 0; j <= 12; j++) {
		strid = speler1.cards[j].$el.id;
		if (speler1.cards[j].suit === 2) {
			$("#" + strid).addClass('movable');
			if (speler1.cards[j].rank === 2) {
				ronde.currentplayer = 1;
			}
			else if (ronde.currentplayer === 1) $("#" + strid).removeClass('movable');
		}
		else $("#" + strid).removeClass('movable');
	}
}
