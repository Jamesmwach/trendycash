import { getSiteSettings, updateSiteSettings } from '../../services/admin.js';

export async function renderAdminSettings(container) {
  const settings = await getSiteSettings() || {};

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
        <div class="p-6 border-b"><h3 class="text-xl font-bold">Site Settings</h3></div>
        <form id="adminSettingsForm" class="p-6 space-y-6">
            <div>
                <label class="block font-medium text-gray-700">Site Name</label>
                <input type="text" name="site_name" value="${settings.site_name || 'Trendy Cash'}" class="input-field mt-1">
            </div>
            <div>
                <label class="block font-medium text-gray-700">Default Currency</label>
                <input type="text" name="default_currency" value="${settings.default_currency || 'KES'}" class="input-field mt-1">
            </div>
            <div>
                <label class="block font-medium text-gray-700">Site Logo URL</label>
                <input type="text" name="logo_url" value="${settings.logo_url || ''}" placeholder="https://example.com/logo.png" class="input-field mt-1">
            </div>
            <div>
                <label class="block font-medium text-gray-700">Favicon URL</label>
                <input type="text" name="favicon_url" value="${settings.favicon_url || ''}" placeholder="https://example.com/favicon.ico" class="input-field mt-1">
            </div>
            <button type="submit" class="btn-primary">Save Settings</button>
        </form>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('adminSettingsForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const settingsData = Object.fromEntries(formData.entries());
        // Add id for upsert to work correctly
        settingsData.id = 1; 
        
        try {
            await updateSiteSettings(settingsData);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Error saving settings.');
        }
    });
  }, 0);
}
