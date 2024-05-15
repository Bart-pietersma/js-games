// import {importCss} from "https://rtdb.nl/functions.js";

class EventLog extends HTMLElement{
    constructor(){
        super()
        this.buildHtml();
    }

    connectedCallback(){
        //todo swap to rtdb.nl
        // importCss()

        //add eventlistners
        document.addEventListener(`rteventlog`, e => this.event(e));
        this.addEventListener(`click`, e => this.toggleShow(e));
    }

    toggleShow(e){
        console.log(e.target);
        if(e.target.id == 'eventlogheader') this.toggleAttribute('closed');
    }

    event(e){
        const [player, msg] = e.detail;
        const p1  = document.createElement(`span`);  const p2  = document.createElement(`span`);  const p3  = document.createElement(`span`);
        p1.innerText = new Date().toLocaleTimeString().substring(0,5);
        p2.innerText = player;
        p3.innerText = msg;
        this.body.prepend(...[p1,p2,p3]);
    }

    clearLog(){
        this.body.innerHTML = '';
        return(`log has been cleared`);
    }

    changeHeader(txt){
        this.header.innerText = txt;
    }

    buildHtml(){
        //header eventlog
        //3 rows : timestamp 1fr | player? 1fr | msg 4fr
        this.header = document.createElement(`span`);
        this.header.innerText = 'Event log';
        this.append(this.header);
        this.header.id = `eventlogheader`;
        this.body = document.createElement(`div`);
        this.body.id = `eventlogbody`;
        this.append(this.body);
    }
}
customElements.define(`rtevent-log`,EventLog);
export {EventLog};

