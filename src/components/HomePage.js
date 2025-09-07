export function HomePage() {
  return `
    <div class="min-h-screen gradient-bg relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-xl animate-bounce-subtle"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white bg-opacity-5 rounded-full blur-xl animate-bounce-subtle" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white bg-opacity-5 rounded-full blur-xl animate-bounce-subtle" style="animation-delay: 2s;"></div>
      </div>

      <!-- Navigation -->
      <nav class="relative z-10 p-6">
        <div class="flex justify-between items-center max-w-6xl mx-auto">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <i data-lucide="credit-card" class="w-6 h-6 text-white"></i>
            </div>
            <h1 class="text-2xl font-bold text-white">Trendy Cash</h1>
          </div>
          
          <div class="hidden md:flex items-center space-x-6">
            <a href="#features" class="text-white hover:text-blue-200 transition-colors duration-200">Features</a>
            <a href="#pricing" class="text-white hover:text-blue-200 transition-colors duration-200">Pricing</a>
            <a href="#about" class="text-white hover:text-blue-200 transition-colors duration-200">About</a>
          </div>
          
          <div class="flex items-center space-x-4">
            <a href="#login" class="text-white hover:text-blue-200 transition-colors duration-200 font-medium">Login</a>
            <a href="#signup" class="bg-white bg-opacity-20 text-white px-6 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 font-medium backdrop-blur-sm">Get Started</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <div class="text-center max-w-4xl mx-auto">
          <!-- Main heading -->
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Start Earning with
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 animate-bounce-subtle">
              Trendy Cash
            </span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in" style="animation-delay: 0.2s;">
            Join thousands of users earning money through trivia challenges, article reading, and referral rewards. Your journey to financial freedom starts here.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style="animation-delay: 0.4s;">
            <a href="#signup" class="group relative bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <span class="relative z-10">Start Earning Now</span>
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a href="#login" class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:-translate-y-2">
              Sign In
            </a>
          </div>
          
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in" style="animation-delay: 0.6s;">
            <div class="glass-effect rounded-xl p-6 text-center">
              <div class="text-3xl font-bold text-white mb-2">10K+</div>
              <div class="text-blue-200">Active Users</div>
            </div>
            <div class="glass-effect rounded-xl p-6 text-center">
              <div class="text-3xl font-bold text-white mb-2">KES 2M+</div>
              <div class="text-blue-200">Total Earnings</div>
            </div>
            <div class="glass-effect rounded-xl p-6 text-center">
              <div class="text-3xl font-bold text-white mb-2">99.9%</div>
              <div class="text-blue-200">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div id="features" class="relative z-10 py-20 px-6">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            How You Can <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Earn Money</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Trivia Feature -->
            <div class="glass-effect rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-lucide="help-circle" class="w-8 h-8 text-white"></i>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Daily Trivia</h3>
              <p class="text-blue-200 mb-6">Answer fun trivia questions daily and earn KES 50-200 per correct answer. The more you know, the more you earn!</p>
              <div class="text-yellow-300 font-bold text-lg">Earn up to KES 1,000/day</div>
            </div>

            <!-- Articles Feature -->
            <div class="glass-effect rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-lucide="file-text" class="w-8 h-8 text-white"></i>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Read & Earn</h3>
              <p class="text-blue-200 mb-6">Read interesting articles and get paid for your time. Each article completion earns you KES 25-100.</p>
              <div class="text-yellow-300 font-bold text-lg">Earn up to KES 500/day</div>
            </div>

            <!-- Referrals Feature -->
            <div class="glass-effect rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-lucide="users" class="w-8 h-8 text-white"></i>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Refer Friends</h3>
              <p class="text-blue-200 mb-6">Invite friends to join Trendy Cash and earn 20% commission from their activities for life!</p>
              <div class="text-yellow-300 font-bold text-lg">Unlimited earning potential</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="relative z-10 py-20 px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Start Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Earning Journey?</span>
          </h2>
          <p class="text-xl text-blue-200 mb-8">Join thousands of users who are already earning with Trendy Cash. It's free to get started!</p>
          <a href="#signup" class="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 px-12 py-4 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
            Get Started - It's Free!
          </a>
        </div>
      </div>
    </div>
  `;
}
