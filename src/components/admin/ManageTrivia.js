import { getTrivia, createTrivia, updateTrivia, deleteTrivia, getTriviaById, getTriviaCategories } from '../../services/admin.js';
import { renderModal } from '../shared/Modal.js';

async function openTriviaFormModal(id) {
  const [categories, question] = await Promise.all([
    getTriviaCategories(),
    id ? getTriviaById(id) : Promise.resolve(null)
  ]);

  const isEditing = !!question;
  const options = question?.options || ['', '', '', ''];

  const modalContent = `
    <form id="triviaForm" class="space-y-4">
      <input type="hidden" name="id" value="${question?.id || ''}">
      <div>
        <label class="block font-medium text-gray-700">Question Text</label>
        <textarea name="question_text" class="input-field mt-1" rows="3" required>${question?.question_text || ''}</textarea>
      </div>
      <div>
        <label class="block font-medium text-gray-700">Category</label>
        <select name="category_id" class="input-field mt-1" required>
          <option value="">Select a category</option>
          ${categories.map(cat => `<option value="${cat.id}" ${question?.category_id === cat.id ? 'selected' : ''}>${cat.name}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block font-medium text-gray-700">Options (JSON Array)</label>
        <div class="grid grid-cols-2 gap-2 mt-1">
          ${options.map((opt, i) => `<input type="text" name="option_${i}" class="input-field" placeholder="Option ${i + 1}" value="${opt}" required>`).join('')}
        </div>
      </div>
      <div>
        <label class="block font-medium text-gray-700">Correct Answer</label>
        <input type="text" name="correct_answer" class="input-field mt-1" value="${question?.correct_answer || ''}" required>
      </div>
      <div>
        <label class="block font-medium text-gray-700">Earning Amount (KES)</label>
        <input type="number" name="earning_amount" class="input-field mt-1" value="${question?.earning_amount || 50}" required>
      </div>
    </form>
  `;

  const modalFooter = `
    <button id="cancel-btn" class="btn-secondary" style="padding: 0.5rem 1rem;">Cancel</button>
    <button id="save-btn" class="btn-primary" style="padding: 0.5rem 1rem;">${isEditing ? 'Save Changes' : 'Create Question'}</button>
  `;

  const { closeModal } = renderModal({
    title: isEditing ? 'Edit Trivia Question' : 'Add New Trivia Question',
    content: modalContent,
    footer: modalFooter
  });

  document.getElementById('cancel-btn').addEventListener('click', closeModal);

  document.getElementById('save-btn').addEventListener('click', async () => {
    const form = document.getElementById('triviaForm');
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const questionData = {
        question_text: formData.get('question_text'),
        category_id: formData.get('category_id'),
        options: [formData.get('option_0'), formData.get('option_1'), formData.get('option_2'), formData.get('option_3')],
        correct_answer: formData.get('correct_answer'),
        earning_amount: parseFloat(formData.get('earning_amount')),
      };

      try {
        if (isEditing) {
          await updateTrivia(question.id, questionData);
          window.showNotification('Question updated successfully!', 'success');
        } else {
          await createTrivia(questionData);
          window.showNotification('Question created successfully!', 'success');
        }
        closeModal();
        window.loadAdminSection('trivia');
      } catch (error) {
        window.showNotification(`Error: ${error.message}`, 'error');
      }
    } else {
      form.reportValidity();
    }
  });
}

async function handleDeleteTrivia(id) {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
        try {
            await deleteTrivia(id);
            window.showNotification('Question deleted successfully!', 'success');
            window.loadAdminSection('trivia');
        } catch (error) {
            window.showNotification(`Error: ${error.message}`, 'error');
        }
    }
}

export async function renderManageTrivia(container) {
  const questions = await getTrivia();

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-xl font-bold">Trivia Questions (${questions.length})</h3>
        <button id="add-trivia-btn" class="btn-primary" style="padding: 0.5rem 1rem;">Add New Question</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Question</th>
              <th scope="col" class="px-6 py-3">Category</th>
              <th scope="col" class="px-6 py-3">Earning</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody id="trivia-table-body">
            ${questions.map(q => `
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${q.question_text}</td>
                <td class="px-6 py-4">${q.trivia_categories?.name || 'N/A'}</td>
                <td class="px-6 py-4">KES ${q.earning_amount}</td>
                <td class="px-6 py-4 space-x-2">
                  <button class="font-medium text-blue-600 hover:underline" data-action="edit" data-id="${q.id}">Edit</button>
                  <button class="font-medium text-red-600 hover:underline" data-action="delete" data-id="${q.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
            ${questions.length === 0 ? `<tr><td colspan="4" class="text-center py-12">No trivia questions found.</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('add-trivia-btn').addEventListener('click', () => openTriviaFormModal());
  
  document.getElementById('trivia-table-body').addEventListener('click', (e) => {
    const target = e.target;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === 'edit' && id) {
      openTriviaFormModal(id);
    } else if (action === 'delete' && id) {
      handleDeleteTrivia(id);
    }
  });
}
