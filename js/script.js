var key = "62CBEFE74FE6CFD96089DADE782FB7B8";
var req = new XMLHttpRequest();
var coURL = "https://crossorigin.me/";

function query(userid) {
	req.onreadystatechange = handler;
	if(userid.startsWith("http://steamcommunity.com/profiles") || userid.startsWith("https://steamcommunity.com/profiles")) {
		userGamesRequest(userid.split("/")[4]);
	} else if(userid.startsWith("http://steamcommunity.com/id") || userid.startsWith("https://steamcommunity.com/id")) {
		startFlowWithSteamId(userid.split("/")[4]);
	} else {
		startFlowWithSteamId(userid);
	}
}

function handler(e) {
	if(req.readyState === 4 && req.status === 200) {
		if(e.currentTarget.responseURL.indexOf("ISteamUser") > -1) {
			userGamesRequest(JSON.parse(req.responseText).response.steamid);
		} else if(e.currentTarget.responseURL.indexOf("IPlayerService") > -1) {
			this.games = JSON.parse(req.responseText).response.games;
			linuxGamesRequest();
		} else {
			closeLoader();
			scrapGames(this.games, JSON.parse(req.responseText));
		}
	}
}

function startFlowWithSteamId(userid) {
	req.open("GET", coURL + "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001?key="+key+"&vanityurl="+userid, true);
	req.send();
}

function userGamesRequest(steamid) {
	req.open("GET", coURL + "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1?key="+
			key+"&steamid="+steamid+"&include_appinfo=1&include_played_free_games=1", true);
	req.send();
}

function linuxGamesRequest() {
	req.open("GET", coURL + "https://raw.githubusercontent.com/SteamDatabase/SteamLinux/master/GAMES.json", true);
	req.send();	
}

function scrapGames(games, linux_games) {
	var linuxSupportedGames = [];
	for(var i = 0; i < games.length; i++) {
		if(linux_games.hasOwnProperty(games[i].appid)) {
			linuxSupportedGames.push(games[i]);
			addToDiv(document.getElementById("games"), games[i].appid, games[i].img_logo_url);
		}
	}
}

function buttonClick() {
	if(document.getElementById("userid").value.length > 0) {
		gamesDiv = document.getElementById("games").innerHTML = "";
		gamesDiv.innerHTML = "";
		openLoader();
		query(document.getElementById("userid").value);
	} else {
		alert("Enter Your CommuntyID");
	}
}

function addToDiv(div, appid, img_logo_url) {
	if(img_logo_url) {
		div.innerHTML += "<img src='http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/"+appid+"/"+img_logo_url+".jpg'/>";
	}
}

function openLoader() {
	document.getElementById("overlay").style.display = "block";
	document.getElementById("loader").style.display = "block";
}

function closeLoader() {
	document.getElementById("overlay").style.display = "none";
	document.getElementById("loader").style.display = "none";
}