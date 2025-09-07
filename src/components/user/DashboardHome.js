import { getUserDashboardData } from '../../services/user.js';

export async function renderDashboardHome(container, user) {
  const data = await getUserDashboardData(user.id);
  
  // These are placeholders for now
  const todayEarnings = 0;
  const triviaCompleted = 0;
  const referrals = 0;

  container.innerHTML = `
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total Earnings</p>
            <p class="text-2xl font-bold text-gray-800">KES ${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Today's Earnings</p>
            <p class="text-2xl font-bold text-gray-800">KES ${todayEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Trivia Completed</p>
            <p class="text-2xl font-bold text-gray-800">${triviaCompleted}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Referrals</p>
            <p class="text-2xl font-bold text-gray-800">${referrals}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <h3 class="text-2xl font-bold mb-4">Start Earning Today!</h3>
        <p class="mb-6 opacity-90">Answer trivia questions and earn money instantly</p>
        <button onclick="window.loadUserSection('trivia')" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
          Start Trivia
        </button>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white">
        <h3 class="text-2xl font-bold mb-4">Read & Earn</h3>
        <p class="mb-6 opacity-90">Read interesting articles and get paid for your time</p>
        <button onclick="window.loadUserSection('articles')" class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
          Browse Articles
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-xl shadow-lg">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-xl font-bold text-gray-800">Recent Activity</h3>
      </div>
      <div class="p-6">
        <div class="text-center py-8 text-gray-500">
          <p>No recent activity yet. Start earning to see your activity here!</p>
        </div>
      </div>
    </div>
  `;
}
