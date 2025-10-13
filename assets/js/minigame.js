/**
 * Mini Games Educational System
 * Version: 1.0.0
 * Author: IBME Lab
 */

(function() {
    'use strict';

    // Game Configuration
    const CONFIG = {
        MAX_QUESTIONS: 5,
        ANIMATION_DELAY: 1500,
        FEEDBACK_DELAY: 2000,
        PARTICLES_COUNT: 20
    };

    // Game State Manager
    class GameState {
        constructor() {
            this.score = 0;
            this.questionCount = 0;
            this.currentGame = null;
            this.gameHistory = [];
        }

        reset() {
            this.score = 0;
            this.questionCount = 0;
        }

        addScore(points = 1) {
            this.score += points;
            this.gameHistory.push({
                game: this.currentGame,
                score: this.score,
                timestamp: new Date()
            });
        }
    }

    // Game Manager Class
    class GameManager {
        constructor() {
            this.games = {
                count: new CountGame(),
                math: new MathGame(),
                sort: new SortGame(),
                racing: new RacingGame(),
                animal: new AnimalGame(),
                color: new ColorGame(),
                blocks: new BlocksGame(),
                solar: new SolarGame()
            };
            this.currentGame = null;
            this.modal = null;
            this.init();
        }

        init() {
            this.setupModal();
            this.bindEvents();
        }

        setupModal() {
            this.modal = document.getElementById('gameModal');
            if (!this.modal) {
                this.createModal();
            }
        }

        createModal() {
            const modal = document.createElement('div');
            modal.id = 'gameModal';
            modal.className = 'game-modal';
            modal.innerHTML = `
                <div class="game-modal-content">
                    <button class="game-modal-close">&times;</button>
                    <div id="gameContent"></div>
                </div>
            `;
            document.body.appendChild(modal);
            this.modal = modal;
        }

        bindEvents() {
            // Close button
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('game-modal-close')) {
                    this.closeGame();
                }
            });

            // Click outside modal
            this.modal?.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeGame();
                }
            });

            // ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeGame();
                }
            });
        }

        openGame(gameType) {
            if (this.games[gameType]) {
                this.currentGame = this.games[gameType];
                this.modal.classList.add('active');
                const content = document.getElementById('gameContent');
                content.innerHTML = '';
                this.currentGame.init(content);
                this.addSoundEffects();
            }
        }

        closeGame() {
            this.modal.classList.remove('active');
            if (this.currentGame && this.currentGame.cleanup) {
                this.currentGame.cleanup();
            }
            this.currentGame = null;
        }

        addSoundEffects() {
            // Add sound effects for better engagement
            this.sounds = {
                correct: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl9y+/XkyMFHm7A7+OZURE...'),
                wrong: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl...')
            };
        }
    }

    // Base Game Class
    class BaseGame {
        constructor() {
            this.state = new GameState();
            this.container = null;
        }

        init(container) {
            this.container = container;
            this.state.reset();
            this.render();
        }

        render() {
            // Override in child classes
        }

        cleanup() {
            // Override if needed
        }

        showFeedback(message, isCorrect) {
            const feedback = this.container.querySelector('.game-feedback');
            if (feedback) {
                feedback.textContent = message;
                feedback.className = 'game-feedback ' + (isCorrect ? 'success' : 'error');
                
                // Play sound
                if (window.gameManager && window.gameManager.sounds) {
                    const sound = isCorrect ? 
                        window.gameManager.sounds.correct : 
                        window.gameManager.sounds.wrong;
                    sound?.play().catch(() => {});
                }
            }
        }

        updateScore() {
            const scoreElement = this.container.querySelector('[id$="-score"]');
            if (scoreElement) {
                scoreElement.textContent = this.state.score;
            }
        }

        showEndGame() {
            const percentage = (this.state.score / CONFIG.MAX_QUESTIONS) * 100;
            let message = '';
            
            if (percentage === 100) message = '🏆 Xuất sắc! Hoàn hảo!';
            else if (percentage >= 80) message = '🌟 Tuyệt vời! Rất tốt!';
            else if (percentage >= 60) message = '👍 Tốt! Cố gắng thêm nhé!';
            else message = '💪 Cần luyện tập thêm!';

            this.container.innerHTML = `
                <div class="game-container" style="text-align: center;">
                    <h2>🎉 Hoàn thành! 🎉</h2>
                    <div style="font-size: 3rem; margin: 20px 0;">${this.getEndGameEmoji(percentage)}</div>
                    <h3>${message}</h3>
                    <p style="font-size: 1.5rem; margin: 20px 0;">
                        Điểm của bạn: <strong>${this.state.score}/${CONFIG.MAX_QUESTIONS}</strong>
                    </p>
                    <button class="game-btn" onclick="location.reload()" style="background: #e74c3c;">
                        🔄 Chơi lại
                    </button>
                </div>
            `;
        }

        getEndGameEmoji(percentage) {
            if (percentage === 100) return '🏆';
            if (percentage >= 80) return '🥇';
            if (percentage >= 60) return '🥈';
            if (percentage >= 40) return '🥉';
            return '🎯';
        }
    }

    // Count Game Implementation
    class CountGame extends BaseGame {
        constructor() {
            super();
            this.emojis = ['🍎','🐶','🌟','🎈','🍕','🐱','⚽','📚','🌈','🍦',
                          '🚗','🌺','🎨','🏀','🦋','🍪','🎮','🌙','🐠','🎵'];
        }

        render() {
            this.container.innerHTML = `
                <div id="count-game" class="game-container" style="text-align: center;">
                    <h2 style="color: #e74c3c;">🍎 Chọn Số Đếm 🍎</h2>
                    <div class="game-score">Điểm: <span id="count-score">0</span>/${CONFIG.MAX_QUESTIONS}</div>
                    <div class="items"></div>
                    <div class="game-feedback"></div>
                    <div id="count-options"></div>
                </div>
            `;
            this.generateQuestion();
        }

        generateQuestion() {
            if (this.state.questionCount >= CONFIG.MAX_QUESTIONS) {
                this.showEndGame();
                return;
            }

            const itemCount = Math.floor(Math.random() * 10) + 1;
            const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
            const itemsDiv = this.container.querySelector('.items');
            itemsDiv.innerHTML = '';

            // Animate items appearance
            for (let i = 0; i < itemCount; i++) {
                setTimeout(() => {
                    const span = document.createElement('span');
                    span.className = 'item';
                    span.textContent = emoji;
                    span.style.animationDelay = `${i * 0.1}s`;
                    itemsDiv.appendChild(span);
                }, i * 100);
            }

            // Generate options
            const options = this.generateOptions(itemCount);
            setTimeout(() => this.displayOptions(options, itemCount), itemCount * 100 + 200);
        }

        generateOptions(correct) {
            const options = new Set([correct]);
            while (options.size < 4) {
                const wrong = Math.max(1, correct + Math.floor(Math.random() * 5) - 2);
                options.add(wrong);
            }
            return Array.from(options).sort(() => Math.random() - 0.5);
        }

        displayOptions(options, correct) {
            const optionsDiv = this.container.querySelector('#count-options');
            optionsDiv.innerHTML = '';

            options.forEach((num, index) => {
                setTimeout(() => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn';
                    btn.textContent = num;
                    btn.onclick = () => this.handleAnswer(num, correct);
                    optionsDiv.appendChild(btn);
                }, index * 100);
            });

            this.container.querySelector('.game-feedback').textContent = '';
        }

        handleAnswer(selected, correct) {
            const buttons = this.container.querySelectorAll('.game-btn');
            buttons.forEach(btn => btn.disabled = true);

            const isCorrect = selected === correct;
            if (isCorrect) {
                this.state.addScore();
                this.showFeedback('✅ Đúng rồi! Tuyệt quá!', true);
            } else {
                this.showFeedback(`❌ Sai rồi! Đáp án đúng là ${correct}.`, false);
            }

            this.updateScore();
            this.state.questionCount++;
            setTimeout(() => this.generateQuestion(), CONFIG.ANIMATION_DELAY);
        }
    }

    // Math Game Implementation
    class MathGame extends BaseGame {
        render() {
            this.container.innerHTML = `
                <div id="math-game" class="game-container" style="text-align: center;">
                    <h2 style="color: #3498db;">➕ Làm Phép Toán ➖</h2>
                    <div class="game-score">Điểm: <span id="math-score">0</span>/${CONFIG.MAX_QUESTIONS}</div>
                    <div class="question">?</div>
                    <div class="game-feedback"></div>
                    <div id="math-options"></div>
                </div>
            `;
            this.generateQuestion();
        }

        generateQuestion() {
            if (this.state.questionCount >= CONFIG.MAX_QUESTIONS) {
                this.showEndGame();
                return;
            }

            const difficulty = Math.min(3, Math.floor(this.state.score / 2) + 1);
            const maxNum = 10 * difficulty;
            
            const num1 = Math.floor(Math.random() * maxNum) + 1;
            const num2 = Math.floor(Math.random() * (maxNum/2)) + 1;
            const operations = ['+', '-', '×'];
            const op = operations[Math.floor(Math.random() * Math.min(difficulty, operations.length))];
            
            let correctAnswer, expression;

            switch(op) {
                case '+':
                    correctAnswer = num1 + num2;
                    expression = `${num1} + ${num2} = ?`;
                    break;
                case '-':
                    const a = Math.max(num1, num2);
                    const b = Math.min(num1, num2);
                    correctAnswer = a - b;
                    expression = `${a} - ${b} = ?`;
                    break;
                case '×':
                    const mult1 = Math.floor(Math.random() * 10) + 1;
                    const mult2 = Math.floor(Math.random() * 10) + 1;
                    correctAnswer = mult1 * mult2;
                    expression = `${mult1} × ${mult2} = ?`;
                    break;
            }

            this.container.querySelector('.question').textContent = expression;
            this.displayOptions(correctAnswer);
        }

        displayOptions(correct) {
            const options = new Set([correct]);
            while (options.size < 4) {
                const variance = Math.floor(Math.random() * 10) - 5;
                const wrong = Math.max(0, correct + variance);
                options.add(wrong);
            }

            const optionsDiv = this.container.querySelector('#math-options');
            optionsDiv.innerHTML = '';

            Array.from(options).sort(() => Math.random() - 0.5).forEach((num, index) => {
                setTimeout(() => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn';
                    btn.textContent = num;
                    btn.onclick = () => this.handleAnswer(num, correct);
                    optionsDiv.appendChild(btn);
                }, index * 100);
            });

            this.container.querySelector('.game-feedback').textContent = '';
        }

        handleAnswer(selected, correct) {
            const buttons = this.container.querySelectorAll('.game-btn');
            buttons.forEach(btn => btn.disabled = true);

            const isCorrect = selected === correct;
            if (isCorrect) {
                this.state.addScore();
                this.showFeedback('✅ Đúng rồi! Giỏi quá!', true);
            } else {
                this.showFeedback(`❌ Sai rồi! Đáp án đúng là ${correct}.`, false);
            }

            this.updateScore();
            this.state.questionCount++;
            setTimeout(() => this.generateQuestion(), CONFIG.ANIMATION_DELAY);
        }
    }

    // Sort Game Implementation
    class SortGame extends BaseGame {
        render() {
            this.container.innerHTML = `
                <div class="game-container" style="text-align: center;">
                    <h2 style="color: #e74c3c;">🔢 Sắp Xếp Số 🔢</h2>
                    <p>Chọn các số theo thứ tự <b>tăng dần</b>!</p>
                    <div id="sort-numbers" style="margin: 20px 0;"></div>
                    <div class="game-feedback"></div>
                    <button class="game-btn" id="restart-btn" style="display: none;">Chơi lại</button>
                </div>
            `;
            this.generateNumbers();
        }

        generateNumbers() {
            const count = 5 + Math.floor(this.state.questionCount / 2);
            const numbers = [];
            
            for (let i = 0; i < count; i++) {
                numbers.push(Math.floor(Math.random() * 100) + 1);
            }

            this.sorted = [...numbers].sort((a, b) => a - b);
            this.shuffled = [...numbers].sort(() => Math.random() - 0.5);
            this.selectedOrder = [];
            
            this.displayNumbers();
        }

        displayNumbers() {
            const numsDiv = this.container.querySelector('#sort-numbers');
            numsDiv.innerHTML = '';

            this.shuffled.forEach((num, index) => {
                setTimeout(() => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn';
                    btn.textContent = num;
                    btn.dataset.value = num;
                    btn.onclick = () => this.selectNumber(btn, num);
                    numsDiv.appendChild(btn);
                }, index * 100);
            });
        }

        selectNumber(btn, num) {
            if (btn.disabled) return;

            btn.disabled = true;
            btn.style.background = '#95a5a6';
            this.selectedOrder.push(num);

            if (this.selectedOrder.length === this.shuffled.length) {
                this.checkOrder();
            }
        }

        checkOrder() {
            const isCorrect = this.selectedOrder.every((val, i) => val === this.sorted[i]);

            if (isCorrect) {
                this.state.addScore();
                this.showFeedback('✅ Tuyệt vời! Bạn đã sắp xếp đúng!', true);
                this.state.questionCount++;
                
                if (this.state.questionCount < CONFIG.MAX_QUESTIONS) {
                    setTimeout(() => this.generateNumbers(), CONFIG.FEEDBACK_DELAY);
                } else {
                    setTimeout(() => this.showEndGame(), CONFIG.FEEDBACK_DELAY);
                }
            } else {
                this.showFeedback('❌ Chưa đúng! Thứ tự đúng là: ' + this.sorted.join(', '), false);
                const restartBtn = this.container.querySelector('#restart-btn');
                restartBtn.style.display = 'inline-block';
                restartBtn.onclick = () => {
                    this.state.reset();
                    this.render();
                };
            }
        }
    }

    // Racing Game Implementation
    class RacingGame extends BaseGame {
        constructor() {
            super();
            this.position = 0;
            this.TRACK_LENGTH = 100;
        }

        render() {
            this.position = 0;
            this.container.innerHTML = `
                <div class="game-container" style="text-align: center;">
                    <h2 style="color: #f39c12;">🏁 Đua Xe Toán Học 🏁</h2>
                    <div class="race-track">
                        <div id="car">🏎️</div>
                        <div style="position: absolute; right: 10px; top: 20px; font-size: 40px;">🏁</div>
                    </div>
                    <div id="race-question" style="font-size: 2rem; color: #2c3e50; margin: 20px 0;">?</div>
                    <div class="game-feedback"></div>
                    <div id="race-options"></div>
                </div>
            `;
            this.generateQuestion();
        }

        generateQuestion() {
            const num1 = Math.floor(Math.random() * 15) + 1;
            const num2 = Math.floor(Math.random() * 15) + 1;
            const operations = ['+', '-'];
            const op = operations[Math.floor(Math.random() * operations.length)];
            
            let correct;
            if (op === '+') {
                correct = num1 + num2;
                this.container.querySelector('#race-question').textContent = `${num1} + ${num2} = ?`;
            } else {
                const a = Math.max(num1, num2);
                const b = Math.min(num1, num2);
                correct = a - b;
                this.container.querySelector('#race-question').textContent = `${a} - ${b} = ?`;
            }

            this.displayOptions(correct);
        }

        displayOptions(correct) {
            const options = [correct];
            for (let i = 0; i < 3; i++) {
                options.push(correct + Math.floor(Math.random() * 10) - 5);
            }

            const optionsDiv = this.container.querySelector('#race-options');
            optionsDiv.innerHTML = '';

            options.sort(() => Math.random() - 0.5).forEach(ans => {
                const btn = document.createElement('button');
                btn.className = 'game-btn';
                btn.textContent = ans;
                btn.onclick = () => this.handleAnswer(ans === correct);
                optionsDiv.appendChild(btn);
            });
        }

        handleAnswer(isCorrect) {
            const buttons = this.container.querySelectorAll('.game-btn');
            buttons.forEach(btn => btn.disabled = true);

            if (isCorrect) {
                this.position = Math.min(100, this.position + 20);
                this.container.querySelector('#car').style.left = this.position + '%';
                this.showFeedback('✅ Đúng! Xe tăng tốc!', true);

                if (this.position >= this.TRACK_LENGTH) {
                    setTimeout(() => {
                        this.container.querySelector('.game-feedback').innerHTML = 
                            '<h2 style="color:#27ae60">🎉 Bạn đã về đích! 🏆</h2>';
                        this.container.querySelector('#race-options').innerHTML = `
                            <button class="game-btn" onclick="location.reload()">Chơi lại</button>
                        `;
                    }, 500);
                } else {
                    setTimeout(() => this.generateQuestion(), CONFIG.ANIMATION_DELAY);
                }
            } else {
                this.showFeedback('❌ Sai rồi! Thử lại!', false);
                setTimeout(() => this.generateQuestion(), CONFIG.ANIMATION_DELAY);
            }
        }
    }

    // Animal Game Implementation
    class AnimalGame extends BaseGame {
        constructor() {
            super();
            this.animals = {
                land: [
                    {emoji: '🦁', name: 'Sư tử'},
                    {emoji: '🐯', name: 'Hổ'},
                    {emoji: '🐘', name: 'Voi'},
                    {emoji: '🦒', name: 'Hươu cao cổ'},
                    {emoji: '🦓', name: 'Ngựa vằn'}
                ],
                water: [
                    {emoji: '🐬', name: 'Cá heo'},
                    {emoji: '🐙', name: 'Bạch tuộc'},
                    {emoji: '🐠', name: 'Cá'},
                    {emoji: '🦈', name: 'Cá mập'},
                    {emoji: '🐋', name: 'Cá voi'}
                ],
                air: [
                    {emoji: '🦅', name: 'Đại bàng'},
                    {emoji: '🦋', name: 'Bướm'},
                    {emoji: '🐦', name: 'Chim'},
                    {emoji: '🦜', name: 'Vẹt'},
                    {emoji: '🦉', name: 'Cú'}
                ]
            };
        }

        render() {
            this.container.innerHTML = `
                <div class="game-container" style="text-align: center;">
                    <h2 style="color: #e67e22;">🐘 Phân Loại Động Vật 🐠</h2>
                    <p>Chọn đúng môi trường sống của động vật!</p>
                    <div class="game-score">Điểm: <span id="animal-score">0</span>/${CONFIG.MAX_QUESTIONS}</div>
                    <div id="animal-display" style="font-size: 5rem; margin: 20px 0;">?</div>
                    <div style="font-size: 1.2rem; color: #7f8c8d; margin: 10px 0;" id="animal-name"></div>
                    <div class="game-feedback"></div>
                    <div id="animal-options"></div>
                </div>
            `;
            this.showAnimal();
        }

        showAnimal() {
            if (this.state.questionCount >= CONFIG.MAX_QUESTIONS) {
                this.showEndGame();
                return;
            }

            const categories = Object.keys(this.animals);
            const category = categories[Math.floor(Math.random() * categories.length)];
            const animal = this.animals[category][Math.floor(Math.random() * this.animals[category].length)];

            this.currentCategory = category;
            this.currentAnimal = animal;

            const display = this.container.querySelector('#animal-display');
            const nameDisplay = this.container.querySelector('#animal-name');
            
            display.style.transform = 'scale(0)';
            setTimeout(() => {
                display.textContent = animal.emoji;
                nameDisplay.textContent = animal.name;
                display.style.transform = 'scale(1)';
                display.style.transition = 'transform 0.3s';
            }, 200);

            this.displayOptions();
        }

        displayOptions() {
            const optionsDiv = this.container.querySelector('#animal-options');
            optionsDiv.innerHTML = '';

            const options = [
                { text: '🏞️ Trên cạn', value: 'land', color: '#8b6914' },
                { text: '🌊 Dưới nước', value: 'water', color: '#3498db' },
                { text: '☁️ Biết bay', value: 'air', color: '#87ceeb' }
            ];

            options.forEach((opt, index) => {
                setTimeout(() => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn';
                    btn.textContent = opt.text;
                    btn.style.background = opt.color;
                    btn.onclick = () => this.checkAnswer(opt.value);
                    optionsDiv.appendChild(btn);
                }, index * 100);
            });
        }

        checkAnswer(selected) {
            const buttons = this.container.querySelectorAll('.game-btn');
            buttons.forEach(btn => btn.disabled = true);

            const isCorrect = selected === this.currentCategory;
            
            if (isCorrect) {
                this.state.addScore();
                const habitat = this.currentCategory === 'land' ? 'trên cạn' : 
                               this.currentCategory === 'water' ? 'dưới nước' : 'biết bay';
                this.showFeedback(`✅ Đúng rồi! ${this.currentAnimal.name} sống ${habitat}!`, true);
            } else {
                this.showFeedback('❌ Sai rồi! Thử lại nhé!', false);
            }

            this.updateScore();
            this.state.questionCount++;
            setTimeout(() => this.showAnimal(), CONFIG.FEEDBACK_DELAY);
        }
    }

    // Color Game Implementation
    class ColorGame extends BaseGame {
        constructor() {
            super();
            this.firstColor = null;
            this.colorMixes = {
                "red+yellow": { color: "orange", name: "Cam", hex: "#ff8c00" },
                "yellow+red": { color: "orange", name: "Cam", hex: "#ff8c00" },
                "red+blue": { color: "purple", name: "Tím", hex: "#9b59b6" },
                "blue+red": { color: "purple", name: "Tím", hex: "#9b59b6" },
                "yellow+blue": { color: "green", name: "Xanh lá", hex: "#27ae60" },
                "blue+yellow": { color: "green", name: "Xanh lá", hex: "#27ae60" }
            };
        }

        render() {
            this.container.innerHTML = `
                <div class="game-container" style="text-align: center;">
                    <h2 style="color: #9b59b6;">🎨 Trộn Màu Sắc 🎨</h2>
                    <p>Chọn 2 màu để xem kết quả pha trộn!</p>
                    <div style="display: flex; justify-content: center; gap: 20px; margin: 30px 0;">
                        <div class="color-circle" id="red" data-color="red" 
                             style="background: #e74c3c;"></div>
                        <div class="color-circle" id="yellow" data-color="yellow" 
                             style="background: #f1c40f;"></div>
                        <div class="color-circle" id="blue" data-color="blue" 
                             style="background: #3498db;"></div>
                    </div>
                    <div id="color-selected" style="font-size: 1.2rem; margin: 20px 0; min-height: 30px;"></div>
                    <div id="color-result">?</div>
                    <button class="game-btn" onclick="window.resetColorGame()" style="margin-top: 20px;">
                        🔄 Reset
                    </button>
                </div>
            `;
            this.bindColorEvents();
        }

        bindColorEvents() {
            const circles = this.container.querySelectorAll('.color-circle');
            circles.forEach(circle => {
                circle.addEventListener('click', () => this.selectColor(circle.dataset.color));
            });

            window.resetColorGame = () => {
                this.firstColor = null;
                this.container.querySelector('#color-selected').textContent = '';
                this.container.querySelector('#color-result').style.background = '#eee';
                this.container.querySelector('#color-result').textContent = '?';
                this.container.querySelector('#color-result').style.color = '#333';
                circles.forEach(c => c.classList.remove('selected'));
            };
        }

        selectColor(color) {
            const colorNames = { 
                red: "🔴 Đỏ", 
                yellow: "🟡 Vàng", 
                blue: "🔵 Xanh dương" 
            };

            const circle = this.container.querySelector(`[data-color="${color}"]`);
            
            if (!this.firstColor) {
                this.firstColor = color;
                circle.classList.add('selected');
                this.container.querySelector('#color-selected').textContent = 
                    `Đã chọn: ${colorNames[color]}`;
            } else if (this.firstColor !== color) {
                const key = this.firstColor + "+" + color;
                const result = this.colorMixes[key];

                if (result) {
                    this.animateColorMix(result);
                }

                setTimeout(() => {
                    this.firstColor = null;
                    this.container.querySelector('#color-selected').textContent = '';
                    this.container.querySelectorAll('.color-circle').forEach(c => 
                        c.classList.remove('selected'));
                }, 2000);
            }
        }

        animateColorMix(result) {
            const resultDiv = this.container.querySelector('#color-result');
            
            // Animation effect
            resultDiv.style.transform = 'scale(0.8)';
            resultDiv.style.opacity = '0';
            
            setTimeout(() => {
                resultDiv.style.background = result.hex;
                resultDiv.textContent = result.name;
                resultDiv.style.color = 'white';
                resultDiv.style.transform = 'scale(1.1)';
                resultDiv.style.opacity = '1';
                resultDiv.style.transition = 'all 0.3s';
                
                setTimeout(() => {
                    resultDiv.style.transform = 'scale(1)';
                }, 300);
            }, 200);
        }
    }

    // Blocks Game Implementation
    class BlocksGame extends BaseGame {
        render() {
            this.container.innerHTML = `
                <div class="game-container" style="text-align: center;">
                    <h2 style="color: #3498db;">🧱 Xếp Khối 3D 🧱</h2>
                    <p>Đếm xem có bao nhiêu khối lập phương?</p>
                    <div class="game-score">Điểm: <span id="blocks-score">0</span>/${CONFIG.MAX_QUESTIONS}</div>
                    <div id="blocks-display" style="margin: 30px 0; min-height: 150px;"></div>
                    <div class="game-feedback"></div>
                    <div id="blocks-options"></div>
                </div>
            `;
            this.generateBlocks();
        }

        generateBlocks() {
            if (this.state.questionCount >= CONFIG.MAX_QUESTIONS) {
                this.showEndGame();
                return;
            }

            const count = Math.floor(Math.random() * 8) + 3;
            const display = this.container.querySelector('#blocks-display');
            display.innerHTML = '';

            // Create 3D-looking blocks arrangement
            const arrangement = this.getRandomArrangement(count);
            
            arrangement.forEach((pos, i) => {
                setTimeout(() => {
                    const block = document.createElement('div');
                    block.className = 'block';
                    block.style.position = 'relative';
                    block.style.left = pos.x + 'px';
                    block.style.top = pos.y + 'px';
                    display.appendChild(block);
                }, i * 100);
            });

            setTimeout(() => this.displayOptions(count), count * 100 + 200);
        }

        getRandomArrangement(count) {
            const arrangements = [];
            const rows = Math.ceil(Math.sqrt(count));
            let placed = 0;

            for (let row = 0; row < rows && placed < count; row++) {
                for (let col = 0; col < rows && placed < count; col++) {
                    if (Math.random() > 0.2 || placed === count - 1) {
                        arrangements.push({
                            x: col * 45 - (rows * 45 / 2),
                            y: row * 45 - (rows * 45 / 2)
                        });
                        placed++;
                    }
                }
            }

            return arrangements;
        }

        displayOptions(correct) {
            const options = [correct];
            for (let i = 0; i < 3; i++) {
                let wrong;
                do {
                    wrong = correct + Math.floor(Math.random() * 5) - 2;
                } while (wrong <= 0 || options.includes(wrong));
                options.push(wrong);
            }

            const optionsDiv = this.container.querySelector('#blocks-options');
            optionsDiv.innerHTML = '';

            options.sort(() => Math.random() - 0.5).forEach((num, index) => {
                setTimeout(() => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn';
                    btn.textContent = num;
                    btn.onclick = () => this.checkAnswer(num, correct);
                    optionsDiv.appendChild(btn);
                }, index * 100);
            });
        }

        checkAnswer(selected, correct) {
            const buttons = this.container.querySelectorAll('.game-btn');
            buttons.forEach(btn => btn.disabled = true);

            const isCorrect = selected === correct;
            
            if (isCorrect) {
                this.state.addScore();
                this.showFeedback('✅ Đúng rồi! Tuyệt vời!', true);
            } else {
                this.showFeedback(`❌ Sai! Đáp án đúng là ${correct}`, false);
            }

            this.updateScore();
            this.state.questionCount++;
            setTimeout(() => this.generateBlocks(), CONFIG.FEEDBACK_DELAY);
        }
    }

    // Solar System Game Implementation
    class SolarGame extends BaseGame {
        constructor() {
            super();
            this.planets = [
                { name: "Sao Thuỷ", order: 1, fact: "Gần Mặt Trời nhất", size: "nhỏ nhất" },
                { name: "Sao Kim", order: 2, fact: "Nóng nhất", size: "tương tự Trái Đất" },
                { name: "Trái Đất", order: 3, fact: "Có sự sống", size: "vừa phải" },
                { name: "Sao Hoả", order: 4, fact: "Hành tinh đỏ", size: "nhỏ" },
                { name: "Sao Mộc", order: 5, fact: "Lớn nhất", size: "khổng lồ" },
                { name: "Sao Thổ", order: 6, fact: "Có vành đai đẹp nhất", size: "rất lớn" },
                { name: "Sao Thiên Vương", order: 7, fact: "Nghiêng 98 độ", size: "lớn" },
                { name: "Sao Hải Vương", order: 8, fact: "Xa nhất", size: "lớn" }
            ];
            
            this.planetEmojis = {
                "Sao Thuỷ": "☿️",
                "Sao Kim": "♀️",
                "Trái Đất": "🌍",
                "Sao Hoả": "♂️",
                "Sao Mộc": "♃",
                "Sao Thổ": "♄",
                "Sao Thiên Vương": "♅",
                "Sao Hải Vương": "♆"
            };
        }

        render() {
            this.container.innerHTML = `
                <div class="game-container" style="text-align: center;">
                    <h2 style="color: #2c3e50;">🌌 Khám Phá Hệ Mặt Trời 🌌</h2>
                    <div class="game-score">Điểm: <span id="solar-score">0</span>/${CONFIG.MAX_QUESTIONS}</div>
                    <div id="solar-visual" style="font-size: 4rem; margin: 20px 0;">🌟</div>
                    <p id="solar-question" style="font-size: 1.3rem; color: #34495e; margin: 20px;">?</p>
                    <div class="game-feedback"></div>
                    <div id="solar-options"></div>
                </div>
            `;
            this.askQuestion();
        }

        askQuestion() {
            if (this.state.questionCount >= CONFIG.MAX_QUESTIONS) {
                this.showEndGame();
                return;
            }

            const planet = this.planets[Math.floor(Math.random() * this.planets.length)];
            const questionTypes = ['order', 'fact', 'size'];
            const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

            this.currentPlanet = planet;
            this.currentType = questionType;

            const visual = this.container.querySelector('#solar-visual');
            visual.textContent = this.planetEmojis[planet.name] || '🪐';

            const questionElement = this.container.querySelector('#solar-question');

            switch(questionType) {
                case 'order':
                    questionElement.innerHTML = `<strong>${planet.name}</strong> là hành tinh thứ mấy tính từ Mặt Trời?`;
                    this.showOrderOptions(planet.order);
                    break;
                case 'fact':
                    questionElement.innerHTML = `Hành tinh nào <strong>${planet.fact.toLowerCase()}</strong>?`;
                    this.showPlanetOptions(planet.name);
                    break;
                case 'size':
                    questionElement.innerHTML = `<strong>${planet.name}</strong> có kích thước như thế nào?`;
                    this.showSizeOptions(planet.size);
                    break;
            }
        }

        showOrderOptions(correct) {
            const options = [correct];
            for (let i = 0; i < 3; i++) {
                let wrong;
                do {
                    wrong = Math.floor(Math.random() * 8) + 1;
                } while (options.includes(wrong));
                options.push(wrong);
            }

            const optionsDiv = this.container.querySelector('#solar-options');
            optionsDiv.innerHTML = '';

            options.sort(() => Math.random() - 0.5).forEach((num, index) => {
                setTimeout(() => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn';
                    btn.textContent = `Thứ ${num}`;
                    btn.onclick = () => this.checkAnswer(num === correct);
                    optionsDiv.appendChild(btn);
                }, index * 100);
            });
        }

        showPlanetOptions(correct) {
            const wrongPlanets = this.planets.filter(p => p.name !== correct);
            const options = [correct];
            
            for (let i = 0; i < 3 && wrongPlanets.length > 0; i++) {
                const index = Math.floor(Math.random() * wrongPlanets.length);
                options.push(wrongPlanets[index].name);
                wrongPlanets.splice(index, 1);
            }

            const optionsDiv = this.container.querySelector('#solar-options');
            optionsDiv.innerHTML = '';

            options.sort(() => Math.random() - 0.5).forEach((name, index) => {
                setTimeout(() => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn';
                    btn.textContent = name;
                    btn.onclick = () => this.checkAnswer(name === correct);
                    optionsDiv.appendChild(btn);
                }, index * 100);
            });
        }

        showSizeOptions(correct) {
            const sizes = ["nhỏ nhất", "nhỏ", "vừa phải", "lớn", "rất lớn", "khổng lồ", "tương tự Trái Đất"];
            const options = [correct];
            
            for (let i = 0; i < 3; i++) {
                let wrong;
                do {
                    wrong = sizes[Math.floor(Math.random() * sizes.length)];
                } while (options.includes(wrong));
                options.push(wrong);
            }

            const optionsDiv = this.container.querySelector('#solar-options');
            optionsDiv.innerHTML = '';

            options.sort(() => Math.random() - 0.5).forEach((size, index) => {
                setTimeout(() => {
                    const btn = document.createElement('button');
                    btn.className = 'game-btn';
                    btn.textContent = size;
                    btn.onclick = () => this.checkAnswer(size === correct);
                    optionsDiv.appendChild(btn);
                }, index * 100);
            });
        }

        checkAnswer(isCorrect) {
            const buttons = this.container.querySelectorAll('.game-btn');
            buttons.forEach(btn => btn.disabled = true);

            if (isCorrect) {
                this.state.addScore();
                let successMessage = `✅ Đúng rồi! `;
                
                switch(this.currentType) {
                    case 'order':
                        successMessage += `${this.currentPlanet.name} là hành tinh thứ ${this.currentPlanet.order}!`;
                        break;
                    case 'fact':
                        successMessage += `${this.currentPlanet.name} ${this.currentPlanet.fact.toLowerCase()}!`;
                        break;
                    case 'size':
                        successMessage += `${this.currentPlanet.name} có kích thước ${this.currentPlanet.size}!`;
                        break;
                }
                
                this.showFeedback(successMessage, true);
            } else {
                this.showFeedback('❌ Sai rồi! Thử lại nhé!', false);
            }

            this.updateScore();
            this.state.questionCount++;
            setTimeout(() => this.askQuestion(), CONFIG.FEEDBACK_DELAY);
        }
    }

    // Initialize Game Manager
    window.gameManager = new GameManager();

    // Global function to open games
    window.openGame = function(gameType) {
        if (window.gameManager) {
            window.gameManager.openGame(gameType);
        }
    };

    // Global function to close games
    window.closeGame = function() {
        if (window.gameManager) {
            window.gameManager.closeGame();
        }
    };

})();
