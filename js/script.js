var key = "62CBEFE74FE6CFD96089DADE782FB7B8";
var http = new XMLHttpRequest();


function query(userid) {
	games = get_user_games(get_steamid(userid));
	return { "games": games, "linux_supported_games": get_linux_games(games) };
}

function get_user_games(steamid) {
	
}

function get_steamid(userid) {
	
}

get_steamid("nazgrolvi");
