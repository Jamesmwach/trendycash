export function renderModal({ title, content, footer }) {
  const modalRoot = document.getElementById('modal-root');
  
  const modalHTML = `
    <div id="modal-overlay" class="modal-overlay">
      <div class="modal-container">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-xl font-bold text-gray-800">${title}</h3>
          <button id="close-modal-btn" class="p-2 hover:bg-gray-200 rounded-full">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
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
