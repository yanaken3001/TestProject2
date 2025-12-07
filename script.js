import { questions, results } from './data.js';

class CareerTestApp {
    constructor() {
        this.score = 0; // Counts number of 'A' choices
        this.currentQuestionIndex = 0;
        this.chartInstance = null;

        // Ensure DOM elements exist before accessing
        this.initDOM();
    }

    initDOM() {
        this.dom = {
            startScreen: document.getElementById('start-screen'),
            questionScreen: document.getElementById('question-screen'),
            resultScreen: document.getElementById('result-screen'),

            startBtn: document.getElementById('start-btn'),
            retryBtn: document.getElementById('retry-btn'),
            shareBtn: document.getElementById('share-btn'),

            questionText: document.getElementById('question-text'),

            // Use specific selectors for options
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

        // Debug check
        if (!this.dom.startBtn) console.error("Start button not found!");

        this.attachEvents();
    }

    attachEvents() {
        if (this.dom.startBtn) {
            this.dom.startBtn.addEventListener('click', () => {
                console.log("Start button clicked");
                this.startTest();
            });
        }

        if (this.dom.retryBtn) {
            this.dom.retryBtn.addEventListener('click', () => this.resetTest());
        }

        if (this.dom.shareBtn) {
            this.dom.shareBtn.addEventListener('click', () => this.shareResult());
        }

        // Option buttons
        [this.dom.optionA, this.dom.optionB].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    // Use toggle/debounce to prevent double clicks if needed
                    const value = e.currentTarget.getAttribute('data-value');
                    this.handleAnswer(value);
                });
            }
        });
    }

    async switchScreen(fromScreen, toScreen) {
        if (fromScreen) {
            fromScreen.classList.add('fade-out');
            await new Promise(r => setTimeout(r, 500));
            fromScreen.classList.remove('active', 'fade-out');
            fromScreen.style.display = 'none';
        }

        if (toScreen) {
            toScreen.style.display = 'flex';
            void toScreen.offsetWidth; // Force reflow
            toScreen.classList.add('active');
        }
    }

    startTest() {
        console.log("Starting test...");
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.loadQuestion();
        this.switchScreen(this.dom.startScreen, this.dom.questionScreen);
    }

    loadQuestion() {
        const question = questions[this.currentQuestionIndex];
        const card = document.querySelector('.question-card');

        // Reset animations
        if (card) {
            card.classList.remove('slide-in-right', 'slide-out-left');
            void card.offsetWidth;
            card.classList.add('slide-in-right');
        }

        this.dom.questionText.textContent = question.text;
        this.dom.optionAText.textContent = question.choiceA;
        this.dom.optionBText.textContent = question.choiceB;

        const progress = ((this.currentQuestionIndex + 1) / questions.length) * 100;
        this.dom.progressFill.style.width = `${progress}%`;
        this.dom.questionCount.textContent = `Q.${this.currentQuestionIndex + 1} / ${questions.length}`;
    }

    handleAnswer(choice) {
        if (choice === 'A') {
            this.score++;
        }

        const card = document.querySelector('.question-card');
        if (card) {
            card.style.transform = 'translateX(0)';
            card.classList.add('slide-out-left');
        }

        setTimeout(() => {
            if (this.currentQuestionIndex < questions.length - 1) {
                this.currentQuestionIndex++;
                this.loadQuestion();
            } else {
                this.showResult();
            }
        }, 400);
    }

    showResult() {
        const resultType = this.calculateResult();
        const data = results[resultType];

        this.dom.resultTitle.textContent = data.title;
        this.dom.resultDesc.textContent = data.desc;
        this.dom.resultJob.textContent = data.job;

        this.switchScreen(this.dom.questionScreen, this.dom.resultScreen);

        // Wait for screen to be visible before drawing chart
        setTimeout(() => {
            if (data.stats) {
                this.renderChart(data.stats);
            }
        }, 100);
    }

    renderChart(stats) {
        const canvas = document.getElementById('resultChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['独創性', '論理性', '行動力', '協調性', '持続力'],
                datasets: [{
                    label: 'Capability',
                    data: stats,
                    backgroundColor: 'rgba(0, 212, 255, 0.2)',
                    borderColor: '#00d4ff',
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00d4ff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: {
                            color: '#fff',
                            font: { size: 12, family: "'Noto Sans JP', sans-serif" }
                        },
                        ticks: { display: false, max: 5, min: 0 }
                    }
                },
                plugins: {
                    legend: { display: false }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutElastic'
                }
            }
        });
    }

    calculateResult() {
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
        const text = `私のキャリア・ポテンシャル診断結果は【${title}】でした！ #キャリア診断 #AI診断`;
        const url = window.location.href;

        const twitterBase = "https://twitter.com/intent/tweet";
        const shareUrl = `${twitterBase}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

        window.open(shareUrl, '_blank');
    }
}

// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new CareerTestApp();
});
