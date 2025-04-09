document.addEventListener("DOMContentLoaded", function () {
  // Inicializar el menú móvil
  initMobileMenu();
  
  // Inicializar modal
  initModal();
  
  // Obtener información del usuario
  getUserInfo();
  
  // Obtener las notas cuando la página se carga
  getNotes();
});

// Inicialización del menú móvil
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMobileMenu = document.getElementById('close-mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }
  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }
}

// Inicialización del modal
function initModal() {
  const updateModal = document.getElementById('update-modal');
  const updateModalBackdrop = document.getElementById('update-modal-backdrop');
  const updateModalCancel = document.getElementById('update-modal-cancel');
  
  if (updateModalCancel) {
    updateModalCancel.addEventListener('click', () => {
      updateModal.classList.add('hidden');
    });
  }
  
  if (updateModalBackdrop) {
    updateModalBackdrop.addEventListener('click', () => {
      updateModal.classList.add('hidden');
    });
  }
}

// Función para obtener la información del usuario
async function getUserInfo() {
  try {
    const res = await fetch('/auth/user/profile');
    if (!res.ok) {
      console.error('Error al obtener información del usuario');
      return;
    }
    
    const userData = await res.json();
    
    // Actualizar el avatar y nombre de usuario en desktop
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    
    // Actualizar el avatar y nombre de usuario en móvil
    const mobileUserAvatar = document.getElementById('mobile-user-avatar');
    const mobileUserName = document.getElementById('mobile-user-name');
    
    if (userData.profileImage) {
      if (userAvatar) userAvatar.src = userData.profileImage;
      if (mobileUserAvatar) mobileUserAvatar.src = userData.profileImage;
    }
    
    if (userData.displayName) {
      if (userName) userName.textContent = userData.displayName;
      if (mobileUserName) mobileUserName.textContent = userData.displayName;
    }
    
    // También personalizar el título si hay nombre de usuario
    if (userData.displayName) {
      const title = document.querySelector('h1');
      if (title) {
        title.innerHTML = `
          Hola, <span class="text-indigo-500">${userData.displayName.split(' ')[0]}</span>
          <span class="material-icons align-middle text-3xl ml-2">edit_note</span>
        `;
      }
    }
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
  }
}

const notes = document.getElementById("notes");

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

// Actualizar la función getNotes() para generar tarjetas uniformes con contenido limitado
const getNotes = async () => {
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) {
      if (res.status === 404) {
        notes.innerHTML = `
          <div class="col-span-full text-center py-8">
            <p class="text-gray-500 text-lg">No hay notas disponibles</p>
          </div>
        `;
      } else if (res.status === 500) {
        notes.innerHTML = `
          <div class="col-span-full text-center py-8">
            <p class="text-red-500 text-lg">Error al obtener las notas. Por favor, inténtalo de nuevo más tarde.</p>
          </div>
        `;
      }
      return;
    }

    const notesData = await res.json();

    if (notesData.length === 0) {
      notes.innerHTML = `
        <div class="col-span-full text-center py-8">
          <p class="text-gray-500 text-lg">No hay notas disponibles. ¡Comienza creando una!</p>
        </div>
      `;
      return;
    }

    notes.innerHTML = "";
    notesData.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.innerHTML = `
        <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 h-64 flex flex-col cursor-pointer note-card" data-id="${note._id}">
          <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-xl font-semibold mb-2 text-indigo-500 line-clamp-2">${note.title}</h3>
            <p class="text-gray-600 mb-4 overflow-hidden line-clamp-3 flex-grow">${note.content}</p>
            <div class="flex justify-between items-center mt-auto">
              <span class="text-xs text-gray-400">${formatDate(note.createdAt)}</span>
              <div class="flex space-x-2">
                <button class="update-button p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200" data-id="${note._id}" data-title="${note.title}" data-content="${note.content}">
                  <span class="material-icons text-indigo-500">edit</span>
                </button>
                <button class="delete-button p-2 rounded-full hover:bg-red-50 transition-colors duration-200" data-id="${note._id}">
                  <span class="material-icons text-red-500">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      notes.appendChild(noteElement);
      
      // Añadir evento de clic a la tarjeta para ver la nota completa
      const card = noteElement.querySelector('.note-card');
      card.addEventListener('click', (e) => {
        // Evitar que se active si se hizo clic en los botones
        if (!e.target.closest('.update-button') && !e.target.closest('.delete-button')) {
          // Mostrar la nota completa en un modal
          showFullNoteModal(note);
        }
      });
    });
  } catch (error) {
    console.error("Error al obtener las notas:", error);
    notes.innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-red-500 text-lg">Error al obtener las notas. Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    `;
  }
};

// Función para mostrar una nota completa en un modal
function showFullNoteModal(note) {
  // Crear el modal dinámicamente
  const modalHTML = `
    <div id="full-note-modal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div id="full-note-modal-backdrop" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-2xl font-semibold text-indigo-500">${note.title}</h3>
              <span class="text-sm text-gray-400">${formatDate(note.createdAt)}</span>
            </div>
            <div class="mt-3">
              <p class="text-gray-600 whitespace-pre-wrap">${note.content}</p>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button id="full-note-modal-close" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Insertar el modal en el DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Configurar los event listeners para cerrar el modal
  const fullNoteModal = document.getElementById('full-note-modal');
  const fullNoteModalBackdrop = document.getElementById('full-note-modal-backdrop');
  const fullNoteModalClose = document.getElementById('full-note-modal-close');
  
  fullNoteModalClose.addEventListener('click', () => {
    document.body.removeChild(fullNoteModal);
  });
  
  fullNoteModalBackdrop.addEventListener('click', () => {
    document.body.removeChild(fullNoteModal);
  });
}

notes.addEventListener("click", async (event) => {
  // Detener la propagación del evento en los botones
  if (event.target.closest('.update-button') || event.target.closest('.delete-button')) {
    event.stopPropagation();
  }
  
  // Delegación de eventos para el botón de eliminar
  const deleteButton = event.target.closest('.delete-button');
  if (deleteButton) {
    const noteId = deleteButton.getAttribute("data-id");
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (res.ok) {
        getNotes(); // Refresh the notes list
        showToast("Nota eliminada correctamente");
      } else {
        showToast("No se pudo eliminar la nota", true);
      }
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
      showToast("Error al eliminar la nota", true);
    }
  }
  
  // Delegación de eventos para el botón de actualizar
  const updateButton = event.target.closest('.update-button');
  if (updateButton) {
    const noteId = updateButton.getAttribute("data-id");
    const title = updateButton.getAttribute("data-title");
    const content = updateButton.getAttribute("data-content");
    const updateModal = document.getElementById("update-modal");

    // Pre-rellenar los campos del modal con los datos de la nota
    document.getElementById("update-title").value = title;
    document.getElementById("update-content").value = content;

    // Mostrar el modal
    updateModal.classList.remove('hidden');

    // Actualizar la nota al hacer clic en el botón de actualización del modal
    document.getElementById("update-note-btn").onclick = async () => {
      const updatedTitle = document.getElementById("update-title").value;
      const updatedContent = document.getElementById("update-content").value;

      if (!updatedTitle || !updatedContent) {
        showToast("Por favor, introduce un título y contenido para la nota", true);
        return;
      }

      if (updatedTitle === title && updatedContent === content) {
        showToast("Por favor, actualiza el título o el contenido de la nota", true);
        return;
      }

      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedTitle,
            content: updatedContent,
          }),
        });

        if (res.ok) {
          getNotes(); // Refrescar la lista de notas
          showToast("Nota actualizada correctamente");
          updateModal.classList.add('hidden');
        } else {
          showToast("No se pudo actualizar la nota", true);
        }
      } catch (error) {
        console.error("Error al actualizar la nota:", error);
        showToast("Error al actualizar la nota", true);
      }
    };
  }
});

const newNoteForm = document.getElementById("new-note-form");

newNoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const resetButton = document.getElementById("cancel-button");

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    showToast("Por favor, introduce el título y el contenido de la nota", true);
    return;
  }

  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      getNotes(); // Refresh the notes list
      showToast("Nota creada correctamente");
      resetButton.click();
    } else {
      showToast("No se pudo crear la nota", true);
    }
  } catch (error) {
    console.error("Error al crear la nota:", error);
    showToast("Error al crear la nota", true);
  }
});

// Función para mostrar notificaciones toast
function showToast(message, isError = false) {
  // Crear elemento toast
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 ${isError ? 'bg-red-500' : 'bg-gray-800'} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out opacity-0 translate-y-2`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Mostrar toast
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 10);
  
  // Ocultar toast después de 3 segundos
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}