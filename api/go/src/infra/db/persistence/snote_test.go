package persistence

import (
	"fmt"
	"testing"

	"github.com/f-masanori/linqumate-auth/src/config"
	"github.com/f-masanori/linqumate-auth/src/infra/db"
)

func Test_FetchNotes(t *testing.T) {
	config.InitConf()
	gormDB := db.GetDBConnection()
	r := NewSNRepositoryImpl(gormDB)
	got, err := r.FetchNotes("")
	fmt.Println(got)
	fmt.Println(err)

}
