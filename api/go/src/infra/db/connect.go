package db

import (
	"fmt"

	"github.com/f-masanori/linqumate-auth/src/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func GetDBConnection() *gorm.DB {
	c := config.Conf.DB

	var db *gorm.DB

	var err error

	dsn := c.User + ":" + c.Password + "@" + "tcp(" + c.Host + ":" + c.Port + ")" + "/" + c.DBName + "?charset=utf8&parseTime=true&loc=Asia%2FTokyo"

	fmt.Println(dsn)
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println(err)
		panic("DBを開けません。")
	}

	return db
}
