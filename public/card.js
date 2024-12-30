/* The text to use when description is empty */
const NO_DESCRIPTION_TEXT = "(No description)";

/*
LINTING NOTES:
* Have to restructure code to get rid of extraneous 'this' calls; I don't think I'm using them correctly
* Have to ensure that the event parameters passed into the event handlers are used (gives linting errors)
*/

export default class Card {
  constructor(title, color) {
    let templateCard = document.querySelector(".template");
    let clone = templateCard.cloneNode(true); 
    clone.classList.remove("template");
    
    clone.querySelector(".title").textContent = title;
    clone.style.background = color;

    this.card = clone;
    // this.cTitle = title;
    // this.cColor = color;

    this.setTextColor(color);
    this.setDescription();

    const del_button = this.card.querySelector(".delete");
    del_button.addEventListener ("click", (event) => {
      event.target;
      this.moverObject.stopMoving();
      this.card.remove();

      let cardID = this.moverObject.getCardIDFromLS(this.card, this.column);
      let cardsLS = JSON.parse(localStorage.getItem("cards"));
      let cDeleted = cardsLS.splice(cardID, 1)[0];
      for (let c of cardsLS)
      {
        if (c["cardOrder"] > cDeleted["cardOrder"])
        {
          c["cardOrder"] -= 1;
        }
      }

      localStorage.setItem("cards", JSON.stringify(cardsLS));
    });

    const edit_button = this.card.querySelector(".edit");
    edit_button.addEventListener ("click", (event) => {
      event.target;
      this.moverObject.stopMoving();
      let description = this.card.querySelector(".description")
      description.classList.add("hidden");

      let text_area = this.card.querySelector(".editDescription")
      text_area.classList.remove("hidden");

      if (description.textContent !== NO_DESCRIPTION_TEXT) 
        text_area.textContent = description.textContent;
      text_area.focus();
      text_area.select();
      
      text_area.addEventListener("blur", (event)=> {
        event.target;
        let desc = text_area.value; 
        
        let cardID = this.moverObject.getCardIDFromLS(this.card, this.column);
        let cardsLS = JSON.parse(localStorage.getItem("cards"));
        cardsLS[cardID]["cardDescription"] = desc;
        localStorage.setItem("cards", JSON.stringify(cardsLS));
        
        this.setDescription(desc || NO_DESCRIPTION_TEXT);

        description.classList.remove("hidden");
        text_area.classList.add("hidden");
      })
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
        //this.cardID = this.moverObject.updateCardID();
        //console.log(this.cardID);
      }
    });
    
    this.card.addEventListener("dragstart", (event) => {
      if (document.querySelector(".dragged") !== null) 
      {
        document.querySelector(".dragged").classList.remove("dragged");
      }
      
      event.dataTransfer.setData('text/html', this.card.outerHTML); // May be used for cloning/dropping
      event.dataTransfer.setDragImage(this.card, 0, 0);
      this.card.classList.add('dragging');
      this.card.style.opacity = '0.5';
      setTimeout(() => {
        this.card.style.display = 'none';
      }, 0);

    });
    this.card.addEventListener("dragend", (event) => {
      event.target;
      this.card.classList.remove('dragging');
      this.clearAllBlanks();
      this.card.style.display = "";
      this.card.style.opacity = "1";
    });

    document.addEventListener("dragover", (event) => {
      if (event.target.classList.contains("card") || event.target.classList.contains("column") || event.target.classList.contains("blankSpace")) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }
    });
    this.card.addEventListener("dragenter", (event) => {
      event.preventDefault();
      if (!document.querySelector(".blankSpace") && event.target.classList.contains("card")) 
      {
        let templateCard = document.querySelector(".template");
        let blankSpace = templateCard.cloneNode(true);
        blankSpace.classList.remove("template");
        blankSpace.setAttribute("draggable", "false");
        blankSpace.classList.add("blankSpace");
        event.target.parentNode.insertBefore(blankSpace, event.target);

        blankSpace.addEventListener("dragover", (event) => {
          event.preventDefault();
        });

      }
    });
    this.card.addEventListener("dragleave", (event) => {
      if (!event.target.classList.contains("blankSpace"))
      {
        setTimeout(this.clearAllBlanks(), 1000);
      }
    });

    document.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const draggingCard = document.querySelector('.dragging');

      if (event.target.classList.contains("blankSpace")) {
        event.target.parentNode.insertBefore(draggingCard, event.target);
        draggingCard.classList.add("dragged"); 
      }
      else if (event.target.classList.contains("column")) {
        if (document.querySelector(".blankSpace") !== null) 
        {
          let blank = document.querySelector(".blankSpace");
          blank.parentNode.insertBefore(draggingCard, blank);
          draggingCard.classList.add("dragged"); 
        }
        else 
        {
          event.target.appendChild(draggingCard);
          draggingCard.classList.add("dragged"); 
        }
      } 
      else if (event.target.classList.contains("card")) {
        event.target.parentNode.insertBefore(draggingCard, event.target);
        draggingCard.classList.add("dragged"); 
      }
      else if (event.target.parentNode.classList.contains("card")) {
        event.target.parentNode.parentNode.insertBefore(draggingCard, event.target.parentNode);
        draggingCard.classList.add("dragged"); 
      }
      else if (event.target.parentNode.parentNode.classList.contains("card")) {
        event.target.parentNode.parentNode.parentNode.insertBefore(draggingCard, event.target.parentNode.parentNode);
        draggingCard.classList.add("dragged"); 
      }
      this.clearAllBlanks();

      draggingCard.style.display = "";
      draggingCard.style.opacity = '1';
    });

    document.addEventListener("click", (event) => {
      event.target;
      let draggedCard = document.querySelector(".dragged");
      if (draggedCard !== null) 
      {
        draggedCard.classList.remove("dragged");
      }
    });
  }

  // clearAllBlanks() {
  //   const blanks = document.querySelectorAll(".blankSpace");
  //   blanks.forEach(blank => blank.remove());
  // }

  addToCol(colElem = "todo", mover) {
    //console.log(this.mover);
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
