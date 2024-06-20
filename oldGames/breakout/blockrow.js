import { BreakoutBlock } from "./block.js";

class BreakoutRow extends HTMLElement {
    constructor(blocksize , lives , design) {
      super();
        this.blocksize = blocksize;
        this.lives = lives;
    }
  
    connectedCallback() {
       const blockCount = this.container.clientWidth / this.blocksize ;
       console.log(this.container);
        for(let i = 0 ; i < blockCount; i++){
            this.append(new BreakoutBlock(this.lives))
        }


    }

    get container() {
        //todo change?
        return this.parentElement;
    }


  }
  
  // Define the custom element
  customElements.define('breakout-row', BreakoutRow);
  export{BreakoutRow};