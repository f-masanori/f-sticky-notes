package main

import (
	"time"

	"github.com/f-masanori/linqumate-auth/src/config"
	"github.com/f-masanori/linqumate-auth/src/infra/db"
	"github.com/f-masanori/linqumate-auth/src/interface/handler/api"
	"github.com/gin-contrib/cors"

	pers "github.com/f-masanori/linqumate-auth/src/infra/db/persistence"

	"github.com/f-masanori/linqumate-auth/src/usecase"
	"github.com/gin-gonic/gin"
)

/* TODO
loggerの実装
*/
func main() {
	config.InitConf()
	useCases := inject()
	r := getRouter(useCases)
	r.Run(":8080")
}

func getRouter(useCases UseCases) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		// アクセスを許可したいアクセス元
		AllowOrigins: []string{"*"},
		AllowMethods: []string{
			"POST",
			"GET",
			"PUT",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"uid",
			"token",
		},
		// cookieなどの情報を必要とするかどうか
		AllowCredentials: true,
		// preflightリクエストの結果をキャッシュする時間
		MaxAge: 24 * time.Hour,
	}))

	r.GET("/stickyNote", api.GETStickyNoteHandler(useCases.StickyNote))
	r.POST("/stickyNote", api.POSTStickyNoteHandler(useCases.StickyNote))
	r.PUT("/stickyNote", api.PUTStickyNoteHandler(useCases.StickyNote))

	// r.PUT("/loginHistory", api.PUTStickyNoteHandler(useCases.StickyNote))
	r.POST("/loginHistory", api.POSTLoginHistoryHandler(useCases.LoginHistory, useCases.StickyNote, useCases.StickyNoteGroups))

	r.GET("/stickyNoteGroups", api.GETStickyNoteGroupHandler(useCases.StickyNoteGroups))
	r.POST("/stickyNoteGroups", api.POSTStickyNoteGroupHandler(useCases.StickyNoteGroups))
	r.PUT("/stickyNoteGroups", api.PUTStickyNoteGroupHandler(useCases.StickyNoteGroups))

	r.OPTIONS("/stickyNote", func(c *gin.Context) {
		api.Wshandler(c.Writer, c.Request)
	})
	return r
}

type UseCases struct {
	StickyNote       usecase.SNUseCase
	StickyNoteGroups usecase.SNGroupUseCase
	LoginHistory     usecase.LoginHistoryUseCase
}

func inject() UseCases {
	authDB := db.GetDBConnection()
	SNUseCase := usecase.NewSNUseCase(pers.NewSNRepositoryImpl(authDB))
	SNGroupUseCase := usecase.NewSNGroupUseCase(pers.NewSNGroupRepositoryImpl(authDB))
	LoginHistory := usecase.NewLoginHistoryUseCase(pers.NewLoginHistoryRepositoryImpl(authDB))

	u := UseCases{
		StickyNote:       SNUseCase,
		StickyNoteGroups: SNGroupUseCase,
		LoginHistory:     LoginHistory,
	}
	return u
}
