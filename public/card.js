import Storage from "./storage.js";

const NO_DESCRIPTION_TEXT = "(No description)";
export default class Card {
  constructor(title, color) {
    const storage = new Storage();

    let templateCard = document.querySelector(".template");
    let clone = templateCard.cloneNode(true); 
    clone.classList.remove("template");
    
    clone.querySelector(".title").textContent = title;
    clone.style.background = color;

    this.card = clone;

    this.setTextColor(color);
    this.setDescription();

    const del_button = this.card.querySelector(".delete");
    del_button.addEventListener ("click", (event) => {
      event.target;
      this.moverObject.stopMoving();
      this.card.remove();

      storage.deleteCard(this.card, this.column)
    });

    const edit_button = this.card.querySelector(".edit");
    const text_area = this.card.querySelector(".editDescription")
    const description = this.card.querySelector(".description")

    edit_button.addEventListener ("click", (event) => {
      event.target;
      this.moverObject.stopMoving();
      
      description.classList.add("hidden");
      text_area.classList.remove("hidden");

      if (description.textContent !== NO_DESCRIPTION_TEXT) 
        text_area.textContent = description.textContent;
      text_area.focus();
      text_area.select();
    });
    text_area.addEventListener("blur", (event)=> {
      event.target;
      let desc = text_area.value; 

      storage.editCardDescription(desc, this.card, this.column)
      this.setDescription(desc || NO_DESCRIPTION_TEXT);

      description.classList.remove("hidden");
      text_area.classList.add("hidden");
    });

    const move_button = this.card.querySelector(".startMove");
    move_button.addEventListener ("click", (event) => {
      event.target;
      if (this.card.classList.contains("moving")) {
        this.moverObject.stopMoving();
      }
      else
      {
        this.moverObject.stopMoving();
        this.moverObject.startMoving(this.card);
      }
    });
  }

  addToCol(colElem = "todo", mover) {
    this.moverObject = mover;
    this.column = colElem;
    let col = document.getElementById(colElem); 
    this.moverObject.stopMoving();
    col.appendChild(this.card);
  }

  setDescription(text = NO_DESCRIPTION_TEXT) {
    this.card.querySelector(".description").textContent = text;
  }

  setTextColor(cardColor) {
    const r = parseInt(cardColor.slice(1, 3), 16);
    const g = parseInt(cardColor.slice(3, 5), 16);
    const b = parseInt(cardColor.slice(5, 7), 16);

    const luminance = 0.2126*(r/255) + 0.7152*(g/255) + 0.0722*(b/255);

    const mode = luminance>0.5 ? "light" : "dark";
    if (mode === "dark")
      this.card.classList.add("darkColor");
  }

  clearAllBlanks() {
    setTimeout ( () => {
      document.querySelectorAll(".blankSpace").forEach( (el) => {
        el.remove();
      });
    }, 500);
  }

}
