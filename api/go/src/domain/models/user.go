package models

type user struct {
	UserID string
	Password string
}

func CreateNewUser(userID string, password string) user {
	user := user{
		UserID: userID,
		Password: password,
	}
	return user
}