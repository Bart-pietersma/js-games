class ApiHandler{
    constructor(){

        //conect eventstream
        this.eSoucreLink = '';
        this.evtSoucrse = new EventSource(this.eSoucreLink)
    }
    //DB settings


    //

    initGame(stuf){

    }

    sendMove(stuf){

    }

    sendEventStream(){
        
    }

}

class ChessApi extends ApiHandler{
    constructor(){
        super();
    }


}
export {ChessApi};

