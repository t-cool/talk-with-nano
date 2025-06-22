const log = document.getElementById('log');// チャット画面
const startButton = document.getElementById('start');// 開始ボタン
const stopButton = document.getElementById('stop');// 停止ボタン
const clearHistoryButton = document.getElementById('clearHistory');// 履歴クリアボタン
const voiceSelection = document.getElementById('voiceSelection');// 音声選択
const languageSelection = document.getElementById('languageSelection'); // 言語選択
let listening = false;// 音声認識中かの判定
let recognition; // 音声認識のための変数

startButton.addEventListener('click', () => {
    if (listening) return;
    listening = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    log.innerHTML += '<p>Listening...</p>';
    getVoiceInput();
});

stopButton.addEventListener('click', () => {
    if (!listening) return;
    recognition.stop();
    listening = false;
    startButton.disabled = false;
    stopButton.disabled = true;
    log.innerHTML += '<p>Stopped listening.</p>';
});