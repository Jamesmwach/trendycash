import { getTriviaQuestions, logEarning, getUserDashboardData } from '../../services/user.js';

export async function renderTriviaGame(container, user, payload) {
    const questions = await getTriviaQuestions(payload.categoryId, 5);
    let currentQuestionIndex = 0;
    let score = 0;
    let totalEarnings = 0;

    if (questions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <h3 class="text-xl font-bold">No Questions Available</h3>
                <p class="text-gray-600 mt-2">There are no questions in this category right now. Please try another one.</p>
                <button onclick="window.loadUserSection('trivia', window.currentUser)" class="mt-6 btn-primary">Back to Trivia</button>
            </div>
        `;
        return;
    }

    function renderQuestion() {
        if (currentQuestionIndex >= questions.length) {
            renderSummary();
            return;
        }

        const question = questions[currentQuestionIndex];
        container.innerHTML = `
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div class="flex justify-between items-center mb-4">
                    <p class="text-sm text-gray-500">Question ${currentQuestionIndex + 1} of ${questions.length}</p>
                    <p class="text-sm font-bold text-green-600">Earnings: KES ${totalEarnings.toFixed(2)}</p>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${((currentQuestionIndex + 1) / questions.length) * 100}%"></div>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-6">${question.question_text}</h3>
                <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${question.options.map(option => `
                        <button class="option-btn p-4 border-2 border-gray-300 rounded-lg text-left hover:bg-gray-100 transition-colors">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    async function handleAnswer(e) {
        const selectedOption = e.target.textContent.trim();
        const question = questions[currentQuestionIndex];
        const isCorrect = selectedOption === question.correct_answer;

        document.querySelectorAll('.option-btn').forEach(button => {
            button.disabled = true;
            const optionText = button.textContent.trim();
            if (optionText === question.correct_answer) {
                button.classList.add('bg-green-200', 'border-green-500');
            } else if (optionText === selectedOption) {
                button.classList.add('bg-red-200', 'border-red-500');
            }
        });

        if (isCorrect) {
            score++;
            totalEarnings += question.earning_amount;
            await logEarning(user.id, question.earning_amount, `Trivia: ${question.question_text}`);
        }

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 1500);
    }

    async function renderSummary() {
        container.innerHTML = `
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
                <h3 class="text-3xl font-bold text-gray-800 mb-4">Session Complete!</h3>
                <p class="text-lg text-gray-600 mb-6">You answered ${score} out of ${questions.length} questions correctly.</p>
                <div class="bg-green-100 text-green-800 rounded-lg p-6 mb-8">
                    <p class="text-lg">Total Earnings from this session:</p>
                    <p class="text-4xl font-bold">KES ${totalEarnings.toFixed(2)}</p>
                </div>
                <button onclick="window.loadUserSection('trivia', window.currentUser)" class="btn-primary">Play Again</button>
            </div>
        `;
        // Update user balance in header
        const profile = await getUserDashboardData(user.id);
        document.getElementById('user-balance').textContent = `KES ${profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    renderQuestion();
}
