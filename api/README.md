# 付箋アプリ バックエンド API

## ローカル立ち上げ手順

1. DB のマイグレーション
   DB マイグレーションコンテナに入り以下のコマンドを実行

```
$ migrate -database ${MYSQL_URL} -path /tmp/migrations up
```

2. docker を立ち上げる

```
$ docker-compose up
```

## DB のテーブルの追加するとき

- DB のマイグレーション
  DB マイグレーションコンテナに入る

```
$ docker exec -it rdb_migrate /bin/bash
```

以下のコマンドを実行

```

$ migrate create -ext sql -dir /tmp/migrations -seq (sqlファイル名)
```
