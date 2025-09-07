import { getArticleById, logEarning, getUserDashboardData } from '../../services/user.js';

export async function renderArticleView(container, user, payload) {
    const article = await getArticleById(payload.articleId);
    const readTime = 30; // 30 seconds
    let timeLeft = readTime;
    let timerInterval = null;

    function renderContent() {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
                <div class="p-8">
                    <button onclick="window.loadUserSection('articles', window.currentUser)" class="text-blue-600 hover:underline mb-6">&larr; Back to Articles</button>
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">${article.title}</h1>
                    <div class="flex items-center space-x-4 text-gray-500 mb-8">
                        <span>${new Date(article.created_at).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span>Reward: KES ${article.earning_amount}</span>
                    </div>
                    <div class="prose lg:prose-xl max-w-none">
                        ${article.content.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <div id="timer-footer" class="sticky bottom-0 bg-gray-100 p-4 border-t mt-8 rounded-b-xl text-center">
                    <!-- Timer content goes here -->
                </div>
            </div>
        `;
        renderTimerFooter();
    }

    function renderTimerFooter() {
        const footer = document.getElementById('timer-footer');
        if (timeLeft > 0) {
            footer.innerHTML = `<p class="font-bold text-lg">Read for <span id="time-left">${timeLeft}</span> more seconds to claim your reward!</p>`;
        } else {
            footer.innerHTML = `
                <p class="font-bold text-lg text-green-600 mb-2">You can now claim your reward!</p>
                <button id="claim-reward-btn" class="btn-primary">Claim KES ${article.earning_amount}</button>
            `;
            document.getElementById('claim-reward-btn').addEventListener('click', claimReward);
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            const timeLeftEl = document.getElementById('time-left');
            if (timeLeftEl) {
                timeLeftEl.textContent = timeLeft;
            }
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                renderTimerFooter();
            }
        }, 1000);
    }

    async function claimReward() {
        const button = document.getElementById('claim-reward-btn');
        button.disabled = true;
        button.textContent = 'Claiming...';

        try {
            await logEarning(user.id, article.earning_amount, `Article Read: ${article.title}`);
            window.showNotification(`You've earned KES ${article.earning_amount}!`, 'success');
            
            const footer = document.getElementById('timer-footer');
            footer.innerHTML = `<p class="font-bold text-lg text-green-600">Reward Claimed Successfully!</p>`;

            // Update user balance in header
            const profile = await getUserDashboardData(user.id);
            document.getElementById('user-balance').textContent = `KES ${profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        } catch (error) {
            window.showNotification(`Error claiming reward: ${error.message}`, 'error');
            button.disabled = false;
            button.textContent = `Claim KES ${article.earning_amount}`;
        }
    }
    
    renderContent();
    startTimer();

    // Make user object available for back button
    window.currentUser = user;
}
