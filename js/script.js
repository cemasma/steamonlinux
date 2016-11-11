var key = "62CBEFE74FE6CFD96089DADE782FB7B8";
var req = new XMLHttpRequest();
var coURL = "https://crossorigin.me/";

function query(userid) {
	games = get_user_games(get_steamid(userid));
	return { "games": games, "linux_supported_games": get_linux_games(games) };
}

function get_user_games(steamid) {
	req.open("GET", coURL + "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1?key="+
			key+"&steamid="+steamid+"&include_appinfo=1&include_played_free_games=1", false);
	req.send(null);
	return JSON.parse(req.responseText).response.games;
}

function get_steamid(userid) {
	req.open("GET", coURL + "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001?key="+key+"&vanityurl="+userid, false);
	req.send(null);
	return JSON.parse(req.responseText).response.steamid;
}

function get_linux_games(games) {
	req.open("GET", coURL + "https://raw.githubusercontent.com/SteamDatabase/SteamLinux/master/GAMES.json", false);
	req.send(null);
	linux_supported_games = [];
	linux_games = JSON.parse(req.responseText);
	for(var i = 0; i < games.length; i++) {
		if(linux_games.hasOwnProperty(games[i].appid)) {
			linux_supported_games.push(games[i]);
		}
	}
	return linux_supported_games;
}

console.log(query("nazgrolvi"));