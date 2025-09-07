import { getUserTransactions, getBankDetails, requestWithdrawal } from '../../services/user.js';
import { renderModal } from '../shared/Modal.js';

async function openDepositModal() {
    const bankDetails = await getBankDetails();
    const modalContent = `
        <p class="mb-4">Please make a manual bank transfer to the following account:</p>
        <div class="space-y-2 text-lg bg-gray-100 p-4 rounded-lg">
            <p><strong>Account Name:</strong> ${bankDetails.account_name || 'N/A'}</p>
            <p><strong>Account Number:</strong> ${bankDetails.account_number || 'N/A'}</p>
            <p><strong>Bank:</strong> ${bankDetails.bank_name || 'N/A'}</p>
        </div>
        <p class="mt-4 text-sm text-red-600"><strong>Important:</strong> After making a deposit, please contact support with your transaction details to have your balance updated.</p>
    `;
    const { closeModal } = renderModal({
        title: 'Deposit Instructions',
        content: modalContent,
        footer: `<button id="close-btn" class="btn-secondary" style="padding: 0.5rem 1rem;">Close</button>`
    });
    document.getElementById('close-btn').addEventListener('click', closeModal);
}

async function openWithdrawalModal(user) {
    const modalContent = `
        <form id="withdrawalForm" class="space-y-4">
            <div>
                <label class="block font-medium text-gray-700">Withdrawal Amount (KES)</label>
                <input type="number" name="amount" class="input-field mt-1" placeholder="e.g., 1000" required>
            </div>
            <div>
                <label class="block font-medium text-gray-700">Payment Details (e.g., M-Pesa Number)</label>
                <input type="text" name="details" class="input-field mt-1" placeholder="e.g., 0712345678" required>
            </div>
        </form>
    `;
    const modalFooter = `
        <button id="cancel-btn" class="btn-secondary" style="padding: 0.5rem 1rem;">Cancel</button>
        <button id="submit-withdrawal-btn" class="btn-primary" style="padding: 0.5rem 1rem;">Submit Request</button>
    `;

    const { closeModal } = renderModal({
        title: 'Request a Withdrawal',
        content: modalContent,
        footer: modalFooter
    });

    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('submit-withdrawal-btn').addEventListener('click', async () => {
        const form = document.getElementById('withdrawalForm');
        if (form.checkValidity()) {
            const amount = parseFloat(form.amount.value);
            const details = form.details.value;
            // Basic validation
            if (isNaN(amount) || amount <= 0) {
                window.showNotification('Please enter a valid amount.', 'error');
                return;
            }
            try {
                await requestWithdrawal(user.id, amount, details);
                window.showNotification('Withdrawal request submitted successfully!', 'success');
                closeModal();
                window.loadUserSection('transactions', user); // Refresh the transactions view
            } catch (error) {
                window.showNotification(`Error: ${error.message}`, 'error');
            }
        } else {
            form.reportValidity();
        }
    });
}

export async function renderUserTransactions(container, user) {
  const transactions = await getUserTransactions(user.id);
  
  const statusClasses = {
    pending: 'text-yellow-700 bg-yellow-100',
    completed: 'text-green-700 bg-green-100',
    declined: 'text-red-700 bg-red-100',
  };

  container.innerHTML = `
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg mb-8">
        <div class="p-6 border-b border-gray-200">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 class="text-2xl font-bold text-gray-800">Transactions</h3>
              <p class="text-gray-600 mt-2">Manage your deposits and withdrawals</p>
            </div>
            <div class="flex space-x-4 mt-4 md:mt-0">
              <button id="withdrawal-btn" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Request Withdrawal</button>
              <button id="deposit-btn" class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">Make Deposit</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="bg-white rounded-xl shadow-lg">
        <div class="p-6 border-b border-gray-200">
          <h4 class="text-xl font-bold text-gray-800">Transaction History</h4>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Date</th>
                <th scope="col" class="px-6 py-3">Type</th>
                <th scope="col" class="px-6 py-3">Amount</th>
                <th scope="col" class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr class="bg-white border-b hover:bg-gray-50">
                  <td class="px-6 py-4">${new Date(t.created_at).toLocaleString()}</td>
                  <td class="px-6 py-4 capitalize">${t.type.replace('_', ' ')}</td>
                  <td class="px-6 py-4 font-bold ${['deposit', 'earning', 'referral_commission'].includes(t.type) ? 'text-green-600' : 'text-red-600'}">
                    KES ${t.amount.toLocaleString()}
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 font-semibold leading-tight rounded-full ${statusClasses[t.status] || 'text-gray-700 bg-gray-100'}">${t.status}</span>
                  </td>
                </tr>
              `).join('')}
              ${transactions.length === 0 ? `<tr><td colspan="4" class="text-center py-12 text-gray-500">No transactions yet.</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('withdrawal-btn')?.addEventListener('click', () => openWithdrawalModal(user));
    document.getElementById('deposit-btn')?.addEventListener('click', openDepositModal);
  }, 0);
}
