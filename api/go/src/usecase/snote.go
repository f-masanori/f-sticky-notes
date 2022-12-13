package usecase

import (
	"github.com/f-masanori/linqumate-auth/src/domain/models"
	"github.com/f-masanori/linqumate-auth/src/domain/repository"
)

type SNUseCase struct {
	repo repository.SNRepository
}

func NewSNUseCase(repo repository.SNRepository) SNUseCase {
	useCase := SNUseCase{repo: repo}
	return useCase
}

func (u *SNUseCase) FetchSNotes(uid string) (*[]models.StickyNotes, error) {
	sn, err := u.repo.FetchNotes(uid)
	if err != nil {
		return nil, err
	}
	return sn, nil
}

func (u *SNUseCase) CreateNotes(sn models.StickyNotes) error {
	err := u.repo.CreateNotes(sn)
	if err != nil {
		return err
	}
	return nil
}

func (u *SNUseCase) UpdateNotes(sn models.StickyNotes) error {
	err := u.repo.UpdateNotes(sn)
	if err != nil {
		return err
	}
	return nil
}
