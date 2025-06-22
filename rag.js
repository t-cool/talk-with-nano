// RAG (Retrieval-Augmented Generation) システム
class ConversationRAG {
    constructor() {
        this.conversations = [];
        this.maxConversations = 100; // 最大保持する対話数
        this.summarizer = null;
        this.summaryHistory = []; // 要約履歴を保存
        this.maxSummaryHistory = 10; // 最大保持する要約履歴数
        this.initializeSummarizer();
    }

    async initializeSummarizer() {
        try {
            console.log('=== Initializing Summarizer ===');
            console.log('window.ai available:', typeof window.ai !== 'undefined');
            console.log('window.ai.summarizer available:', typeof window.ai !== 'undefined' && !!window.ai.summarizer);
            
            if (typeof window.ai !== 'undefined' && window.ai.summarizer) {
                console.log('Creating summarizer...');
                this.summarizer = await window.ai.summarizer.create();
                console.log('Summarization API initialized successfully');
            } else {
                console.error('window.ai.summarizer is not available - API not supported');
                this.summarizer = null;
            }
        } catch (error) {
            console.error('Failed to initialize Summarization API:', error);
            this.summarizer = null;
        }
    }

    // 対話を記録
    addConversation(userInput, aiResponse) {
        console.log('=== Adding conversation ===');
        console.log('User input:', userInput);
        console.log('AI response:', aiResponse);
        
        const conversation = {
            timestamp: new Date().toISOString(),
            user: userInput,
            ai: aiResponse
        };

        this.conversations.push(conversation);
        console.log('Total conversations:', this.conversations.length);

        // 最大数を超えた場合は古いものを削除
        if (this.conversations.length > this.maxConversations) {
            this.conversations.shift();
            console.log('Removed oldest conversation, new total:', this.conversations.length);
        }
    }

    // 要約履歴を追加
    addSummaryHistory(summary) {
        const summaryRecord = {
            timestamp: new Date().toISOString(),
            summary: summary,
            conversationCount: this.conversations.length
        };

        this.summaryHistory.push(summaryRecord);

        // 最大数を超えた場合は古いものを削除
        if (this.summaryHistory.length > this.maxSummaryHistory) {
            this.summaryHistory.shift();
        }
    }

    // 最新の要約を取得
    getLatestSummary() {
        if (this.summaryHistory.length === 0) {
            return null;
        }
        return this.summaryHistory[this.summaryHistory.length - 1].summary;
    }

    // 文脈を取得（要約機能付き）
    async getContext() {
        console.log('=== RAG getContext() called ===');
        console.log('Conversations count:', this.conversations.length);
        console.log('Summary history count:', this.summaryHistory.length);
        
        if (this.conversations.length === 0) {
            console.log('No conversations found, returning empty string');
            return '';
        }

        // 対話履歴をテキストに変換
        const conversationText = this.conversations
            .map(conv => `User: ${conv.user}\nAI: ${conv.ai}`)
            .join('\n\n');
        
        console.log('Conversation text length:', conversationText.length);
        console.log('Conversation text preview:', conversationText.substring(0, 200) + '...');

        // Summarization APIが利用可能でない場合は初期化を再試行
        if (!this.summarizer) {
            console.log('Summarizer not available, attempting to initialize...');
            await this.initializeSummarizer();
        }

        console.log('Summarizer available:', !!this.summarizer);

        // 必ずSummarization APIで要約を実行
        if (this.summarizer) {
            try {
                console.log('Attempting to summarize...');
                const summary = await this.summarizer.summarize(conversationText);
                console.log('Summarization successful:', summary);
                // 要約成功時は履歴に保存
                this.addSummaryHistory(summary);
                return `Previous conversation summary: ${summary}`;
            } catch (error) {
                console.error('Summarization failed, retrying...', error);
                // 一度だけ再試行
                try {
                    console.log('Retrying summarization...');
                    await this.initializeSummarizer();
                    if (this.summarizer) {
                        const summary = await this.summarizer.summarize(conversationText);
                        console.log('Retry summarization successful:', summary);
                        // 再試行成功時も履歴に保存
                        this.addSummaryHistory(summary);
                        return `Previous conversation summary: ${summary}`;
                    }
                } catch (retryError) {
                    console.error('Summarization retry failed:', retryError);
                }
                
                // 要約が完全に失敗した場合は直前の要約を使用
                const latestSummary = this.getLatestSummary();
                if (latestSummary) {
                    console.log('Using previous summary due to summarization failure:', latestSummary);
                    return `Previous conversation summary: ${latestSummary}`;
                }
            }
        }

        // Summarization APIが利用できず、履歴もない場合
        const latestSummary = this.getLatestSummary();
        if (latestSummary) {
            console.log('Using previous summary due to API unavailability:', latestSummary);
            return `Previous conversation summary: ${latestSummary}`;
        }

        // 最初の要約も存在しない場合のフォールバック
        console.error('No summarization available and no previous summary found.');
        return 'Previous conversation summary: No summary available - this is the first conversation.';
    }

    // フォールバック用の文脈取得（要約なし）
    getFallbackContext() {
        if (this.conversations.length === 0) {
            return '';
        }

        // 適切な数の最新対話を選択（最大5件または文字数制限）
        let recentConversations = [];
        let totalLength = 0;
        const maxLength = 400; // 文脈の最大文字数
        const maxCount = Math.min(5, this.conversations.length);

        // 最新の対話から順に追加（文字数制限内で）
        for (let i = this.conversations.length - 1; i >= 0 && recentConversations.length < maxCount; i--) {
            const conv = this.conversations[i];
            const convText = `User: ${conv.user}\nAI: ${conv.ai}`;
            
            if (totalLength + convText.length <= maxLength) {
                recentConversations.unshift(conv);
                totalLength += convText.length;
            } else {
                break;
            }
        }

        if (recentConversations.length === 0) {
            // 最低1件は含める（最新のもの）
            recentConversations = [this.conversations[this.conversations.length - 1]];
        }

        const contextText = recentConversations
            .map(conv => `User: ${conv.user}\nAI: ${conv.ai}`)
            .join('\n');

        return `Previous conversation: ${contextText}`;
    }

    // 対話履歴をクリア
    clearConversations() {
        this.conversations = [];
    }

    // 要約履歴をクリア
    clearSummaryHistory() {
        this.summaryHistory = [];
    }

    // すべての履歴をクリア
    clearAllHistory() {
        this.conversations = [];
        this.summaryHistory = [];
    }

    // 対話履歴を取得
    getConversations() {
        return this.conversations;
    }

    // 要約履歴を取得
    getSummaryHistory() {
        return this.summaryHistory;
    }

    // デバッグ用：Summarization APIをテスト
    async testSummarization() {
        console.log('=== Testing Summarization API ===');
        
        if (!this.summarizer) {
            console.log('Initializing summarizer for test...');
            await this.initializeSummarizer();
        }
        
        if (this.summarizer) {
            try {
                const testText = "This is a test conversation. User asked about the weather. AI responded that it's sunny today. User then asked about the time. AI said it's 3 PM.";
                console.log('Testing with text:', testText);
                const summary = await this.summarizer.summarize(testText);
                console.log('Test summarization result:', summary);
                return summary;
            } catch (error) {
                console.error('Test summarization failed:', error);
                return null;
            }
        } else {
            console.error('Summarizer not available for testing');
            return null;
        }
    }
}

// グローバルインスタンス
const conversationRAG = new ConversationRAG();
