import { getUserDashboardData } from '../services/user.js';
import { renderDashboardHome } from './user/DashboardHome.js';
import { renderUserTrivia } from './user/UserTrivia.js';
import { renderUserArticles } from './user/UserArticles.js';
import { renderUserSubscriptions } from './user/UserSubscriptions.js';
import { renderUserTransactions } from './user/UserTransactions.js';
import { renderUserReferrals } from './user/UserReferrals.js';
import { renderUserProfile } from './user/UserProfile.js';
import { renderTriviaGame } from './user/TriviaGame.js';
import { renderArticleView } from './user/ArticleView.js';
import { renderSubscriptionPayment } from './user/SubscriptionPayment.js';
import { createIcons } from 'lucide';

// Make loadUserSection globally available
window.loadUserSection = async function(section, user, payload = {}) {
  // Update active link
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === section.split('-')[0]);
  });

  const content = document.getElementById('main-content');
  if (!content) return;

  // Show loading spinner
  content.innerHTML = `<div class="flex justify-center items-center h-64"><div class="loading-spinner"></div></div>`;

  const sections = {
    'dashboard-home': renderDashboardHome,
    'trivia': renderUserTrivia,
    'articles': renderUserArticles,
    'subscriptions': renderUserSubscriptions,
    'transactions': renderUserTransactions,
    'referrals': renderUserReferrals,
    'profile': renderUserProfile,
    // Sub-sections
    'trivia-game': renderTriviaGame,
    'article-view': renderArticleView,
    'subscription-payment': renderSubscriptionPayment,
  };
  
  if (sections[section]) {
    try {
      await sections[section](content, user, payload);
    } catch (error) {
      console.error(`Failed to load section ${section}:`, error);
      window.showNotification(`Error loading section: ${error.message}`, 'error');
      content.innerHTML = `<div class="text-center text-red-500">Failed to load content.</div>`;
    }
  }

  // Close mobile sidebar on navigation
  if (window.innerWidth < 1024) {
    document.getElementById('sidebar')?.classList.add('-translate-x-full');
  }
}

async function setupDashboard(container, user) {
  const profile = await getUserDashboardData(user.id);
  
  const avatarHTML = profile.avatar_url 
    ? `<img id="header-avatar-img" src="${profile.avatar_url}" class="w-10 h-10 rounded-full object-cover">`
    : `<div id="header-avatar-initials" class="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold">${(profile.full_name || user.email)?.charAt(0).toUpperCase()}</div>`;

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <div id="sidebar" class="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        <div class="p-6">
          <div class="flex items-center space-x-2 mb-8">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <i data-lucide="credit-card" class="w-6 h-6 text-white"></i>
            </div>
            <h1 class="text-xl font-bold text-gray-800">Trendy Cash</h1>
          </div>

          <nav id="user-sidebar-nav" class="space-y-2">
            <a href="#" class="sidebar-link active" data-section="dashboard-home">Dashboard</a>
            <a href="#" class="sidebar-link" data-section="trivia">Trivia</a>
            <a href="#" class="sidebar-link" data-section="articles">Articles</a>
            <a href="#" class="sidebar-link" data-section="subscriptions">Subscriptions</a>
            <a href="#" class="sidebar-link" data-section="transactions">Transactions</a>
            <a href="#" class="sidebar-link" data-section="referrals">Referrals</a>
            <a href="#" class="sidebar-link" data-section="profile">Profile</a>
            <a href="#logout" class="sidebar-link text-red-600 hover:text-red-700 hover:bg-red-50">Logout</a>
          </nav>
        </div>
      </div>

      <!-- Mobile menu button -->
      <button id="mobileMenuBtn" class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg">
        <i data-lucide="menu" class="w-6 h-6"></i>
      </button>

      <!-- Main Content -->
      <div class="lg:ml-64 min-h-screen">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b">
          <div class="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Welcome back, ${profile.full_name || user.email}!</h1>
              <p class="text-gray-600">Here's your earning overview</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm text-gray-500">Total Balance</div>
                <div id="user-balance" class="text-2xl font-bold text-green-600">KES ${profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div id="header-avatar-container">
                ${avatarHTML}
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Content Area -->
        <div id="main-content" class="p-6">
          <!-- Content will be loaded here -->
        </div>
      </div>
    </div>
  `;

  // Attach listeners after render
  setTimeout(() => {
    createIcons(); // Render icons in the dashboard layout

    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('-translate-x-full');
    });

    document.getElementById('user-sidebar-nav')?.addEventListener('click', (e) => {
      e.preventDefault();
      const link = e.target.closest('.sidebar-link');
      if (!link) return;

      const section = link.dataset.section;
      if (section) {
        window.loadUserSection(section, user);
      } else if (link.getAttribute('href') === '#logout') {
        window.location.hash = 'logout';
      }
    });

    // Load initial section
    window.loadUserSection('dashboard-home', user);
  }, 0);
}

export function UserDashboard(user) {
  const container = document.createElement('div');
  container.id = 'user-dashboard-wrapper';
  container.innerHTML = `<div class="flex justify-center items-center h-screen"><div class="loading-spinner"></div></div>`;
  
  setupDashboard(container, user).catch(err => {
    console.error("Failed to setup dashboard:", err);
    window.showNotification('Failed to load your dashboard. Please try again.', 'error');
    // Potentially sign out user if profile fails to load
    window.location.hash = 'logout';
  });

  return container.outerHTML;
}
