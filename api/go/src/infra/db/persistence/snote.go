package persistence

import (
	"fmt"
	"time"

	"github.com/f-masanori/linqumate-auth/src/domain/models"
	repo "github.com/f-masanori/linqumate-auth/src/domain/repository"
	"gorm.io/gorm"
)

type SNRepositoryImpl struct {
	db *gorm.DB
}

func NewSNRepositoryImpl(db *gorm.DB) repo.SNRepository {
	r := SNRepositoryImpl{db: db}
	return &r
}

func (r *SNRepositoryImpl) FetchNotes(uid string) (*[]models.StickyNotes, error) {
	result := []models.StickyNotes{}
	if result := r.db.Table("sticky_notes").Find(&result, "uid = ?", uid); result.Error != nil {
		return nil, result.Error
	}

	fmt.Println(result)

	return &result, nil
}

type StickyNotes struct {
	ID        string `gorm:"primaryKey"`
	GroupID   string
	UID       string
	Value     string
	X         int
	Y         int
	Width     string
	Height    string
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (r *SNRepositoryImpl) CreateNotes(sn models.StickyNotes) error {
	if result := r.db.Create(&StickyNotes{
		ID:      sn.ID,
		UID:     sn.UID,
		GroupID: sn.GroupID,
		Value:   sn.Value,
		X:       sn.X,
		Y:       sn.Y,
		Width:   sn.Width,
		Height:  sn.Height,
	}); result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *SNRepositoryImpl) UpdateNotes(sn models.StickyNotes) error {
	if result := r.db.Table("sticky_notes").Updates(&StickyNotes{
		ID:      sn.ID,
		UID:     sn.UID,
		GroupID: sn.GroupID,
		Value:   sn.Value,
		X:       sn.X,
		Y:       sn.Y,
		Width:   sn.Width,
		Height:  sn.Height,
	}); result.Error != nil {
		fmt.Println(result.Error)
		return result.Error
	}
	return nil
}
