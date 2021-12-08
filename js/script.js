var req = new XMLHttpRequest();

function query(userid) {
	req.onreadystatechange = handler;
	if(userid.startsWith("http://steamcommunity.com/profiles") || userid.startsWith("https://steamcommunity.com/profiles")) {
		linuxGamesRequest(userid.split("/")[4], true);
	} else if(userid.startsWith("http://steamcommunity.com/id") || userid.startsWith("https://steamcommunity.com/id")) {
		linuxGamesRequest(userid.split("/")[4], false);
	} else {
		linuxGamesRequest(userid, false);
	}
}

function handler(e) {
	if(req.readyState === 4 && req.status === 200) {
		closeLoader();
		showGames(JSON.parse(req.responseText));
	}
}

function linuxGamesRequest(userid, isItAlreadyFound) {
	if(isItAlreadyFound) {
		req.open("GET", "https://steamonlinux.herokuapp.com/?id=" + userid + "&alreadyfounded=" + true, true);
	} else {
		req.open("GET", "https://steamonlinux.herokuapp.com/?id=" + userid, true);
	}
	req.send();
		
}

function showGames(games) {
	for(var i = 0; i < games.length; i++) {
		addToDiv(document.getElementById("games"), games[i].appid, games[i].img_logo_url);
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
