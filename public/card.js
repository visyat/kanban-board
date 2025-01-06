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
      storage.deleteCard(this.card)
      
      this.card.remove();
    });

    const edit_button = this.card.querySelector(".edit");
    const edit_desc_area = this.card.querySelector(".editDescription")
    const description = this.card.querySelector(".description")

    description.addEventListener("dblclick", (event) => {
      event.target;
      this.moverObject.stopMoving();
      
      description.classList.add("hidden");
      edit_desc_area.classList.remove("hidden");

      if (description.textContent !== NO_DESCRIPTION_TEXT) 
        edit_desc_area.textContent = description.textContent;
      edit_desc_area.focus();
      edit_desc_area.select();
    })
    edit_button.addEventListener ("click", (event) => {
      event.target;
      this.moverObject.stopMoving();
      
      description.classList.add("hidden");
      edit_desc_area.classList.remove("hidden");

      if (description.textContent !== NO_DESCRIPTION_TEXT) 
        edit_desc_area.textContent = description.textContent;
      edit_desc_area.focus();
      edit_desc_area.select();
    });
    edit_desc_area.addEventListener("blur", (event)=> {
      event.target;
      let desc = edit_desc_area.value; 

      storage.editCardDescription(desc, this.card)
      this.setDescription(desc || NO_DESCRIPTION_TEXT);

      description.classList.remove("hidden");
      edit_desc_area.classList.add("hidden");
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

    const title_obj = this.card.querySelector(".title");
    const edit_title_area = this.card.querySelector(".editTitle");
    title_obj.addEventListener("dblclick", (event) => {
      event.target;
      this.moverObject.stopMoving();
      
      title_obj.classList.add("hidden");
      edit_title_area.classList.remove("hidden");

      edit_title_area.textContent = title_obj.textContent;
      edit_title_area.focus();
      edit_title_area.select();
    });
    edit_title_area.addEventListener("blur", (event)=> {
      event.target;
      let title = edit_title_area.value; 

      storage.editTitle(title, this.card)
      this.card.querySelector(".title").textContent = title;

      title_obj.classList.remove("hidden");
      edit_title_area.classList.add("hidden");
    });
  }

  addToCol(colElem = "todo", mover) {
    this.moverObject = mover;
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

}
