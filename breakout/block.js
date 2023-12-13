class BreakoutBlock extends HTMLElement {
    constructor(lives) {
      super();
      this.setAttribute('lives', lives);

    }
  
    connectedCallback() {
      // You can perform additional actions when the element is connected to the DOM
    }

    getClosestSide([x,y], element = this) {
        const rect = element.getBoundingClientRect();
        const distances = {
          top: Math.abs(y - rect.top),
          bottom: Math.abs(y - rect.bottom),
          left: Math.abs(x - rect.left),
          right: Math.abs(x - rect.right),
        };

        // Find the side with the minimum distance
        const closestSide = Object.keys(distances).reduce((minSide, side) => (distances[side] < distances[minSide] ? side : minSide), 'top');
        return closestSide;
      }

      get lives(){
        return this.getAttribute('lives');
      }

      set lives(value){
        if (this.lives - value > -1){
          return this.setAttribute('lives',value);
        }
      }


  }
  
  // Define the custom element
  customElements.define('breakout-block', BreakoutBlock);
  export{BreakoutBlock};