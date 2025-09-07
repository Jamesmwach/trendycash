import { getAvailableArticles } from '../../services/user.js';

export async function renderUserArticles(container, user) {
  const articles = await getAvailableArticles();

  container.innerHTML = `
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg mb-8 p-6 border-b border-gray-200">
          <h3 class="text-2xl font-bold text-gray-800">Read & Earn Articles</h3>
          <p class="text-gray-600 mt-2">Read interesting articles and earn money for your time</p>
      </div>

      <!-- Articles Grid -->
      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${articles.map(article => `
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop" alt="Article" class="w-full h-48 object-cover">
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-green-600 font-bold">KES ${article.earning_amount}</span>
              </div>
              <h4 class="text-lg font-bold text-gray-800 mb-2">${article.title}</h4>
              <p class="text-gray-600 text-sm mb-4">${article.content.substring(0, 100)}...</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">~${Math.ceil(article.content.length / 1500)} min read</span>
                <button data-article-id="${article.id}" class="read-article-btn bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200">
                  Read & Earn
                </button>
              </div>
            </div>
          </div>
        `).join('')}
        ${articles.length === 0 ? `<p class="text-center col-span-full py-12 text-gray-500">No articles available right now.</p>` : ''}
      </div>
    </div>
  `;

  document.querySelectorAll('.read-article-btn').forEach(button => {
    button.addEventListener('click', () => {
      const articleId = button.dataset.articleId;
      window.loadUserSection('article-view', user, { articleId });
    });
  });
}
