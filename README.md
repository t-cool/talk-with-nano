# Gemini Nano Integration

音声認識とGemini Nanoを組み合わせた音声対話アプリケーションです。ユーザーの音声入力をテキストに変換し、Gemini Nanoで応答を生成して音声で返答します。

## 機能

- **音声認識**: Web Speech APIを使用した音声入力
- **AI応答**: Gemini Nanoによる自然な会話応答
- **音声合成**: 多言語対応の音声出力
- **音声選択**: 様々な音声の選択が可能

## 必要な環境

### ブラウザ要件
- **Chrome Canary** (推奨)
- または **Chrome Dev** / **Chrome Beta**

### システム要件
- Windows 10/11, macOS 10.15+, または Linux
- 最低4GB RAM (8GB推奨)
- インターネット接続 (初回セットアップ時)

## セットアップ手順

### 1. Chrome Canaryのインストール

Chrome Canaryをダウンロード・インストールしてください：
- [Chrome Canary ダウンロード](https://www.google.com/intl/ja/chrome/canary/)

### 2. Gemini Nano機能の有効化

以下の手順でGemini Nanoを有効化してください：

#### 2.1 Optimization Guide フラグを有効化
1. `chrome://flags/#optimization-guide-on-device-model` にアクセス
2. 設定を **Default** から **Enabled BypassPerfRequirement** に変更

#### 2.2 Prompt API フラグを有効化
1. `chrome://flags/#prompt-api-for-gemini-nano` にアクセス
2. 設定を **Default** から **Enabled** に変更

### 3. ブラウザの再起動
設定変更後、Chrome Canaryを完全に再起動してください。

### 4. モデルコンポーネントのインストール
1. `chrome://components/` にアクセス
2. **Optimization Guide On Device Model** を見つける
3. **アップデートを確認** ボタンをクリック
4. モデルのダウンロードが完了するまで待機（数分かかる場合があります）

## 使い方

### 1. アプリケーションの起動
1. `index.html` をブラウザで開く
2. マイクアクセスの許可を求められた場合は **許可** をクリック

### 2. 基本的な使用方法
1. **言語選択**: ドロップダウンから使用する言語を選択
2. **音声選択**: 好みの音声を選択
3. **開始**: 「Start Listening」ボタンをクリック
4. **話す**: マイクに向かって話しかける
5. **応答**: AIが音声で応答します

### 3. 操作ボタン
- **Start Listening**: 音声認識を開始
- **Stop Listening**: 音声認識を停止
- **Clear Log**: 会話ログをクリア

## トラブルシューティング

### よくある問題

#### Gemini Nanoが利用できない場合
- ブラウザのフラグ設定を再確認
- Chrome Canaryを最新版に更新
- `chrome://components/` でモデルが正しくインストールされているか確認

#### 音声認識が動作しない場合
- マイクの接続を確認
- ブラウザにマイクアクセス権限が付与されているか確認
- HTTPSでアクセスしているか確認（ローカルファイルの場合は問題なし）

#### 音声出力が聞こえない場合
- スピーカー/ヘッドフォンの接続を確認
- ブラウザの音量設定を確認
- 選択した音声が利用可能か確認

### エラーメッセージと対処法

- **"On-device AI is not available"**: Gemini Nanoの設定を再確認
- **"Model is downloading"**: しばらく待ってから再試行
- **"Access denied"**: ブラウザの権限設定を確認

## 技術仕様

### 使用技術
- **Web Speech API**: 音声認識
- **Gemini Nano**: オンデバイスAI
- **Speech Synthesis API**: 音声合成
- **Vanilla JavaScript**: フロントエンド実装

### ブラウザサポート
- Chrome Canary ✅
- Chrome Dev/Beta ✅
- Chrome Stable ❌ (Gemini Nano未対応)
- Firefox ❌
- Safari ❌

## ライセンス

MIT
