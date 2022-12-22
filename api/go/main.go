package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	firebase "firebase.google.com/go"
	"github.com/f-masanori/linqumate-auth/src/config"
	"github.com/f-masanori/linqumate-auth/src/infra/db"
	"github.com/f-masanori/linqumate-auth/src/interface/handler/api"
	"github.com/gin-contrib/cors"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"

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

	authGroup := r.Group("/")
	authGroup.Use(authMiddleware())
	{
		authGroup.GET("/stickyNote", api.GETStickyNoteHandler(useCases.StickyNote))
		authGroup.POST("/stickyNote", api.POSTStickyNoteHandler(useCases.StickyNote))
		authGroup.PUT("/stickyNote", api.PUTStickyNoteHandler(useCases.StickyNote))

		authGroup.POST("/loginHistory", api.POSTLoginHistoryHandler(useCases.LoginHistory, useCases.StickyNote, useCases.StickyNoteGroups))

		authGroup.GET("/stickyNoteGroups", api.GETStickyNoteGroupHandler(useCases.StickyNoteGroups))
		authGroup.POST("/stickyNoteGroups", api.POSTStickyNoteGroupHandler(useCases.StickyNoteGroups))
		authGroup.PUT("/stickyNoteGroups", api.PUTStickyNoteGroupHandler(useCases.StickyNoteGroups))
	}

	return r
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO
		return

		if os.Getenv("ENV") == "local" {
			return
		}
		uid := c.Request.Header.Get("uid")
		token := c.Request.Header.Get("token")
		if uid == "" || token == "" {
			api.ErrorResponse(c, "ok", errors.New("認証に失敗しました。"))
			return
		}

		exe, err := os.Executable()
		fmt.Println(filepath.Dir(exe))
		fmt.Println(os.Getenv("ENV"))
		serviceAccountKeyPath := ""
		if os.Getenv("ENV") == "local" {
			serviceAccountKeyPath = filepath.Join(filepath.Dir(filepath.Dir(exe)), "secrets", "gcp-learn-project-366613-firebase-adminsdk-7zvfn-a44d2c2d52.json")
		} else {
			// TODO:
		}
		opt := option.WithCredentialsFile(serviceAccountKeyPath)
		app, err := firebase.NewApp(context.Background(), nil, opt)
		app.Auth(c)
		if err != nil {
			fmt.Errorf("error initializing app: %v", err)
			return
		}
		godotenv.Load(".env")
	}
}

type UseCases struct {
	StickyNote       usecase.SNUseCase
	StickyNoteGroups usecase.SNGroupUseCase
	LoginHistory     usecase.LoginHistoryUseCase
}

func inject() UseCases {
	RDB := db.GetDBConnection()
	SNRepo := pers.NewSNRepositoryImpl(RDB)
	SNGroupRepo := pers.NewSNGroupRepositoryImpl(RDB)
	LHRepo := pers.NewLoginHistoryRepositoryImpl(RDB)
	SNUseCase := usecase.NewSNUseCase(SNRepo)
	SNGroupUseCase := usecase.NewSNGroupUseCase(SNGroupRepo, SNRepo)
	LoginHistory := usecase.NewLoginHistoryUseCase(LHRepo)

	u := UseCases{
		StickyNote:       SNUseCase,
		StickyNoteGroups: SNGroupUseCase,
		LoginHistory:     LoginHistory,
	}
	return u
}
