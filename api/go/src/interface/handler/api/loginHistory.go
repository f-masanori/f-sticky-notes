package api

import (
	"fmt"

	"github.com/f-masanori/linqumate-auth/src/domain/models"
	"github.com/f-masanori/linqumate-auth/src/usecase"
	"github.com/f-masanori/linqumate-auth/src/utils"
	"github.com/gin-gonic/gin"
)

func PUTLoginHistory(useCase usecase.LoginHistoryUseCase, SNUsecase usecase.SNUseCase, SNGroupUsecase usecase.SNGroupUseCase) gin.HandlerFunc {
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
		isFirstLogin, err := useCase.IsFirstTimeLogin(uid)
		if err != nil {
			fmt.Println(err)
			ErrorResponse(c, "err", err)
		}
		if isFirstLogin {
			// 初期化
			sng, err := SNGroupUsecase.CreateSNoteGroups(uid)
			if err != nil {
				fmt.Println(err)
				ErrorResponse(c, "err", err)
			}
			snID, err := utils.MakeRandomStr(10)
			if err != nil {
				fmt.Println(err)
				ErrorResponse(c, "err", err)
			}

			sampleSN := &models.StickyNotes{
				ID:      snID,
				UID:     uid,
				GroupID: sng.ID,
				Height:  "200px",
				Width:   "200px",
				X:       20,
				Y:       30,
				Value:   "",
			}
			SNUsecase.CreateNotes(*sampleSN)
		} else {
			// loginHistoryに追加
		}

		SuccessResponse(c, err)

	}
}
