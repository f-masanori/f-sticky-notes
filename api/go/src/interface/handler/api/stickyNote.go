package api

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/f-masanori/linqumate-auth/src/domain/models"
	"github.com/f-masanori/linqumate-auth/src/usecase"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type POSTStickyNote struct {
	ID      string `json:"id"`
	Value   string `json:"value"`
	GroupID string `json:"groupID"`
	X       int    `json:"x"`
	Y       int    `json:"y"`
	Width   string `json:"width"`
	Height  string `json:"height"`
}

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func Wshandler(w http.ResponseWriter, r *http.Request) {
	conn, err := wsupgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to set websocket upgrade: %+v", err)
		return
	}
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()
	for {
		select {
		case t := <-ticker.C:
			conn.WriteMessage(websocket.TextMessage, []byte(t.String()))
		}
	}
	//何か受け取ってそのまま返すパターン
	/*
		for {
			t, msg, err := conn.ReadMessage()
			if err != nil {
				break
			}
			conn.WriteMessage(t, msg)
		}
	*/
}

func GETStickyNoteHandler(useCase usecase.SNUseCase) gin.HandlerFunc {
	return func(c *gin.Context) {
		uid := c.Request.Header.Get("uid")
		snotes, err := useCase.FetchSNotes(uid)
		if err != nil {

		}
		SuccessResponse(c, snotes)

	}
}

func POSTStickyNoteHandler(useCase usecase.SNUseCase) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req POSTStickyNote
		if err := c.ShouldBindJSON(&req); err != nil {
			// TODO: エラー設計
			fmt.Println(err)
			// c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ErrorResponse(c, "ok", err)
			return
		}
		uid := c.Request.Header.Get("uid")
		err := useCase.CreateNotes(models.StickyNotes{
			ID:      req.ID,
			UID:     string(uid),
			GroupID: req.GroupID,
			Value:   req.Value,
			X:       req.X,
			Y:       req.Y,
			Width:   req.Width,
			Height:  req.Height,
		})
		if err != nil {
			fmt.Println(err)
			ErrorResponse(c, "ok", err)
		}

		SuccessResponse(c, err)

	}
}

func PUTStickyNoteHandler(useCase usecase.SNUseCase) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req POSTStickyNote
		if err := c.ShouldBindJSON(&req); err != nil {
			// TODO: エラー設計
			fmt.Println(err)
			// c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ErrorResponse(c, "ok", err)
			return
		}
		uid := c.Request.Header.Get("uid")
		err := useCase.UpdateNotes(models.StickyNotes{
			ID:      req.ID,
			UID:     string(uid),
			GroupID: req.GroupID,
			Value:   req.Value,
			X:       req.X,
			Y:       req.Y,
			Width:   req.Width,
			Height:  req.Height,
		})
		if err != nil {
			fmt.Println(err)
			ErrorResponse(c, "err", err)
		}

		SuccessResponse(c, err)

	}
}
