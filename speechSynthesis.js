async function readAloudTexts() {
    const lastText = getLastUserInput();

    if (typeof LanguageModel === 'undefined' || typeof LanguageModel.create === 'undefined') {
        const message = "On-device AI (Gemini Nano) is not available or not enabled in your browser. Please ensure you are using a compatible browser (e.g., Chrome Canary with experimental AI features enabled) and that the feature is active.";
        console.warn(message);
        // We need to call the actual speakResponse function, not pass an utterance object directly
        _speakActualResponse(message);
        if (listening) { // Stop the listening loop
            recognition.stop();
            listening = false;
            startButton.disabled = false;
            stopButton.disabled = true;
            log.innerHTML += `<p>Stopped listening: On-device AI not available.</p>`;
        }
        return;
    }

    try {
        const session = await LanguageModel.create({
            maxTokens: 20 // 約50文字程度に制限
        });
        const response = await session.prompt(`${lastText}。短く簡潔に20文字以内で答えてください。`);
        _speakActualResponse(response); // Use the helper for actual speaking
        session.destroy(); // Clean up the session
    } catch (error) {
        console.error("Error interacting with on-device AI model (Gemini Nano):", error);
        let userMessage = "Sorry, I encountered an error with the on-device AI.";
        if (error.message.toLowerCase().includes("model availability") || error.message.toLowerCase().includes("failed to initialize")) {
            userMessage = "The AI model is currently unavailable or failed to initialize. It might be downloading or encountered an issue. Please try again in a few moments, or ensure browser AI features are correctly set up.";
        } else if (error.message.toLowerCase().includes("denied by user")) {
            userMessage = "Access to the AI model was denied. Please check browser permissions.";
        } else if (error.message.toLowerCase().includes("unknown error")) {
            userMessage = "An unknown error occurred with the on-device AI. Make sure experimental AI features are enabled in your browser.";
        }
        _speakActualResponse(userMessage);
        if (listening) { // Stop the listening loop on error
            recognition.stop();
            listening = false;
            startButton.disabled = false;
            stopButton.disabled = true;
            log.innerHTML += `<p>Stopped listening due to AI error: ${error.message}</p>`;
        }
    }
}

function getLastUserInput() {
    return log.textContent.split('You :').pop().split('\n')[0].trim();
}

// Renamed original speakResponse to avoid confusion and changed its parameter
function _speakActualResponse(textToSpeak) {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = languageSelection.value; // 言語選択の値を使用
    utterance.text = textToSpeak;

    const selectedVoice = voices[voiceSelection.value];
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
        // Only continue listening if AI was successfully used or if explicitly decided
        // The guard clause and error handling above now manage stopping the loop.
        if (listening) getVoiceInput();
    };

    log.innerHTML += `<p>Sim : ${textToSpeak}</p>`;
    window.speechSynthesis.speak(utterance);
}
