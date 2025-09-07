import { renderAdminDashboard } from './AdminDashboard.js';
import { renderManageUsers } from './ManageUsers.js';
import { renderManageTrivia } from './ManageTrivia.js';
import { renderManageArticles } from './ManageArticles.js';
import { renderManageSubscriptions } from './ManageSubscriptions.js';
import { renderManageTransactions } from './ManageTransactions.js';
import { renderManageReferrals } from './ManageReferrals.js';
import { renderAdminSettings } from './AdminSettings.js';

// Make loadAdminSection globally available
window.loadAdminSection = async function(section) {
  // Update active link
  document.querySelectorAll('.admin-sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === section);
  });

  const content = document.getElementById('admin-main-content');
  const headerTitle = document.getElementById('admin-header-title');
  
  if (!content || !headerTitle) return;

  // Show loading spinner
  content.innerHTML = `<div class="flex justify-center items-center h-64"><div class="loading-spinner"></div></div>`;

  const sections = {
    'dashboard': { title: 'Admin Dashboard', renderer: renderAdminDashboard },
    'users': { title: 'Manage Users', renderer: renderManageUsers },
    'trivia': { title: 'Manage Trivia', renderer: renderManageTrivia },
    'articles': { title: 'Manage Articles', renderer: renderManageArticles },
    'subscriptions': { title: 'Manage Subscription Plans', renderer: renderManageSubscriptions },
    'transactions': { title: 'Manage Transactions', renderer: renderManageTransactions },
    'referrals': { title: 'Manage Referrals', renderer: renderManageReferrals },
    'settings': { title: 'Site Settings', renderer: renderAdminSettings },
  };
  
  if (sections[section]) {
    headerTitle.textContent = sections[section].title;
    try {
      // The renderer function is async and will replace the loading spinner
      await sections[section].renderer(content);
    } catch (error) {
      console.error(`Failed to load section ${section}:`, error);
      content.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">Could not load this section. Please try again later.</span>
      </div>`;
    }
  }

  // Close mobile sidebar on navigation
  if (window.innerWidth < 1024) {
    document.getElementById('admin-sidebar')?.classList.add('-translate-x-full');
  }
}

export function AdminPanel(user) {
  // We will attach events after rendering
  setTimeout(() => {
    attachAdminPanelListeners();
    // Load initial dashboard content
    window.loadAdminSection('dashboard');
  }, 0);

  return `
    <div class="min-h-screen bg-gray-100">
      <!-- Admin Sidebar -->
      <div id="admin-sidebar" class="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white shadow-xl z-40 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        <div class="p-6">
          <div class="flex items-center space-x-2 mb-8">
            <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h1 class="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav id="admin-nav" class="space-y-2">
            <a href="#" class="admin-sidebar-link active" data-section="dashboard">Dashboard</a>
            <a href="#" class="admin-sidebar-link" data-section="users">Manage Users</a>
            <a href="#" class="admin-sidebar-link" data-section="trivia">Manage Trivia</a>
            <a href="#" class="admin-sidebar-link" data-section="articles">Manage Articles</a>
            <a href="#" class="admin-sidebar-link" data-section="subscriptions">Manage Plans</a>
            <a href="#" class="admin-sidebar-link" data-section="transactions">Transactions</a>
            <a href="#" class="admin-sidebar-link" data-section="referrals">Referrals</a>
            <a href="#" class="admin-sidebar-link" data-section="settings">Site Settings</a>
            <a href="#logout" class="admin-sidebar-link text-red-400 hover:bg-red-500 hover:text-white">Logout</a>
          </nav>
        </div>
      </div>

      <!-- Mobile menu button -->
      <button id="adminMobileMenuBtn" class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
      </button>

      <!-- Main Content -->
      <div class="lg:ml-64 min-h-screen">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b">
          <div class="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 id="admin-header-title" class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm text-gray-500">Admin</div>
                <div class="font-medium text-gray-800">${user?.email}</div>
              </div>
              <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
            </div>
          </div>
        </div>

        <!-- Dynamic Content Area -->
        <div id="admin-main-content" class="p-6">
          <!-- Content will be loaded here -->
        </div>
      </div>
    </div>

    <style>
      .admin-sidebar-link { display: block; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 500; transition: all 0.2s; }
      .admin-sidebar-link:hover { background-color: rgba(255, 255, 255, 0.1); }
      .admin-sidebar-link.active { background-color: #3b82f6; color: white; }
    </style>
  `;
}

function attachAdminPanelListeners() {
  // Mobile menu toggle
  document.getElementById('adminMobileMenuBtn')?.addEventListener('click', function() {
    document.getElementById('admin-sidebar')?.classList.toggle('-translate-x-full');
  });

  // Sidebar navigation
  document.getElementById('admin-nav')?.addEventListener('click', (e) => {
    if (e.target.matches('.admin-sidebar-link')) {
      e.preventDefault();
      const section = e.target.dataset.section;
      if (section) {
        window.loadAdminSection(section);
      } else if (e.target.getAttribute('href') === '#logout') {
        window.location.hash = 'logout';
      }
    }
  });
}
