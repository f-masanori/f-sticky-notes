package persistence

import (
	"log"
	"time"

	"github.com/f-masanori/linqumate-auth/src/domain/models"
	repo "github.com/f-masanori/linqumate-auth/src/domain/repository"
	"gorm.io/gorm"
)

type LoginHistoryRepositoryImpl struct {
	db *gorm.DB
}

func NewLoginHistoryRepositoryImpl(db *gorm.DB) repo.LoginHistoryRepository {
	r := &LoginHistoryRepositoryImpl{db: db}
	return r
}

func (r *LoginHistoryRepositoryImpl) FetchLatestLoginHistory(uid string) (*models.LoginHistory, error) {
	result := []models.LoginHistory{}
	if result := r.db.Table("users").Find(&result, "uid = ?", uid); result.Error != nil {
		return nil, result.Error
	}

	if len(result) == 0 {
		return nil, nil
	}

	return &result[0], nil
}

type Users struct {
	UID        string `gorm:"primaryKey"`
	Name       string
	LoginCount int
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

func (r *LoginHistoryRepositoryImpl) UpdateLoginHistory(uid string) error {
	d := r.db.Table("users").Create(&Users{UID: uid, Name: uid, LoginCount: 1})
	if d.Error != nil {
		log.Println(d.Error)
		return d.Error
	}
	return nil
}
