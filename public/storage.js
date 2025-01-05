export default class Storage {
    getTheme() {
        return localStorage.getItem("theme")
    }
    setTheme(theme) {
        localStorage.setItem("theme", theme);
    }
    
    getAllCards() {
        if (localStorage.getItem("cards") === null) {
            localStorage.setItem("cards", "[]");
        }
        const cards = JSON.parse(localStorage.getItem("cards"));
        return cards;
    }
    addCard(title, color) {
        let cards = JSON.parse(localStorage.getItem("cards"));
        let cardData = {
            cardTitle: `${title}`, 
            cardColor: `${color}`,
            cardColumn: "todo",
            cardDescription: null
        };
        cards.push(cardData);
        localStorage.setItem("cards", JSON.stringify(cards));
    }

    // there has to be a more efficient way of doing this ...
    getCardID (card, column = card.parentNode.id) {
        let cardsLS = JSON.parse(localStorage.getItem("cards"));
        let cTitle = card.querySelector(".title").textContent;

        const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
        let cColor = rgba2hex(card.style.background);
        
        let cDescription;
        if (card.querySelector(".description").textContent === "(No description)")
            cDescription = null;
        else 
            cDescription = card.querySelector(".description").textContent; 
            for (let c of cardsLS) {
            if (cTitle === c["cardTitle"] && cColor === c["cardColor"] && column === c["cardColumn"] && cDescription === c["cardDescription"]) 
            {
            return cardsLS.indexOf(c);
            }
        }
    }

    deleteCard(card, column) {
        const cardID = this.getCardID(card, column)

        let cardsLS = JSON.parse(localStorage.getItem("cards"));
        cardsLS.splice(cardID, 1);
        localStorage.setItem("cards", JSON.stringify(cardsLS));
    }
    editCardDescription(desc, card, column) {
        const cardID = this.getCardID(card, column);

        let cardsLS = JSON.parse(localStorage.getItem("cards"));
        cardsLS[cardID]["cardDescription"] = desc;
        localStorage.setItem("cards", JSON.stringify(cardsLS));
    }
}