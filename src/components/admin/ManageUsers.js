import { getAllUsers } from '../../services/admin.js';

export async function renderManageUsers(container) {
  const { users, count } = await getAllUsers();

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-xl font-bold">All Users (${count})</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">User</th>
              <th scope="col" class="px-6 py-3">Subscription</th>
              <th scope="col" class="px-6 py-3">Joined On</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  <div class="font-bold">${user.full_name || 'N/A'}</div>
                  <div class="text-gray-500">${user.email}</div>
                </td>
                <td class="px-6 py-4">
                  ${user.user_subscriptions[0]?.subscription_plans?.name || 'None'}
                </td>
                <td class="px-6 py-4">${new Date(user.created_at).toLocaleDateString()}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">Active</span>
                </td>
                <td class="px-6 py-4">
                  <button class="font-medium text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            `).join('')}
            ${users.length === 0 ? `<tr><td colspan="5" class="text-center py-12">No users found.</td></tr>` : ''}
          </tbody>
        </table>
      </div>
      <!-- Pagination will go here -->
    </div>
  `;
}
