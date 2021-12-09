package steamonlinuxservice

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type ResponseSteamId struct {
	SteamId string `json:"steamid"`
	Success int    `json:"success"`
}

type ResolvedVanityUrl struct {
	Response ResponseSteamId `json:"response"`
}

type Game struct {
	AppId        int    `json:"appid"`
	Name         string `json:"name"`
	ImageIconUrl string `json:"img_icon_url"`
	ImageLogoUrl string `json:"img_logo_url"`
}

type ResponseOwnedGames struct {
	GameCount int    `json:"game_count"`
	Games     []Game `json:"games"`
}

type OwnedGames struct {
	Response ResponseOwnedGames `json:"response"`
}

func GetOwnedLinuxGames(id string, isItAlreadyFound bool) []byte {
	if !isItAlreadyFound {
		id = getSteamId(id)
	}

	ownedGames := GetOwnedGames(id)
	linuxGames := getLinuxGames()

	b, err := json.MarshalIndent(intersectionOwnedLinuxGames(ownedGames, linuxGames), "", " ")
	checkError(err)

	return b
}

func GetOwnedGames(steamId string) OwnedGames {
	key := os.Getenv("STEAM_ACCESS_KEY")
	ownedGames := OwnedGames{}
	err := json.Unmarshal(doGetRequest("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1?key="+key+"&steamid="+steamId+"&include_appinfo=1&include_played_free_games=1"), &ownedGames)
	checkError(err)
	return ownedGames
}

func getLinuxGames() map[int]interface{} {
	var linuxGames map[int]interface{}
	err := json.Unmarshal(doGetRequest("https://raw.githubusercontent.com/SteamDatabase/SteamLinux/master/GAMES.json"), &linuxGames)
	checkError(err)

	return linuxGames
}

func intersectionOwnedLinuxGames(ownedGames OwnedGames, linuxGames map[int]interface{}) []Game {
	games := []Game{}
	for _, v := range ownedGames.Response.Games {
		if linuxGames[v.AppId] != nil {
			games = append(games, v)
		}
	}
	return games
}

func getSteamId(id string) string {
	key := os.Getenv("STEAM_ACCESS_KEY")
	resolvedVanityUrl := ResolvedVanityUrl{}
	err := json.Unmarshal(doGetRequest("https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001?key="+key+"&vanityurl="+id), &resolvedVanityUrl)
	checkError(err)
	return resolvedVanityUrl.Response.SteamId
}

func readBody(resp http.Response) (body []byte) {
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	checkError(err)
	return
}

func doGetRequest(url string) []byte {
	resp, err := http.Get(url)
	checkError(err)

	return readBody(*resp)
}

func checkError(err error) {
	if err != nil {
		log.Println(err)
	}
}
