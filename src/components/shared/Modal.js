export function renderModal({ title, content, footer }) {
  const modalRoot = document.getElementById('modal-root');
  
  const modalHTML = `
    <div id="modal-overlay" class="modal-overlay">
      <div class="modal-container">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-xl font-bold text-gray-800">${title}</h3>
          <button id="close-modal-btn" class="p-2 hover:bg-gray-200 rounded-full">
            <i data-lucide="x" class="w-5 h-5 text-gray-600"></i>
          </button>
        </div>
        <div class="p-6">${content}</div>
        <div class="flex justify-end p-4 bg-gray-50 border-t space-x-3">
          ${footer}
        </div>
      </div>
    </div>
  `;

  modalRoot.innerHTML = modalHTML;
  
  const overlay = document.getElementById('modal-overlay');
  
  // Trigger transition
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
    // Render the icon inside the modal
    const closeBtn = document.getElementById('close-modal-btn');
    if(closeBtn) {
        const { createIcons } = require('lucide');
        createIcons({
            nodes: [closeBtn.querySelector('i')]
        });
    }
  });

  // Close functionality
  const closeModal = () => {
    overlay.classList.remove('visible');
    overlay.addEventListener('transitionend', () => modalRoot.innerHTML = '', { once: true });
  };

  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      closeModal();
    }
  });

  return { closeModal };
}
