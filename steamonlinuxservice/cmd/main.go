package main

import (
	"github.com/labstack/echo/v4/middleware"
	"net/http"
	"os"
	"steamonlinuxservice"

	"github.com/labstack/echo/v4"
)

func main() {
	port := os.Getenv("PORT")

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	e.GET("/", func(c echo.Context) error {
		linuxGames := steamonlinuxservice.GetOwnedLinuxGames(c.QueryParam("id"), c.QueryParam("alreadyfounded") == "true")

		return c.Blob(http.StatusOK, echo.MIMEApplicationJSON, linuxGames)
	})
	e.Logger.Fatal(e.Start(":" + port))
}
