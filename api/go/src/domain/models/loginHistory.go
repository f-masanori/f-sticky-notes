package models

type LoginHistory struct {
	UID     string `json:"uid" gorm:"primarykey"`
	UpdDate string `json:"update_date"`
}
