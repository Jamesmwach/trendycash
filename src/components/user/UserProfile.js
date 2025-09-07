import { getUserDashboardData, updateUserProfile, uploadProfilePicture } from '../../services/user.js';

export async function renderUserProfile(container, user) {
  const profile = await getUserDashboardData(user.id);

  container.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg mb-8 p-6 border-b">
        <h3 class="text-2xl font-bold text-gray-800">Profile & Settings</h3>
        <p class="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Picture Section -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 text-center">
            <div id="avatar-container" class="relative w-32 h-32 mx-auto mb-4">
              <img id="avatar-img" src="${profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || user.email)}&background=random&color=fff`}" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover">
              <div id="avatar-loader" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-full hidden">
                <div class="loading-spinner !w-8 !h-8"></div>
              </div>
            </div>
            <button id="upload-avatar-btn" class="btn-secondary w-full" style="padding: 0.5rem 1rem;">Change Picture</button>
            <input type="file" id="avatar-upload-input" class="hidden" accept="image/png, image/jpeg">
          </div>
        </div>

        <!-- Profile Information -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-lg">
          <div class="p-6 border-b"><h4 class="text-xl font-bold text-gray-800">Personal Information</h4></div>
          <div class="p-6">
            <form id="profile-form" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" name="full_name" class="input-field" value="${profile.full_name || ''}">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" class="input-field bg-gray-100" value="${user.email}" disabled>
              </div>
              <button type="submit" class="btn-primary">Update Profile</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  // Event Listeners
  setTimeout(() => {
    document.getElementById('upload-avatar-btn')?.addEventListener('click', () => {
        document.getElementById('avatar-upload-input').click();
    });

    document.getElementById('avatar-upload-input')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const loader = document.getElementById('avatar-loader');
        loader.classList.remove('hidden');

        try {
            const updatedProfile = await uploadProfilePicture(user.id, file);
            document.getElementById('avatar-img').src = updatedProfile.avatar_url;
            
            // Also update the header avatar
            const headerAvatarContainer = document.getElementById('header-avatar-container');
            if(headerAvatarContainer) {
                headerAvatarContainer.innerHTML = `<img id="header-avatar-img" src="${updatedProfile.avatar_url}" class="w-10 h-10 rounded-full object-cover">`;
            }

            window.showNotification('Profile picture updated!', 'success');
        } catch (error) {
            window.showNotification(`Upload failed: ${error.message}`, 'error');
        } finally {
            loader.classList.add('hidden');
        }
    });

    document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = {
        full_name: formData.get('full_name'),
        };

        try {
        await updateUserProfile(user.id, updates);
        window.showNotification('Profile updated successfully!', 'success');
        // You might want to refresh the header or the whole page
        } catch (error) {
        window.showNotification(`Error: ${error.message}`, 'error');
        }
    });
  }, 0);
}
