<?php
// a file for helper functions.

function random()
{
	return mt_rand(0, 65535);
}
function GUID()
{
	if (function_exists('com_create_guid')) {
		global $dev;
		if ($dev) $returnJSON[$dev]["has_com_create_guid"] = true;
		return trim(com_create_guid(), '{}');
	}
	return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', random(), random(), random(), mt_rand(16384, 20479), mt_rand(32768, 49151), random(), random(), random());
}

function getParameter($str = "fieldname", $defaultValue = "")
{
	// get POST or GET or cookie or defaultValue
	//* we use prepared statments wich checks for sql injections
	//*  https://websitebeaver.com/prepared-statements-in-php-mysqli-to-prevent-sql-injection
	//*uses : https://www.php.net/manual/en/reserved.variables.request.php
	$val = $_REQUEST[$str] ? $_REQUEST[$str]  : $defaultValue;
	return ($val);
}

//makes the slq fetch into a object
function rt_decodeFetch($result){
	if($result->num_rows > 0) {
        $data = [];
        while($row = $result->fetch_assoc()) {
            $items= [];
			foreach($row as $key => $value){
                $key = ($key == 'guid') ? $key = 'id' : $key = $key ; 
					$items[$key] = $value;
			}
            if($result->num_rows == 1){
                return $items;
            }else{
                $data[] = $items;
            }
			// encodes the asociative array in a object and returns it
		}
        $data = $data;
        return $data ;
	}else{
        // somthing went wrong
        $return = 'error no results in the fetch';
        return $return;
	}
}

//validation of a chess fen
function validateFEN($fen)
{
	$re = '/^
(?# Piece Placement Section)(?<PiecePlacement>((?<RankItem>[pnbrqkPNBRQK1-8]{1,8})\/?){8})
(?# Section Separator)\s+
(?# Side To Move Section)   (?<SideToMove>b|w)
(?# Section Separator)\s+
(?# Castling Ability)       (?<Castling>-|K?Q?k?q)
(?# Section Separator)\s+
(?# En passant)             (?<EnPassant>-|[a-h][3-6])
\s*
$/x';

	// $str = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -';
	// put in the $re when we get half clok move and ful move number
	// (?# Section Separator)\s+
	// (?# Half Move Clock)        (?<HalfMoveClock>\d+)
	// (?# Section Separator)\s+
	// (?# Full Move Number)       (?<FullMoveNumber>\d+)

	preg_match($re, $fen, $matches, PREG_OFFSET_CAPTURE, 0);
	return $matches;
}

?>