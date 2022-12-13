package repository

import (
	"github.com/f-masanori/linqumate-auth/src/domain/models"
)

type SNRepository interface {
	FetchNotes(uid string) (*[]models.StickyNotes, error)
	CreateNotes(sn models.StickyNotes) error
	UpdateNotes(sn models.StickyNotes) error
}

type SNGroupRepository interface {
	FetchGroups(uid string) (*[]models.StickyNoteGroup, error)
	CreateGroup(uid string) (*models.StickyNoteGroup, error)
	UpdateGroup(uid, id, label string) (*models.StickyNoteGroup, error)
}

type LoginHistoryRepository interface {
	FetchLatestLoginHistory(uid string) (*models.LoginHistory, error)
	UpdateLoginHistory(uid string) error
}
