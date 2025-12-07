import { questions, results } from './data.js';

class CareerTestApp {
    constructor() {
        this.score = 0; // Counts number of 'A' choices
        this.currentQuestionIndex = 0;

        // DOM Elements
        this.dom = {
            startScreen: document.getElementById('start-screen'),
            questionScreen: document.getElementById('question-screen'),
            resultScreen: document.getElementById('result-screen'),
            startBtn: document.getElementById('start-btn'),
            retryBtn: document.getElementById('retry-btn'),
            shareBtn: document.getElementById('share-btn'),

            questionText: document.getElementById('question-text'),
            optionA: document.querySelector('button[data-value="A"]'),
            optionB: document.querySelector('button[data-value="B"]'),
            optionAText: document.getElementById('option-a-text'),
            optionBText: document.getElementById('option-b-text'),

            progressFill: document.getElementById('progress-fill'),
            questionCount: document.getElementById('question-count'),

            resultTitle: document.getElementById('result-title'),
            resultDesc: document.getElementById('result-desc'),
            resultJob: document.getElementById('result-job')
        };

        this.init();
    }

    init() {
        this.dom.startBtn.addEventListener('click', () => this.startTest());
        this.dom.retryBtn.addEventListener('click', () => this.resetTest());
        this.dom.shareBtn.addEventListener('click', () => this.shareResult());

        [this.dom.optionA, this.dom.optionB].forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e.currentTarget.dataset.value));
        });
    }

    async switchScreen(fromScreen, toScreen) {
        if (fromScreen) {
            fromScreen.classList.add('fade-out');
            await new Promise(r => setTimeout(r, 500)); // Wait for fade out
            fromScreen.classList.remove('active', 'fade-out');
        }

        // Use a small delay for smooth transition feel
        if (toScreen) {
            toScreen.style.display = 'flex'; // Ensure flex display for opacity transition
            // Force reflow
            void toScreen.offsetWidth;
            toScreen.classList.add('active');
        }
    }

    startTest() {
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.loadQuestion();
        this.switchScreen(this.dom.startScreen, this.dom.questionScreen);
    }

    loadQuestion() {
        const question = questions[this.currentQuestionIndex];

        // Animate text change
        this.dom.questionText.style.opacity = 0;
        this.dom.optionAText.style.opacity = 0;
        this.dom.optionBText.style.opacity = 0;

        setTimeout(() => {
            this.dom.questionText.textContent = question.text;
            this.dom.optionAText.textContent = question.choiceA;
            this.dom.optionBText.textContent = question.choiceB;

            // Update progress
            const progress = ((this.currentQuestionIndex + 1) / questions.length) * 100;
            this.dom.progressFill.style.width = `${progress}%`;
            this.dom.questionCount.textContent = `Q.${this.currentQuestionIndex + 1} / ${questions.length}`;

            this.dom.questionText.style.opacity = 1;
            this.dom.optionAText.style.opacity = 1;
            this.dom.optionBText.style.opacity = 1;
        }, 300);
    }

    handleAnswer(choice) {
        // Add score if A is chosen
        if (choice === 'A') {
            this.score++;
        }

        // Move to next question or result
        if (this.currentQuestionIndex < questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
        } else {
            this.showResult();
        }
    }

    showResult() {
        const resultType = this.calculateResult();
        const data = results[resultType];

        this.dom.resultTitle.textContent = data.title;
        this.dom.resultDesc.textContent = data.desc;
        this.dom.resultJob.textContent = data.job;

        this.switchScreen(this.dom.questionScreen, this.dom.resultScreen);
    }

    calculateResult() {
        // Logic: 0-1 As -> type0, 2 As -> type1, 3 As -> type2, 4-5 As -> type3
        if (this.score <= 1) return 'type0';
        if (this.score === 2) return 'type1';
        if (this.score === 3) return 'type2';
        return 'type3';
    }

    resetTest() {
        this.switchScreen(this.dom.resultScreen, this.dom.startScreen);
    }

    shareResult() {
        const title = this.dom.resultTitle.textContent;
        const text = `私のキャリア・ポテンシャル診断結果は【${title}】でした！ #キャリア診断`;

        if (navigator.share) {
            navigator.share({
                title: 'キャリア・ポテンシャル診断',
                text: text,
                url: window.location.href,
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(`${text} ${window.location.href}`)
                .then(() => alert('結果をクリップボードにコピーしました！'));
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new CareerTestApp();
});
