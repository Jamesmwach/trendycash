import { getReferralStats } from '../../services/admin.js';

export async function renderManageReferrals(container) {
  const stats = await getReferralStats();

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-500">Total Referrals</h3>
        <p class="text-3xl font-bold text-gray-800">${stats.totalReferrals.toLocaleString()}</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-500">Total Commission Paid</h3>
        <p class="text-3xl font-bold text-gray-800">KES ${stats.totalCommission.toLocaleString()}</p>
      </div>
    </div>
    <div class="bg-white rounded-xl shadow-lg">
      <div class="p-6 border-b">
        <h3 class="text-xl font-bold">Referral History</h3>
      </div>
      <div class="p-6 text-center text-gray-500 py-12">
        <p>A detailed table of all referral activities will be displayed here.</p>
      </div>
    </div>
  `;
}
