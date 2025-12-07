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
    });
