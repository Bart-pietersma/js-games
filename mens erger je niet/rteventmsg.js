

class RtEventMsg extends HTMLElement {
     constructor(msg = 'the text u want to display', collor = 'coral', duration = 3){
        super()
        this.innerText = msg;
        //todo check if the css exist if not place it
        this.style.backgroundColor = collor;
        this.timing = duration * 1000;
        this.style.animationDuration = this.timing+'ms';

     }

     connectedCallback(){
        setTimeout(() => {
            this.remove();
        }, this.timing);

     }


}
customElements.define(`rtevent-msg`,RtEventMsg);
export {RtEventMsg};