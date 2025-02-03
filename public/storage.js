import Dexie from 'https://unpkg.com/dexie/dist/dexie.mjs';

export const db = new Dexie("taskboard");
db.version(2).stores({
    cards: "++id, column, index, title, color, description, archive"
}).upgrade(tx => {
    return tx.table("cards").toCollection().modify(card => {
        card.archive = false;
    });
});
db.version(1).stores({
    cards: "++id, column, index, title, color, description",
});

export default class Storage {
    getTheme() {
        return localStorage.getItem("theme")
    }
    setTheme(theme) {
        localStorage.setItem("theme", theme);
    }

    mapCards(cards) {
        return cards.map((card, index) => ({
            "id": undefined,
            "column": card.cardColumn,
            "index": index,
            "title": card.cardTitle,
            "color": card.cardColor,
            "description": card.cardDescription
        }));
     }
    async loadFromLocalStorage() {
        const mappedCards = this.mapCards(JSON.parse(localStorage.getItem("cards")));
        await db.cards.bulkAdd(mappedCards);
    }
    
    async getAllCards() {
        return await db.cards.orderBy('index').filter(card => !card.archive).toArray();
    }
    async addCard(title, color) {
        let lastIndex = 0;
        const lastCard = await db.cards.orderBy('index').reverse().first();
        lastIndex = lastCard ? lastCard.index + 1 : 0;
        await db.cards.add({
            column: "todo",
            index: lastIndex,
            title: title,
            color: color,
            description: null,
            archive: false
        });
    }
    
    // there has to be a more efficient way of doing this ...
    async getCardID (card, column = card.parentNode.id) {
        let cTitle = card.querySelector(".title").textContent;
        const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
        let cColor = rgba2hex(card.style.background);

        let cardID;
        await db.cards.where("column")
            .equals(column)
            .and(card => card.title === cTitle && card.color === cColor).first((card) => {
                cardID = card.id;
            });
        return cardID;
    }

    async deleteCard(card) {
        const cardID = await this.getCardID(card);
        await db.cards.where("id").equals(cardID).delete();
    }
    async editCardDescription(desc, card) {
        const cardID = await this.getCardID(card);
        await db.cards.where("id").equals(cardID).modify({ description: desc });
    }
    async editTitle(title, card) {
        const cardID = await this.getCardID(card);
        await db.cards.where("id").equals(cardID).modify({ "title": title });
    }
    async archiveCard(card) {
        const cardID = await this.getCardID(card);
        await db.cards.where("id").equals(cardID).modify({ "archive": true });
    }

    async moveCard(moveButton, movedCard) {
        const newColumn = moveButton.parentNode.id;
        const movedCardID = await this.getCardID(movedCard);
    
        let numCardsBeforeMB = 0;
        let prevCard;
        for (let el of moveButton.parentNode.childNodes) 
        {
          if (el === moveButton) { break; }
          if (el.classList !== undefined && el.classList.contains("card")) 
          {
            prevCard = el;
            numCardsBeforeMB += 1;
          }
        }

        await db.cards.where("id").equals(movedCardID).modify({ column: newColumn });
        if (numCardsBeforeMB === 0)
        {
            await db.cards.where("column").equals(newColumn).modify(card => { card.index += 1 });
            await db.cards.where("id").equals(movedCardID).modify({ index: 0 });
        } else {
            let prevCardID = await this.getCardID(prevCard);
            let cardIndex;
            await db.cards.where("id").equals(prevCardID).first((card) => {
                cardIndex = card.index;
            });
            // decrement indices of cards below prevCard 
            await db.cards.where("column").equals(newColumn).and(card => card.index > cardIndex).modify(card => { card.index += 1 });
            await db.cards.where("id").equals(movedCardID).modify({ index: cardIndex+1 });
        }
    }
}