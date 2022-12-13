package api

import (
	"fmt"

	"github.com/f-masanori/linqumate-auth/src/usecase"
	"github.com/gin-gonic/gin"
)

func GETStickyNoteGroupHandler(useCase usecase.SNGroupUseCase) gin.HandlerFunc {
	return func(c *gin.Context) {
		uid := c.Request.Header.Get("uid")
		snotes, err := useCase.FetchSNoteGroups(uid)
		if err != nil {
			ErrorResponse(c, "err", err)
		}
		SuccessResponse(c, snotes)
	}
}

func POSTStickyNoteGroupHandler(useCase usecase.SNGroupUseCase) gin.HandlerFunc {
	return func(c *gin.Context) {
		uid := c.Request.Header.Get("uid")
		snotes, err := useCase.CreateSNoteGroups(uid)
		if err != nil {
			ErrorResponse(c, "err", err)
		}
		SuccessResponse(c, snotes)
	}
}

type PUTStickyNoteGroup struct {
	GroupID string `json:"groupID"`
	Label   string `json:"label"`
}

func PUTStickyNoteGroupHandler(useCase usecase.SNGroupUseCase) gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO
		var req PUTStickyNoteGroup
		if err := c.ShouldBindJSON(&req); err != nil {
			// TODO: エラー設計
			fmt.Println(err)
			// c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			ErrorResponse(c, "ok", err)
			return
		}
		uid := c.Request.Header.Get("uid")
		snoteGroup, err := useCase.UpdateSNoteGroups(uid, req.GroupID, req.Label)
		if err != nil {
			ErrorResponse(c, "err", err)
		}
		SuccessResponse(c, snoteGroup)
	}
}
