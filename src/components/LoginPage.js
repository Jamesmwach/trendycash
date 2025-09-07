export function LoginPage() {
  return `
    <div class="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-white">Trendy Cash</h1>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
          <p class="text-blue-200">Sign in to continue earning</p>
        </div>

        <!-- Login Form -->
        <div class="glass-effect rounded-2xl p-8">
          <form id="loginForm" class="space-y-6">
            <div>
              <label for="email" class="block text-white font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                required
                class="input-field bg-white bg-opacity-10 text-white placeholder-blue-200 border-white border-opacity-20"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label for="password" class="block text-white font-medium mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                required
                class="input-field bg-white bg-opacity-10 text-white placeholder-blue-200 border-white border-opacity-20"
                placeholder="Enter your password"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center text-white">
                <input type="checkbox" class="mr-2 rounded">
                <span class="text-sm">Remember me</span>
              </label>
              <a href="#forgot-password" class="text-yellow-300 hover:text-yellow-200 text-sm transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 py-3 rounded-lg font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <!-- Admin Login Link -->
          <div class="mt-6 pt-6 border-t border-white border-opacity-20 text-center">
            <a href="#admin" class="text-yellow-300 hover:text-yellow-200 text-sm transition-colors duration-200">
              Admin Login
            </a>
          </div>

          <!-- Sign Up Link -->
          <div class="mt-6 text-center">
            <p class="text-blue-200">
              Don't have an account? 
              <a href="#signup" class="text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-200">
                Sign up here
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
