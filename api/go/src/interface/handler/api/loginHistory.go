package api

import (
	"errors"
	"fmt"

	"github.com/f-masanori/linqumate-auth/src/domain/models"
	"github.com/f-masanori/linqumate-auth/src/usecase"
	"github.com/f-masanori/linqumate-auth/src/utils"
	"github.com/gin-gonic/gin"
)

func POSTLoginHistoryHandler(useCase usecase.LoginHistoryUseCase, SNUsecase usecase.SNUseCase, SNGroupUsecase usecase.SNGroupUseCase) gin.HandlerFunc {
	return func(c *gin.Context) {
		uid := c.Request.Header.Get("uid")
		if uid == "" {
			ErrorResponse(c, "err", errors.New("uidがセットされていません。"))
			return
		}
		isFirstLogin, err := useCase.IsFirstTimeLogin(uid)
		if err != nil {
			fmt.Println(err)
			ErrorResponse(c, "err", err)
		}

		if isFirstLogin {
			// 初期化
			fmt.Println("初期化処理実行")
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
				X:       200,
				Y:       300,
				Value:   `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
			}
			SNUsecase.CreateNotes(*sampleSN)
			// loginHistoryに追加
			err = useCase.CreateUser(uid)
			if err != nil {
				ErrorResponse(c, "err", err)
				return
			}
		} else {
			// 更新処理
		}

		SuccessResponse(c, err)

	}
}
