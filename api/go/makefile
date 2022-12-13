.PHONY: build_for_l
build_for_l:
	GOOS=linux GOARCH=amd64 go build main.go

.PHONY: rsyncMain
rsyncMain:
	rsync -auvz ./main conoha1Masanori:~/ 

.PHONY: deploy
deploy: build_for_l rsyncMain

