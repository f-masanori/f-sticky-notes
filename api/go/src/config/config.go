package config

import (
	"embed"
	"os"

	"github.com/BurntSushi/toml"
)

const (
	confLocalPath = "/src/app/src/config/toml/"
)

type PostgresqlConfig struct {
	Port        string `toml:"port"`
	Host        string `toml:"host"`
	User        string `toml:"user"`
	Password    string `toml:"password"`
	DBName      string `toml:"db_name"`
	SSLMode     string `toml:"ssl_mode"`
	GormLogMode bool   `toml:"gorm_log_mode"`
}

type Configs struct {
	DB PostgresqlConfig `toml:"db"`
}

var Conf Configs

//go:embed toml/local.toml toml/prod.toml
var configData embed.FS

func InitConf() {
	env := os.Getenv("ENV")
	if env == "" {
		panic("環境変数 ENV が設定されていません。")
	}

	var path string = "toml/" + env + ".toml"

	var conf Configs
	f, err := configData.ReadFile(path)
	if err != nil {
		panic(err)
	}
	_, err = toml.Decode(string(f), &conf)
	if err != nil {
		panic(err)
	}

	Conf.DB = conf.DB
}
