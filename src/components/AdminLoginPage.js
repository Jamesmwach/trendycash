export function AdminLoginPage() {
  return `
    <div class="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <i data-lucide="user-cog" class="w-8 h-8 text-white"></i>
            </div>
            <h1 class="text-3xl font-bold text-white">Admin Panel</h1>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Administrator Login</h2>
          <p class="text-blue-200">Secure access to admin dashboard</p>
        </div>

        <!-- Admin Login Form -->
        <div class="glass-effect rounded-2xl p-8">
          <form id="adminLoginForm" class="space-y-6">
            <div>
              <label for="email" class="block text-white font-medium mb-2">Admin Email</label>
              <input 
                type="email" 
                id="email" 
                required
                value="admin@platform.com"
                class="input-field bg-white bg-opacity-10 text-white placeholder-blue-200 border-white border-opacity-20"
                placeholder="admin@platform.com"
              />
            </div>

            <div>
              <label for="password" class="block text-white font-medium mb-2">Admin Password</label>
              <input 
                type="password" 
                id="password" 
                required
                value="Admin@123"
                class="input-field bg-white bg-opacity-10 text-white placeholder-blue-200 border-white border-opacity-20"
                placeholder="Enter admin password"
              />
            </div>

            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Login as Admin
            </button>
          </form>

          <!-- Default Credentials Info -->
          <div class="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
            <h4 class="text-white font-bold mb-2">Default Admin Credentials:</h4>
            <p class="text-blue-200 text-sm">Email: admin@platform.com</p>
            <p class="text-blue-200 text-sm">Password: Admin@123</p>
          </div>

          <!-- Back to User Login -->
          <div class="mt-6 text-center">
            <p class="text-blue-200">
              Not an admin? 
              <a href="#login" class="text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-200">
                User login here
              </a>
            </p>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <a href="#home" class="text-white hover:text-blue-200 transition-colors duration-200">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  `;
}
