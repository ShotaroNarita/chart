# CLI Interface

Following command generates svg file

```sh
miomonchart generate \
    --type band \
    --source data.yaml \
    --style style.yaml
```

# Web UI

cd web
npm run dev      # 開発サーバー起動（http://localhost:5173）
npm run build    # S3 デプロイ用のプロダクションビルド（web/dist/ に出力）
