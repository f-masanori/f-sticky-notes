package usecase

import (
	"github.com/f-masanori/linqumate-auth/src/domain/models"
	"github.com/f-masanori/linqumate-auth/src/domain/repository"
)

type SNGroupUseCase struct {
	repo   repository.SNGroupRepository
	SNrepo repository.SNRepository
}

func NewSNGroupUseCase(repo repository.SNGroupRepository, SNrepo repository.SNRepository) SNGroupUseCase {
	useCase := SNGroupUseCase{repo: repo, SNrepo: SNrepo}
	return useCase
}

func (u *SNGroupUseCase) FetchSNoteGroups(uid string) (*[]models.StickyNoteGroup, error) {
	sn, err := u.repo.FetchGroups(uid)
	if err != nil {
		return nil, err
	}
	return sn, nil
}

func (u *SNGroupUseCase) CreateSNoteGroups(uid string) (*models.StickyNoteGroup, error) {
	sn, err := u.repo.CreateGroup(uid)
	if err != nil {
		return nil, err
	}
	return sn, nil
}

func (u *SNGroupUseCase) UpdateSNoteGroups(uid, id, label string) (*models.StickyNoteGroup, error) {
	sn, err := u.repo.UpdateGroup(uid, id, label)
	if err != nil {
		return nil, err
	}
	return sn, nil
}
