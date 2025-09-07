import { getSubscriptionPlans } from '../../services/user.js';

export async function renderUserSubscriptions(container, user) {
  const plans = await getSubscriptionPlans();

  container.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg mb-8 p-6 border-b border-gray-200">
        <h3 class="text-2xl font-bold text-gray-800">Subscription Plans</h3>
        <p class="text-gray-600 mt-2">Choose a plan to unlock earning features</p>
      </div>

      <!-- Subscription Plans -->
      <div id="subscription-plans-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${plans.map(plan => `
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col">
            <h4 class="text-xl font-bold text-gray-800 mb-2">${plan.name}</h4>
            <div class="text-3xl font-bold text-gray-800 mb-4">
              KES ${plan.price.toLocaleString()}
              <span class="text-sm text-gray-500 font-normal">/${plan.duration_days} days</span>
            </div>
            <p class="text-gray-600 mb-6 flex-grow">${plan.description}</p>
            <button data-plan-id="${plan.id}" class="choose-plan-btn w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors duration-200">
              Choose Plan
            </button>
          </div>
        `).join('')}
        ${plans.length === 0 ? `<p class="text-center col-span-full py-12 text-gray-500">No subscription plans available right now.</p>` : ''}
      </div>
    </div>
  `;

  document.querySelectorAll('.choose-plan-btn').forEach(button => {
    button.addEventListener('click', () => {
        const planId = button.dataset.planId;
        window.loadUserSection('subscription-payment', user, { planId });
    });
  });
}
