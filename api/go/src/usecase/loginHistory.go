package usecase

import (
	"github.com/f-masanori/linqumate-auth/src/domain/repository"
)

type LoginHistoryUseCase struct {
	repo repository.LoginHistoryRepository
}

func NewLoginHistoryUseCase(repo repository.LoginHistoryRepository) LoginHistoryUseCase {
	useCase := LoginHistoryUseCase{repo: repo}
	return useCase
}

func (u *LoginHistoryUseCase) IsFirstTimeLogin(uid string) (bool, error) {
	lh, err := u.repo.FetchLatestLoginHistory(uid)
	if err != nil {
		return false, err
	}
	if lh == nil {
		return true, nil
	}
	return false, nil
}

func (u *LoginHistoryUseCase) CreateUser(uid string) error {
	return u.repo.UpdateLoginHistory(uid)
}
