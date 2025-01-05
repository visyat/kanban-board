const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
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
      if (! element.classList.contains("template")) 
      {
        let cb_clone = move_button.cloneNode(true);
        element.parentNode.insertBefore(cb_clone, element);
      }
    });

    let move_buttons = document.querySelectorAll(".moveHere");
    move_buttons.forEach ((element) => {
      element.addEventListener("click", (event) => {
        event.target;
        this.updateLocalStorage(element);
        
        element.parentNode.insertBefore(card, element);
      
        card.classList.remove ("moving");
        move_buttons.forEach((el)=>{
          el.remove(); 
        });
        this.movedCard = null;

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

  updateLocalStorage(moveButton) {
    let cardsLS = JSON.parse(localStorage.getItem("cards"));
    let movedCardID = this.getCardIDFromLS(this.movedCard);
    console.log(movedCardID);
    console.log(cardsLS[movedCardID]);

    let newColumn = moveButton.parentNode.id;

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
    if (numCardsBeforeMB === 0)
    {
      let cTemp = cardsLS.splice(movedCardID, 1)[0];
      cardsLS.splice(0, 0, cTemp);
      movedCardID = 0;
    }
    else 
    {
      let prevCardID = this.getCardIDFromLS(prevCard);
      
      let cTemp = cardsLS.splice(movedCardID, 1)[0];
      cardsLS.splice(prevCardID, 0, cTemp);
      movedCardID = prevCardID;
    }
    console.log(movedCardID);
    console.log(cardsLS[movedCardID]);

    cardsLS[movedCardID]["cardColumn"] = newColumn;
    localStorage.setItem("cards", JSON.stringify(cardsLS));
  }

  getCardIDFromLS (card, column = card.parentNode.id) {
    let cardsLS = JSON.parse(localStorage.getItem("cards"));
    let cTitle = card.querySelector(".title").textContent;

    //RGB to hex conversion from StackOverflow: 
    //https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
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
}
