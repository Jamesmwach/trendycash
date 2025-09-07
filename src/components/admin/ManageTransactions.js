import { getTransactions, updateTransactionStatus } from '../../services/admin.js';

async function handleUpdateStatus(id, status) {
    const action = status === 'completed' ? 'approve' : 'decline';
    if (confirm(`Are you sure you want to ${action} this withdrawal request?`)) {
        try {
            await updateTransactionStatus(id, status);
            window.showNotification(`Withdrawal ${action}d successfully!`, 'success');
            window.loadAdminSection('transactions');
        } catch (error) {
            window.showNotification(`Error: ${error.message}`, 'error');
        }
    }
}

export async function renderManageTransactions(container) {
  const transactions = await getTransactions('all');
  
  const statusClasses = {
    pending: 'text-yellow-700 bg-yellow-100',
    completed: 'text-green-700 bg-green-100',
    declined: 'text-red-700 bg-red-100',
  };

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg">
      <div class="p-6 border-b">
        <h3 class="text-xl font-bold">All Transactions (${transactions.length})</h3>
        <!-- Add filters here -->
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">User</th>
              <th scope="col" class="px-6 py-3">Amount</th>
              <th scope="col" class="px-6 py-3">Type</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3">Date</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody id="transactions-table-body">
            ${transactions.map(t => `
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">
                  <div>${t.profiles?.full_name || 'N/A'}</div>
                  <div class="text-xs text-gray-500">${t.profiles?.email || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 font-bold ${t.type === 'deposit' || t.type === 'subscription_payment' ? 'text-green-600' : 'text-red-600'}">KES ${t.amount.toLocaleString()}</td>
                <td class="px-6 py-4 capitalize">${t.type.replace('_', ' ')}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 font-semibold leading-tight rounded-full ${statusClasses[t.status]}">${t.status}</span>
                </td>
                <td class="px-6 py-4">${new Date(t.created_at).toLocaleDateString()}</td>
                <td class="px-6 py-4 space-x-2">
                  ${t.status === 'pending' && t.type === 'withdrawal' ? `
                    <button class="font-medium text-green-600 hover:underline" data-action="approve" data-id="${t.id}">Approve</button>
                    <button class="font-medium text-red-600 hover:underline" data-action="decline" data-id="${t.id}">Decline</button>
                  ` : 'N/A'}
                </td>
              </tr>
            `).join('')}
            ${transactions.length === 0 ? `<tr><td colspan="6" class="text-center py-12">No transactions found.</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('transactions-table-body').addEventListener('click', (e) => {
    const target = e.target;
    const action = target.dataset.action;
    const id = target.dataset.id;
    
    if (!action || !id) return;

    if (action === 'approve') {
      handleUpdateStatus(id, 'completed');
    } else if (action === 'decline') {
      handleUpdateStatus(id, 'declined');
    }
  });
}
