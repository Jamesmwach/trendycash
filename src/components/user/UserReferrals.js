import { getUserReferrals, getUserDashboardData } from '../../services/user.js';

export async function renderUserReferrals(container, user) {
  const [referrals, profile] = await Promise.all([
    getUserReferrals(user.id),
    getUserDashboardData(user.id)
  ]);

  const referralLink = `${window.location.origin}#signup?ref=${profile.referral_code}`;

  container.innerHTML = `
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg mb-8 p-6 border-b">
        <h3 class="text-2xl font-bold text-gray-800">Referral Program</h3>
        <p class="text-gray-600 mt-2">Invite friends and earn commission from their activities</p>
      </div>

      <!-- Referral Link -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white mb-8">
        <h4 class="text-2xl font-bold mb-4">Your Referral Link</h4>
        <div class="flex items-center space-x-4">
          <input id="referral-link-input" type="text" readonly value="${referralLink}" class="flex-1 bg-white bg-opacity-20 rounded-lg p-3 font-mono text-sm text-white border-none">
          <button id="copy-referral-btn" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:shadow-lg">Copy Link</button>
        </div>
      </div>

      <!-- Referral History -->
      <div class="bg-white rounded-xl shadow-lg">
        <div class="p-6 border-b"><h4 class="text-xl font-bold text-gray-800">Your Referrals (${referrals.length})</h4></div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">User</th>
                <th scope="col" class="px-6 py-3">Date Joined</th>
                <th scope="col" class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              ${referrals.map(r => `
                <tr class="bg-white border-b hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-gray-900">
                    <div>${r.profiles.full_name}</div>
                    <div class="text-xs text-gray-500">${r.profiles.email}</div>
                  </td>
                  <td class="px-6 py-4">${new Date(r.profiles.created_at).toLocaleDateString()}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">Active</span>
                  </td>
                </tr>
              `).join('')}
              ${referrals.length === 0 ? `<tr><td colspan="3" class="text-center py-12 text-gray-500">You haven't referred anyone yet.</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  document.getElementById('copy-referral-btn')?.addEventListener('click', () => {
    const input = document.getElementById('referral-link-input');
    input.select();
    document.execCommand('copy');
    window.showNotification('Referral link copied!', 'success');
  });
}
