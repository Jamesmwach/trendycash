import { getSubscriptionPlansAdmin, createPlan, updatePlan, deletePlan, getPlanById } from '../../services/admin.js';
import { renderModal } from '../shared/Modal.js';

async function openPlanFormModal(id) {
  const plan = id ? await getPlanById(id) : null;
  const isEditing = !!plan;

  const modalContent = `
    <form id="planForm" class="space-y-4">
      <input type="hidden" name="id" value="${plan?.id || ''}">
      <div>
        <label class="block font-medium text-gray-700">Plan Name</label>
        <input type="text" name="name" class="input-field mt-1" value="${plan?.name || ''}" required>
      </div>
      <div>
        <label class="block font-medium text-gray-700">Description</label>
        <textarea name="description" class="input-field mt-1" rows="3">${plan?.description || ''}</textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium text-gray-700">Price (KES)</label>
          <input type="number" name="price" class="input-field mt-1" value="${plan?.price || ''}" required>
        </div>
        <div>
          <label class="block font-medium text-gray-700">Duration (Days)</label>
          <input type="number" name="duration_days" class="input-field mt-1" value="${plan?.duration_days || 30}" required>
        </div>
      </div>
      <div>
        <label class="flex items-center">
          <input type="checkbox" name="is_active" class="mr-2 rounded" ${plan?.is_active ? 'checked' : ''}>
          <span class="text-gray-700">Is Active</span>
        </label>
      </div>
    </form>
  `;

  const modalFooter = `
    <button id="cancel-btn" class="btn-secondary" style="padding: 0.5rem 1rem;">Cancel</button>
    <button id="save-btn" class="btn-primary" style="padding: 0.5rem 1rem;">${isEditing ? 'Save Changes' : 'Create Plan'}</button>
  `;

  const { closeModal } = renderModal({
    title: isEditing ? 'Edit Subscription Plan' : 'Create New Plan',
    content: modalContent,
    footer: modalFooter
  });

  document.getElementById('cancel-btn').addEventListener('click', closeModal);

  document.getElementById('save-btn').addEventListener('click', async () => {
    const form = document.getElementById('planForm');
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const planData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        duration_days: parseInt(formData.get('duration_days')),
        is_active: formData.get('is_active') === 'on',
      };

      try {
        if (isEditing) {
          await updatePlan(plan.id, planData);
          window.showNotification('Plan updated successfully!', 'success');
        } else {
          await createPlan(planData);
          window.showNotification('Plan created successfully!', 'success');
        }
        closeModal();
        window.loadAdminSection('subscriptions');
      } catch (error) {
        window.showNotification(`Error: ${error.message}`, 'error');
      }
    } else {
      form.reportValidity();
    }
  });
}

async function handleDeletePlan(id) {
    if (confirm('Are you sure you want to delete this plan? This could affect existing user subscriptions.')) {
        try {
            await deletePlan(id);
            window.showNotification('Plan deleted successfully!', 'success');
            window.loadAdminSection('subscriptions');
        } catch (error) {
            window.showNotification(`Error: ${error.message}`, 'error');
        }
    }
}

export async function renderManageSubscriptions(container) {
  const plans = await getSubscriptionPlansAdmin();

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-xl font-bold">Subscription Plans (${plans.length})</h3>
        <button id="add-plan-btn" class="btn-primary" style="padding: 0.5rem 1rem;">Create New Plan</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Plan Name</th>
              <th scope="col" class="px-6 py-3">Price</th>
              <th scope="col" class="px-6 py-3">Active</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody id="plans-table-body">
            ${plans.map(plan => `
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${plan.name}</td>
                <td class="px-6 py-4">KES ${plan.price.toLocaleString()}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 font-semibold leading-tight ${plan.is_active ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'} rounded-full">${plan.is_active ? 'Yes' : 'No'}</span>
                </td>
                <td class="px-6 py-4 space-x-2">
                  <button class="font-medium text-blue-600 hover:underline" data-action="edit" data-id="${plan.id}">Edit</button>
                  <button class="font-medium text-red-600 hover:underline" data-action="delete" data-id="${plan.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
             ${plans.length === 0 ? `<tr><td colspan="4" class="text-center py-12">No plans found.</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('add-plan-btn').addEventListener('click', () => openPlanFormModal());

  document.getElementById('plans-table-body').addEventListener('click', (e) => {
    const target = e.target;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === 'edit' && id) {
      openPlanFormModal(id);
    } else if (action === 'delete' && id) {
      handleDeletePlan(id);
    }
  });
}
