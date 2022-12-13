package persistence

import (
	"fmt"

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
	result := models.LoginHistory{}
	if result := r.db.Table("users").First(&result, "uid = ?", uid); result.Error != nil {
		return nil, result.Error
	}

	fmt.Println(result)

	return &result, nil
}

func (r *LoginHistoryRepositoryImpl) UpdateLoginHistory(uid string) error {

	return nil
}
