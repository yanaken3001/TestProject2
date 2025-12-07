// ==========================================
// DATA SECTION (Merged from data.js)
// ==========================================
const questions = [
    {
        id: 1,
        text: "仕事において、あなたはどちらを好みますか？",
        choiceA: "新しいアイデアをゼロから考える",
        choiceB: "既存の手順や仕組みを改善する",
        type: "creative_vs_logic"
    },
    {
        id: 2,
        text: "チームでの役割について、どちらが自分に近いですか？",
        choiceA: "先頭に立って皆を引っ張りたい",
        choiceB: "サポート役として皆を支えたい",
        type: "leader_vs_supporter"
    },
    {
        id: 3,
        text: "キャリアの選択において重視するのは？",
        choiceA: "リスクを取ってでも大きな挑戦",
        choiceB: "安定した環境での着実な成果",
        type: "risk_vs_stability"
    },
    {
        id: 4,
        text: "得意なアプローチはどちらですか？",
        choiceA: "データや数字に基づいた分析",
        choiceB: "人の感情や文脈を読み解くこと",
        type: "data_vs_emotion"
    },
    {
        id: 5,
        text: "作業スタイルの好みは？",
        choiceA: "ひとりで集中して没頭したい",
        choiceB: "チームで議論しながら進めたい",
        type: "solo_vs_team"
    }
];

const results = {
    // Simple logic: Predominantly A (Creative/Leader/Risk) vs B (Steady/Support/Logic)
    // For a 5-question simple test, we can just count As.
    // 0-1 As: The Steadfast Supporter
    // 2 As: The Analytical Balancer
    // 3 As: The Creative Strategist
    // 4-5 As: The Visionary Pioneer

    type0: {
        title: "堅実なサポーター",
        desc: "あなたは組織の縁の下の力持ち。安定感と誠実さでチームを支えることが得意です。ルールを守り、着実に成果を積み上げる姿勢は周囲から厚く信頼されています。",
        job: "事務管理、バックオフィス、品質管理など",
        stats: [2, 4, 3, 5, 5] // 独創性, 論理性, 行動力, 協調性, 持続力
    },
    type1: {
        title: "分析的なバランサー",
        desc: "冷静な視点と協調性を兼ね備えています。データに基づいた判断ができつつ、周囲との調和も大切にするため、プロジェクトの調整役として活躍できます。",
        job: "データアナリスト、社内SE、経理など",
        stats: [3, 5, 3, 4, 4]
    },
    type2: {
        title: "独創的なストラテジスト",
        desc: "既存の枠にとらわれないアイデアを持っています。リスクを恐れずに挑戦する姿勢と、周囲を巻き込む力のバランスが良く、企画や戦略立案に向いています。",
        job: "マーケティング、企画職、コンサルタントなど",
        stats: [5, 4, 4, 3, 3]
    },
    type3: {
        title: "革新的なビジョナリー",
        desc: "圧倒的な行動力とビジョンを持つリーダータイプ。新しい道を切り拓くことに喜びを感じます。起業家精神が旺盛で、困難な状況すら楽しむ強さがあります。",
        job: "起業家、事業責任者、クリエイティブディレクターなど",
        stats: [5, 3, 5, 2, 4]
    }
};

// ==========================================
// APP LOGIC SECTION
// ==========================================
class CareerTestApp {
    constructor() {
        this.score = 0; // Counts number of 'A' choices
        this.currentQuestionIndex = 0;
        this.chartInstance = null;

        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initDOM());
        } else {
            this.initDOM();
        }
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

            // Use specific selectors for options (safer)
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

        console.log("App Initialized");
        this.attachEvents();
    }

    attachEvents() {
        if (this.dom.startBtn) {
            this.dom.startBtn.onclick = () => {
                console.log("Start Clicked");
                this.startTest();
            };
        }

        if (this.dom.retryBtn) {
            this.dom.retryBtn.onclick = () => this.resetTest();
        }

        if (this.dom.shareBtn) {
            this.dom.shareBtn.onclick = () => this.shareResult();
        }

        // Option buttons
        [this.dom.optionA, this.dom.optionB].forEach(btn => {
            if (btn) {
                btn.onclick = (e) => {
                    const value = e.currentTarget.getAttribute('data-value');
                    console.log("Option Clicked:", value);
                    this.handleAnswer(value);
                };
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

        // Check if Chart is defined (loaded from CDN)
        if (typeof Chart === 'undefined') {
            console.error("Chart.js not loaded");
            return;
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

// Start App
new CareerTestApp();
