import { getAvailableTriviaCategories } from '../../services/user.js';

export async function renderUserTrivia(container, user) {
  const categories = await getAvailableTriviaCategories();

  container.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg mb-8">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-2xl font-bold text-gray-800">Daily Trivia Challenge</h3>
          <p class="text-gray-600 mt-2">Answer questions correctly to earn money!</p>
        </div>
        <div class="p-6">
          <div class="text-center py-12">
            <h4 class="text-xl font-bold text-gray-800 mb-2">Ready to Test Your Knowledge?</h4>
            <p class="text-gray-600 mb-6">Select a category below or start a random session.</p>
            <button data-category-id="" class="start-trivia-btn bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
              Start Random Session
            </button>
          </div>
        </div>
      </div>

      <!-- Trivia Categories -->
      <div id="trivia-categories" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${categories.map(cat => `
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h4 class="text-lg font-bold text-gray-800 mb-2">${cat.name}</h4>
            <p class="text-gray-600 text-sm mb-4">${cat.trivia_questions[0].count} questions available</p>
            <button data-category-id="${cat.id}" class="start-trivia-btn w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">Start</button>
          </div>
        `).join('')}
        ${categories.length === 0 ? `<p class="text-center col-span-full py-12 text-gray-500">No trivia categories available right now.</p>` : ''}
      </div>
    </div>
  `;

  document.querySelectorAll('.start-trivia-btn').forEach(button => {
    button.addEventListener('click', () => {
        const categoryId = button.dataset.categoryId;
        window.loadUserSection('trivia-game', user, { categoryId });
    });
  });
}
