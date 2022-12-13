# 付箋アプリ バックエンド API

## ローカル立ち上げ手順

- DB のマイグレーション
  DB マイグレーションコンテナに入り以下のコマンドを実行

```
$ migrate -database ${MYSQL_URL} -path /tmp/migrations up
```
