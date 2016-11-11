var key = "62CBEFE74FE6CFD96089DADE782FB7B8";
var http = new XMLHttpRequest();


function query(userid) {
	games = get_user_games(get_steamid(userid));
	return { "games": games, "linux_supported_games": get_linux_games(games) };
}

function get_user_games(steamid) {
	
}

function get_steamid(userid) {
	http.open("GET", "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001?key="+key+"&vanityurl="+userid);
	http.send();
	console.log(http.responseText);
}

get_steamid("nazgrolvi");
