<?php
// matchmoves_eventsource.php
// looks for new entrys in the matchmoves table and sends it out to all that listen to the eventscourse.
include "../origin.php";
include "../database_access.php";
include "../rtfunctions.php";


//! seems the whole stream as a single download times out at 5min regardles of amount of inrormation
//* 



// header settings
header("Content-Type: text/event-stream, Connection: 'keep-alive'");
header("Cache-Control: no-cache");

//get the higest matchmoves id so we can start from new entrys only.
$matchmoves_id = 0;
$query = "SELECT matchmoves_id FROM matchmoves ORDER BY matchmoves_id DESC LIMIT 1;";
$data = $rtdb->query($query);
while($row = $data->fetch_assoc()) {
	foreach($row as $key => $value){ 
		if($key == 'matchmoves_id'){
			$matchmoves_id = $value;
		}
	}
}

// send a ping so the page is not pending till a move is made.
echo "retry: 1\n";
echo "event: ping\n";
echo "data: conection started\n\n";

while (true) {
	// makes the query with updated matchmoves id efry time we get a move and sends this to the database on a 1sec basis.
	$query = $rtdb->prepare("SELECT matchmoves_id, match_guid, move FROM matchmoves WHERE matchmoves_id >?");
	$query->bind_param('i', $matchmoves_id);
	$query->execute();
	$data = $query->get_result();

	//if the query has a result deconstuct it and send it.
	if($data->num_rows > 0) {
		
		while($row = $data->fetch_assoc()) {
				$array= [];
			foreach($row as $key => $value){
				if($key == 'matchmoves_id'){
					$matchmoves_id = $value;
				}else{
					$array[$key] = $value;
				}
			}
			// could send a id with the object.
			// echo "id: {$array['match_guid']}\n";
			
			// encodes the asociative array in a json object and send it.
			$array = json_encode($array);
			echo "data: $array \n\n";
		}
	}else{
		// we have no new entrys
		// echo "event:ping\n";
		// echo "data: no new entry\n\n";
	}

	while (ob_get_level() > 0) {
		ob_end_flush();
	}
	flush();
	//  Break the loop if the client aborted the connection (closed the page)
	if ( connection_aborted() ){
		echo "data: Connection aborted\n\n";
		break;
	} 
	sleep(1);
}
$rtdb->close();

?>