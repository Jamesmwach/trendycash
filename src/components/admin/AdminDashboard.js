import { getDashboardStats } from '../../services/admin.js';

export async function renderAdminDashboard(container) {
  const stats = await getDashboardStats();

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-500">Total Users</h3>
        <p class="text-3xl font-bold text-gray-800">${stats.totalUsers?.toLocaleString() || 0}</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-500">Total Revenue</h3>
        <p class="text-3xl font-bold text-gray-800">KES ${stats.totalRevenue?.toLocaleString() || 0}</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-500">Pending Withdrawals</h3>
        <p class="text-3xl font-bold text-red-600">KES ${stats.pendingWithdrawals?.toLocaleString() || 0}</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-500">Active Subscriptions</h3>
        <p class="text-3xl font-bold text-gray-800">${stats.activeSubscriptions?.toLocaleString() || 0}</p>
      </div>
    </div>
    <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
      <div class="text-center py-12 text-gray-500">
        <p>A log of recent admin and user activities will be displayed here.</p>
      </div>
    </div>
  `;
}
