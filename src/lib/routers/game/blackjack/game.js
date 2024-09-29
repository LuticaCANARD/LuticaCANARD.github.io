import { cardNumber, cardType, TrumpCard } from "../common/card";

function makeDeck() {
    const deck = [];
    for (let type in cardType) {
        for (let number in cardNumber) {
            deck.push(new TrumpCard(cardType[type], cardNumber[number]));
        }
    }
    deck.sort(() => Math.random() - 0.5);
    return deck;
}

export class BlackjackGame {
    
    constructor() {
        this.deck = makeDeck();
        this.player = [];
        this.dealer = [];
        this.playerScore = 0;
        this.dealerScore = 0;
        this.gameResult = '';
        this.gameEnd = false;
    }

    start() {
        this.player = [this.deck.pop(), this.deck.pop()];
        this.dealer = [this.deck.pop(), this.deck.pop()];
        this.playerScore = this.calculateScore(this.player);
        this.dealerScore = this.calculateScore(this.dealer);
        if(this.playerScore === 21){
            this.stand();
        } else if(this.dealerScore === 21){
            this.gameResult = 'lose';
            this.gameEnd = true;
        }
    }
    calculateScore(cards) {
        let score = 0;
        let aceCount = 0;
        cards.forEach(card => {
            if (card.number === cardNumber.ACE) {
                aceCount++;
                score += 11;
            } else if (card.number >= cardNumber.JACK) {
                score += 10;
            } else {
                score += card.number;
            }
        });
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    }
    hit() {
        if(this.gameEnd) return;
        this.player.push(this.deck.pop());
        this.playerScore = this.calculateScore(this.player);
        if (this.playerScore > 21) {
            this.gameResult = 'lose';
            this.gameEnd = true;
        }
    }
    stand() {
        if(this.gameEnd) return;
        while (this.dealerScore < 17) {
            this.dealer.push(this.deck.pop());
            this.dealerScore = this.calculateScore(this.dealer);
        }
        if (this.dealerScore > 21 || this.playerScore > this.dealerScore) {
            this.gameResult = 'win';
        } else if (this.playerScore === this.dealerScore) {
            this.gameResult = 'draw';
        } else {
            this.gameResult = 'lose';
        }
        this.gameEnd = true;
    }
    double() {
        this.hit();
        this.stand();
    }
    surrender() {
        this.gameResult = 'lose';
        this.gameEnd = true;
    }
    get playerCards() {
        return this.player;
    }
    get dealerCards() {
        return this.dealer;
    }
    get playerCardImages() {
        return this.player.map(card => card.cardImage);
    }
    get dealerCardImages() {
        return this.dealer.map(card => card.cardImage);
    }
    get dealerCardImageBack() {
        return this.dealer[0].cardImageBack;
    }
    get playerScoreText() {
        return `Player: ${this.playerScore}`;
    }
    get dealerScoreText() {
        return `Dealer: ${this.dealerScore}`;
    }
    get gameResultText() {
        return this.gameResult === '' ? '' : `You ${this.gameResult}!`;
    }
    get PlayerCards(){
        return this.player.map(card => card.cardName + '_' + card.cardNumber);
    }
    get DealerCards(){
        return this.dealer.map(card => card.cardName + '_' + card.cardNumber);
    }
    get PlayerScore(){
        return this.playerScore;
    }
    get DealerScore(){
        return this.dealerScore;
    }
}

