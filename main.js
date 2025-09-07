import './style.css';
import { createSupabaseClient, getCurrentUser, signOut } from './src/services/supabase.js';
import { HomePage } from './src/components/HomePage.js';
import { LoginPage } from './src/components/LoginPage.js';
import { SignupPage } from './src/components/SignupPage.js';
import { UserDashboard } from './src/components/UserDashboard.js';
import { AdminPanel } from './src/components/AdminPanel.js';
import { AdminLoginPage } from './src/components/AdminLoginPage.js';

class App {
  constructor() {
    this.currentPage = 'home';
    this.user = null;
    this.isAdmin = false;
    this.init();
  }

  async init() {
    // Make showNotification globally accessible
    window.showNotification = this.showNotification;
    await this.checkAuth();
    this.setupRouting();
    this.render();
  }

  async checkAuth() {
    try {
      const user = await getCurrentUser();
      this.user = user;
      
      if (user) {
        const { data: profile } = await createSupabaseClient().from('profiles').select('is_admin').eq('id', user.id).single();
        if (profile && profile.is_admin) {
          this.isAdmin = true;
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }

  setupRouting() {
    const path = window.location.pathname;
    const hash = window.location.hash.substring(1);
    
    if (path === '/admin' || hash === 'admin') {
      this.currentPage = this.isAdmin ? 'admin-panel' : 'admin-login';
    } else if (this.user) {
      this.currentPage = this.isAdmin ? 'admin-panel' : 'dashboard';
    } else {
      this.currentPage = hash || 'home';
    }

    window.addEventListener('hashchange', () => {
      this.handleNavigation(window.location.hash.substring(1));
    });

    window.addEventListener('popstate', () => {
      this.handleNavigation(window.location.hash.substring(1));
    });
  }

  handleNavigation(page) {
    if (page === 'admin') {
      this.currentPage = this.isAdmin ? 'admin-panel' : 'admin-login';
    } else if (page === 'logout') {
      this.handleLogout();
      return;
    } else if (this.user && !this.isAdmin) {
      this.currentPage = 'dashboard';
    } else if (!this.user) {
      this.currentPage = page || 'home';
    }
    
    this.render();
  }

  async handleLogout() {
    try {
      await signOut();
      this.user = null;
      this.isAdmin = false;
      this.currentPage = 'home';
      window.location.hash = '';
      this.render();
      this.showNotification('Logged out successfully', 'success');
    } catch (error) {
      this.showNotification('Logout failed', 'error');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 transform translate-x-full ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
      notification.style.transform = 'translateX(calc(100% + 1rem))';
      notification.addEventListener('transitionend', () => notification.remove());
    }, 3000);
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear previous content

    // Create a container for the modal
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
    
    switch (this.currentPage) {
      case 'home':
        app.innerHTML = HomePage();
        break;
      case 'login':
        app.innerHTML = LoginPage();
        this.setupLoginHandlers();
        break;
      case 'signup':
        app.innerHTML = SignupPage();
        this.setupSignupHandlers();
        break;
      case 'dashboard':
        app.innerHTML = UserDashboard(this.user);
        break;
      case 'admin-login':
        app.innerHTML = AdminLoginPage();
        this.setupAdminLoginHandlers();
        break;
      case 'admin-panel':
        app.innerHTML = AdminPanel(this.user);
        break;
      default:
        app.innerHTML = HomePage();
    }
  }

  setupLoginHandlers() {
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
          const { signInWithPassword } = await import('./src/services/supabase.js');
          const { user } = await signInWithPassword(email, password);
          
          await this.checkAuth(); // Re-check auth to get admin status
          
          if (this.isAdmin) {
            this.currentPage = 'admin-panel';
            window.location.hash = 'admin';
          } else {
            this.currentPage = 'dashboard';
            window.location.hash = 'dashboard';
          }
          
          this.render();
          this.showNotification('Login successful!', 'success');
        } catch (error) {
          this.showNotification(error.message, 'error');
        }
      });
    }
  }

  setupSignupHandlers() {
    const form = document.getElementById('signupForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const fullName = document.getElementById('fullName').value;
        
        try {
          const { signUpWithPassword } = await import('./src/services/supabase.js');
          await signUpWithPassword(email, password, { full_name: fullName });
          
          this.showNotification('Account created successfully! Please check your email for verification.', 'success');
          this.currentPage = 'login';
          window.location.hash = 'login';
          this.render();
        } catch (error) {
          this.showNotification(error.message, 'error');
        }
      });
    }
  }

  setupAdminLoginHandlers() {
    const form = document.getElementById('adminLoginForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
          const { signInWithPassword } = await import('./src/services/supabase.js');
          const { user } = await signInWithPassword(email, password);
          
          await this.checkAuth();

          if (this.isAdmin) {
            this.currentPage = 'admin-panel';
            this.render();
            this.showNotification('Admin login successful!', 'success');
          } else {
            await signOut(); // Sign out if not an admin
            this.showNotification('Invalid admin credentials', 'error');
          }
        } catch (error) {
          this.showNotification(error.message, 'error');
        }
      });
    }
  }
}

// Initialize the app
new App();
