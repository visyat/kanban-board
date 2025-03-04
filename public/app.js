import Card from "./card.js";
import Mover from "./mover.js";
import Storage from "./storage.js"

export default class App {
  constructor() {
    const storage = new Storage();

    const localStorageTheme = storage.getTheme();
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
    let currentThemeSetting = this.calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });
    document.querySelector("html").setAttribute("data-theme", currentThemeSetting);
    document.getElementById("mode").firstChild.setAttribute("src", this.getModeIcon(currentThemeSetting));

    window.addEventListener("load", async (event) => {
      event.target;
      // await storage.loadFromLocalStorage();
      const cards = await storage.getAllCards();
      if (cards.length !== 0) {
        for (const c in cards) {
          let oldCard = this.addCard(cards[c].column, cards[c].title, cards[c].color);
          if (cards[c].description !== null)
            oldCard.setDescription(cards[c].description);
        }
      }
    });

    document.getElementById("mode").addEventListener("click", (event) => {
      event.preventDefault();
      const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
      document.querySelector("html").setAttribute("data-theme", newTheme);
      document.getElementById("mode").firstChild.setAttribute("src", this.getModeIcon(newTheme));

      storage.setTheme(newTheme)
      currentThemeSetting = newTheme;
    });
    
    document.getElementById("addCard").addEventListener("submit", (event)=> 
    {
      event.preventDefault();
      const title = document.getElementById("cardTitle").value;
      const color = document.getElementById("cardColor").value;

      storage.addCard(title, color);
      this.addCard("todo", title, color);

      document.getElementById("cardTitle").value = "";
      document.getElementById("cardColor").value = "#9edbd7";
    });
  }

  addCard(col, title, color) {
    let newCard = new Card(title, color);
    let mover = new Mover();
    newCard.addToCol(col, mover);
    newCard.handleArchiveButton();
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