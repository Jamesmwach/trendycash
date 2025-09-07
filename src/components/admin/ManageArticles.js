import { getAdminArticles, createArticle, updateArticle, deleteArticle, getArticleById } from '../../services/admin.js';
import { renderModal } from '../shared/Modal.js';

async function openArticleFormModal(id) {
  const article = id ? await getArticleById(id) : null;
  const isEditing = !!article;

  const modalContent = `
    <form id="articleForm" class="space-y-4">
      <input type="hidden" name="id" value="${article?.id || ''}">
      <div>
        <label class="block font-medium text-gray-700">Title</label>
        <input type="text" name="title" class="input-field mt-1" value="${article?.title || ''}" required>
      </div>
      <div>
        <label class="block font-medium text-gray-700">Content (Markdown supported)</label>
        <textarea name="content" class="input-field mt-1" rows="8" required>${article?.content || ''}</textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium text-gray-700">Status</label>
          <select name="status" class="input-field mt-1" required>
            <option value="draft" ${article?.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="published" ${article?.status === 'published' ? 'selected' : ''}>Published</option>
          </select>
        </div>
        <div>
          <label class="block font-medium text-gray-700">Earning Amount (KES)</label>
          <input type="number" name="earning_amount" class="input-field mt-1" value="${article?.earning_amount || 25}" required>
        </div>
      </div>
    </form>
  `;

  const modalFooter = `
    <button id="cancel-btn" class="btn-secondary" style="padding: 0.5rem 1rem;">Cancel</button>
    <button id="save-btn" class="btn-primary" style="padding: 0.5rem 1rem;">${isEditing ? 'Save Changes' : 'Create Article'}</button>
  `;

  const { closeModal } = renderModal({
    title: isEditing ? 'Edit Article' : 'Create New Article',
    content: modalContent,
    footer: modalFooter
  });

  document.getElementById('cancel-btn').addEventListener('click', closeModal);

  document.getElementById('save-btn').addEventListener('click', async () => {
    const form = document.getElementById('articleForm');
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const articleData = {
        title: formData.get('title'),
        content: formData.get('content'),
        status: formData.get('status'),
        earning_amount: parseFloat(formData.get('earning_amount')),
      };

      try {
        if (isEditing) {
          await updateArticle(article.id, articleData);
          window.showNotification('Article updated successfully!', 'success');
        } else {
          await createArticle(articleData);
          window.showNotification('Article created successfully!', 'success');
        }
        closeModal();
        window.loadAdminSection('articles');
      } catch (error) {
        window.showNotification(`Error: ${error.message}`, 'error');
      }
    } else {
      form.reportValidity();
    }
  });
}

async function handleDeleteArticle(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        try {
            await deleteArticle(id);
            window.showNotification('Article deleted successfully!', 'success');
            window.loadAdminSection('articles');
        } catch (error) {
            window.showNotification(`Error: ${error.message}`, 'error');
        }
    }
}

export async function renderManageArticles(container) {
  const articles = await getAdminArticles();
  
  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg">
      <div class="p-6 border-b flex justify-between items-center">
        <h3 class="text-xl font-bold">Articles (${articles.length})</h3>
        <button id="add-article-btn" class="btn-primary" style="padding: 0.5rem 1rem;">Create New Article</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Title</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3">Created On</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody id="articles-table-body">
             ${articles.map(article => `
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${article.title}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 font-semibold leading-tight ${article.status === 'published' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'} rounded-full">${article.status}</span>
                </td>
                <td class="px-6 py-4">${new Date(article.created_at).toLocaleDateString()}</td>
                <td class="px-6 py-4 space-x-2">
                  <button class="font-medium text-blue-600 hover:underline" data-action="edit" data-id="${article.id}">Edit</button>
                  <button class="font-medium text-red-600 hover:underline" data-action="delete" data-id="${article.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
            ${articles.length === 0 ? `<tr><td colspan="4" class="text-center py-12">No articles found.</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('add-article-btn').addEventListener('click', () => openArticleFormModal());

  document.getElementById('articles-table-body').addEventListener('click', (e) => {
    const target = e.target;
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === 'edit' && id) {
      openArticleFormModal(id);
    } else if (action === 'delete' && id) {
      handleDeleteArticle(id);
    }
  });
}
