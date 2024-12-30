import Card from "./card.js";
import Mover from "./mover.js";

export default class App {
  constructor() {

    const localStorageTheme = localStorage.getItem("theme");
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
    let currentThemeSetting = this.calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });
    document.querySelector("html").setAttribute("data-theme", currentThemeSetting);
    document.getElementById("mode").firstChild.setAttribute("src", this.getModeIcon(currentThemeSetting));

    window.addEventListener("load", (event) => {
      event.target;
      if (localStorage.getItem("cards") === null) {
        localStorage.setItem("cards", "[]");
      }
      const cards = JSON.parse(localStorage.getItem("cards"));
      if (cards.length !== 0) {
        for (const c in cards) {
          let oldCard = this.addCard(cards[c]["cardColumn"], cards[c]["cardTitle"], cards[c]["cardColor"], c);
          if (cards[c]["cardDescription"] !== null)
            oldCard.setDescription(cards[c]["cardDescription"]);
        }
      }
    });

    document.getElementById("mode").addEventListener("click", (event) => {
      event.preventDefault();
      const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
      document.querySelector("html").setAttribute("data-theme", newTheme);
      document.getElementById("mode").firstChild.setAttribute("src", this.getModeIcon(newTheme));

      localStorage.setItem("theme", newTheme);
      currentThemeSetting = newTheme;
    });
    
    document.getElementById("addCard").addEventListener("submit", (event)=> 
    {
      event.preventDefault();
      const title = document.getElementById("cardTitle").value;
      const color = document.getElementById("cardColor").value;

      let cards = JSON.parse(localStorage.getItem("cards"));

      this.addCard("todo", title, color, cards.length);

      let cardData = {
        cardTitle: `${title}`, 
        cardColor: `${color}`,
        cardColumn: "todo",
        cardDescription: null
      };
      cards.push(cardData);
      localStorage.setItem("cards", JSON.stringify(cards));

      document.getElementById("cardTitle").value = "";
      document.getElementById("cardColor").value = "#9edbd7";
    });
  }

  addCard(col, title, color, cardID) {
    let newCard = new Card(title, color, cardID);
    let mover = new Mover();
    newCard.addToCol(col, mover);
    return newCard;
  }

  calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
      return localStorageTheme;
    }
    if (systemSettingDark.matches) {
      return "dark";
    }
    return "light";
  }
  getModeIcon (theme) {
    if (theme === "dark") {
      return "icons/light_mode.svg";
    }
    return "icons/dark_mode.svg";
  }
}