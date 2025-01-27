import Storage from "./storage.js";

const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    this.storage = new Storage();
  }

  startMoving(card) {
    this.movedCard = card;
    card.classList.add("moving"); 
    let move_button = document.createElement("button");
    move_button.classList.add("moveHere")
    move_button.textContent = MOVE_HERE_TEXT; 

    let columns = document.querySelectorAll(".column"); 
    columns.forEach((element) => {
      let mb_clone = move_button.cloneNode(true); 
      element.appendChild(mb_clone);
    });
    let cards = document.querySelectorAll(".card"); 
    cards.forEach((element) => {
      if (!element.classList.contains("template")) 
      {
        let cb_clone = move_button.cloneNode(true);
        element.parentNode.insertBefore(cb_clone, element);
      }
    });

    let move_buttons = document.querySelectorAll(".moveHere");
    move_buttons.forEach ((element) => {
      element.addEventListener("click", async (event) => {
        event.target;
        await this.storage.moveCard(element, card);
        
        element.parentNode.insertBefore(card, element);
      
        card.classList.remove ("moving");
        move_buttons.forEach((el)=>{
          el.remove(); 
        });
      });
    });
  }

  stopMoving() {
    let selected = document.querySelectorAll(".moving"); 
    selected.forEach ((element) => {
      element.classList.remove("moving");
    });
    let move_buttons = document.querySelectorAll(".moveHere");
    move_buttons.forEach ((element) => {
      element.remove(); 
    });
  }

}
