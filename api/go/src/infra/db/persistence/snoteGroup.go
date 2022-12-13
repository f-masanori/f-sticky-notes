package persistence

import (
	"fmt"
	"time"

	"github.com/f-masanori/linqumate-auth/src/domain/models"
	"github.com/f-masanori/linqumate-auth/src/utils"

	repo "github.com/f-masanori/linqumate-auth/src/domain/repository"
	"gorm.io/gorm"
)

type SNGroupRepositoryImpl struct {
	db *gorm.DB
}

func NewSNGroupRepositoryImpl(db *gorm.DB) repo.SNGroupRepository {
	r := SNGroupRepositoryImpl{db: db}
	return &r
}

func (r *SNGroupRepositoryImpl) FetchGroups(uid string) (*[]models.StickyNoteGroup, error) {
	result := []models.StickyNoteGroup{}
	if result := r.db.Table("sticky_note_groups").Find(&result, "uid = ?", uid); result.Error != nil {
		return nil, result.Error
	}

	return &result, nil
}

type StickyNoteGroups struct {
	ID        string `gorm:"primaryKey"`
	UID       string
	Label     string
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (r *SNGroupRepositoryImpl) CreateGroup(uid string) (*models.StickyNoteGroup, error) {
	// TODO:グループIDの乱数の生成はドメインに寄せる
	id, err := utils.MakeRandomStr(10)
	if err != nil {
		return nil, err
	}
	if r := r.db.Table("sticky_note_groups").Create(&StickyNoteGroups{
		ID:    id,
		UID:   uid,
		Label: "sample",
	}); r.Error != nil {
		return nil, r.Error
	}
	result := models.StickyNoteGroup{
		ID:    id,
		UID:   uid,
		Label: "sample",
	}
	return &result, nil
}

func (r *SNGroupRepositoryImpl) UpdateGroup(uid, id, label string) (*models.StickyNoteGroup, error) {
	if r := r.db.Table("sticky_note_groups").Where("id=? and uid=?", id, uid).Update("label", label); r.Error != nil {
		fmt.Println(r.Error)
		return nil, r.Error
	}
	return nil, nil
}
