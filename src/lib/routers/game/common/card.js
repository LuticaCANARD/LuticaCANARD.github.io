export const cardType = {
    SPADE: 1,
    HEART: 2,
    DIAMOND: 3,
    CLUB: 4
}
export const cardNumber = {
    ACE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    JACK: 11,
    QUEEN: 12,
    KING: 13
}

export class TrumpCard {
    #type = null;
    #number = null;
    constructor(type, number) {
        this.#type = type;
        this.#number = number;
    }
    get type() {
        return this.#type;
    }
    get number() {
        return this.#number;
    }
    get cardName() {
        return `${this.#type}_${this.#number}`;
    }
    get cardImage() {
        return `../../assets/cards/${this.cardName}.png`;
    }
    get cardImageBack() {
        return `../../assets/cards/back.png`;
    }
    

}