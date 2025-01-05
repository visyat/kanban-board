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
        return cards.length // this is used to ID the card for some reason; need to update ...
    }

}