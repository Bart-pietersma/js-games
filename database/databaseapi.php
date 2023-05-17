<?php
include 'database_cred.php';
include 'origin.php';
include 'helperfunctions.php';

// *********************************************************************** default parameter values
$action = strtoupper(getParameter("action", "read")); // READ if no action specified

$selectonly = getParameter("SO", false); // prevent UPDATE and DELETE show SELECT only

//TABLE matches fieldnames:
$matches_fieldnames = ["match_id","boardtype", "players","playerlimit", "starttime", "endtime", "Boardlayout", "result", "board_id"];
$moves_fieldnames = ["move_id","board_id","move"];

$match_id = getParameter("match_id", false);
$board_id = getParameter("board_id", false);
$players = getParameter("players", false);
$playerlimit = getParameter("playerlimit", false);
$boardlayout = getParameter('boardlayout',false);
$move = getParameter("move", false);
$result = getParameter("result", "playing"); // todo: waiting, white, black, draw

// create read update delete

/*
CREATE:
    Match
    move

READ:
    FROM:
        Match
        matches
        moves
    WHERE:

UPDATE:
    match
        WHERE:
            board_id

DELETE:
    question

*/
?>