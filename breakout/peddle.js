class Peddle extends HTMLElement {
    constructor(width,height) {
      super();
      this.style.width = width+'px';
      this.style.height = height+'px';


    }
  
    connectedCallback() {
      this.setStartlocation()
    }

    setStartlocation(){
      this.style.left = (this.parentElement.width - this.clientWidth) /2 +'px'
    }



    get left(){
      return +this.style.left.substring(0,this.style.left.length-2);
    }

}
  
  // Define the custom element
  customElements.define('game-peddle', Peddle);
  export{Peddle};