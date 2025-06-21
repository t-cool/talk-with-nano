let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
    populateVoiceList();
};

function populateVoiceList() {
    const selectedLang = languageSelection.value;
    voices = window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith(selectedLang.split('-')[0]));
    voiceSelection.innerHTML = voices.map((voice, index) => `<option value="${index}">${voice.name}</option>`).join('');
}

languageSelection.addEventListener('change', populateVoiceList);

populateVoiceList();