import { getPlanById, getBankDetails, createSubscriptionPayment } from '../../services/user.js';

export async function renderSubscriptionPayment(container, user, payload) {
    const [plan, bankDetails] = await Promise.all([
        getPlanById(payload.planId),
        getBankDetails()
    ]);

    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <button onclick="window.loadUserSection('subscriptions', window.currentUser)" class="text-blue-600 hover:underline mb-6">&larr; Back to Plans</button>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Complete Your Subscription</h2>
            <p class="text-gray-600 mb-6">You are subscribing to the <span class="font-bold">${plan.name}</span> plan.</p>
            
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Payment Instructions</h3>
                <p class="mb-4">Please make a manual bank transfer of <strong class="text-2xl">KES ${plan.price.toLocaleString()}</strong> to the following account:</p>
                <div class="space-y-2 text-lg">
                    <p><strong>Account Name:</strong> ${bankDetails.account_name || 'N/A'}</p>
                    <p><strong>Account Number:</strong> ${bankDetails.account_number || 'N/A'}</p>
                    <p><strong>Bank:</strong> ${bankDetails.bank_name || 'N/A'}</p>
                </div>
                <p class="mt-4 text-sm text-red-600"><strong>Important:</strong> After making the payment, click the button below. Your subscription will be activated once the payment is confirmed by an admin (usually within 24 hours).</p>
            </div>

            <button id="payment-confirmation-btn" class="w-full btn-primary text-lg">
                I Have Made the Payment
            </button>
        </div>
    `;

    document.getElementById('payment-confirmation-btn').addEventListener('click', async () => {
        const button = document.getElementById('payment-confirmation-btn');
        button.disabled = true;
        button.textContent = 'Processing...';

        try {
            await createSubscriptionPayment(user.id, plan);
            container.innerHTML = `
                <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
                    <h2 class="text-3xl font-bold text-green-600 mb-4">Payment Submitted!</h2>
                    <p class="text-lg text-gray-600 mb-6">Your payment is now pending review. Your subscription will be activated upon confirmation.</p>
                    <button onclick="window.loadUserSection('dashboard-home', window.currentUser)" class="btn-primary">Back to Dashboard</button>
                </div>
            `;
        } catch (error) {
            window.showNotification(`Error submitting payment: ${error.message}`, 'error');
            button.disabled = false;
            button.textContent = 'I Have Made the Payment';
        }
    });

    // Make user object available for back button
    window.currentUser = user;
}
