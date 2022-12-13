package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	Success            ResponseStatus = 200
	InternalSeverError ResponseStatus = 500
)

type ResponseStatus int
type Response struct {
	Status        ResponseStatus `json:"status"`
	ErrorMassages []string       `json:"errorMassages"`
	Result        interface{}    `json:"result"`
}

func SuccessResponse(c *gin.Context, result interface{}) {
	c.Header("Content-Type", "application/json")
	output := Response{
		Status:        Success,
		ErrorMassages: []string{},
		Result:        result,
	}

	if gin.Mode() == gin.DebugMode {
		c.IndentedJSON(http.StatusOK, output)
	} else {
		c.JSON(http.StatusOK, output)
	}
}

// TODO: エラーの値に応じて分岐させる
func ErrorResponse(c *gin.Context, result interface{}, err error) {
	c.Header("Content-Type", "application/json")

	errMsgs := []string{err.Error()}

	output := Response{
		Status:        InternalSeverError,
		ErrorMassages: errMsgs,
		Result:        result,
	}

	if gin.Mode() == gin.DebugMode {
		c.IndentedJSON(http.StatusInternalServerError, output)
	} else {
		c.JSON(http.StatusInternalServerError, output)
	}
}
