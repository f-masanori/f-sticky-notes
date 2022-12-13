package models

// modelにgormを書くのはドメイン駆動設計に反するが面倒なので。。
type StickyNotes struct {
	ID      string `json:"id" gorm:"primarykey"`
	UID     string `json:"uid" gorm:"primarykey"`
	GroupID string `json:"groupID"`
	Value   string `json:"value"`
	X       int    `json:"x"`
	Y       int    `json:"y"`
	Width   string `json:"width"`
	Height  string `json:"height"`
}

type StickyNoteGroup struct {
	ID    string `json:"id" gorm:"primarykey"`
	UID   string `json:"uid" gorm:"primarykey"`
	Label string `json:"label"`
}
