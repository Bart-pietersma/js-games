//!make the crud api here!!!
import { createPool } from 'mysql';

class ApiHandler {
  constructor() {

    // this.con = createConnection({
    //     host:'rtdb.nl',
    //     database: 'rtdb-db',
    //     user:'rtdbadmin',
    //     password:'Z25j8&v9p',
    // });

    //old db
    this.pool = createPool({
      connectionLimit: 10,
      host: `schaakzet.nl`,
      database: `schaakzet_main`,
      user: `schaakzet_mainadmin`,
      password: `SCH@@K!mat`
    });

    this.querys = {
      //board stuff
      newGame: 'INSERT INTO boards (boardID,boardType,players,playerlimit,boardState) VALUES (?,?,?,?,?)',
      move: 'INSERT INTO moves (boardID, move) VALUES (?,?) ',
      getMoves : 'SELECT move FROM moves where boardID = ? ',
      updateBoardState: 'UPDATE boards SET boardState = ? where boardID = ?',
      getPlayers: 'SELECT players from boards where boardID = ?',
      addPlayer: 'UPDATE boards set players = ? WHERE boardID = ?',
      endGame: 'UPDATE boards set resolution = ?, endtime = CURENT_TIMESTAMP() WHERE boardID = ?',

      //lobby stuf
      showAvailbleBoards: 'SELECT boardID,boardType,playerLimit FROM boards Where playerLimit != "full" ',

      //observer
      ongoingGames: 'SELECT boardID,boardType,playerLimit FROM boards Where playerLimit = "full" ',

      //delete stuf
      deleteGame: 'DELETE FROM boards WHERE boardID = ?',
      deleteMoves: 'DELETE FROM moves WHERE boardID = ?',
    }

  }

  //! make safty check to comfirm if query is a duplicate

  createBoard(arr, callback) {
    //send a createboard query to the database return a okpacket object
    this.EscapeQuery(
      this.querys.newGame,
      arr,
      (response) => {
        callback(response);
      });
  }

  joinBoard(boardID, player, callback) {
    //todo make so acidentel joingames to same user not good
    this.EscapeQuery(this.querys.getPlayers, boardID, (response) => {
      player = response[0].players + `,` + player;
      this.EscapeQuery(this.querys.addPlayer, [player, boardID], (response) => {
        callback(response);
      });
    });
  }

  endGame(boardID, resolution, callback) {
    this.EscapeQuery(this.querys.endGame,[resolution,boardID],(response)=>{
      callback(response);
    })
  }

  sendMove(boardID, move, boardState, callback) {
    let ok = 0;
    this.EscapeQuery(
      this.querys.move,
      [boardID, move],
      (response) => {
        response && ok++;
        this.EscapeQuery(
          this.querys.updateBoardState,
          [boardState, boardID],
          (response) => {
            response && ok++;
            if (ok == 2) {
              callback('sucsesful')
            } else {
              callback('error');
            }
          });
      });
  }

  getOpenGames(callback) {
    this.Query(
      this.querys.showAvailbleBoards,
      (response) => {
        console.log(response);
        callback(response);
      });
  }

  getOngoingGames(callback){
    this.Query(
      this.querys.ongoingGames,
      (response) => {
        console.log(response);
        callback(response);
      });
  }
  getMoves(boardID,callback){
    this.EscapeQuery(
      this.querys.getMoves,
      boardID,
      (response) => {
        console.log(response);
        callback(response);
      });
  }

  Query(query, callback) {
    this.pool.query(query, (error, results, fields) => {
      if (error) throw error;
      callback(results);
    });
  };

  EscapeQuery(query, arr, callback) {
    this.pool.query(query, arr, (error, results, fields) => {
      if (error) throw error;
      callback(results);
    });
  };

  close() {
    this.pool.end((err) => { });
  }

}

export { ApiHandler };