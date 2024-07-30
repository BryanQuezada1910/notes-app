document.addEventListener("DOMContentLoaded", function () {
  const sidenav = document.querySelectorAll(".sidenav");
  const modals = document.querySelectorAll(".modal");
  M.Sidenav.init(sidenav);
  M.Modal.init(modals, {
    startingTop: "30%",
    endingTop: "30%",
  });

  // Obtener las notas cuando la página se carga
  getNotes();
});

const notes = document.getElementById("notes");

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

const getNotes = async () => {
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) {
      if (res.status === 404) {
        notes.innerHTML = "<p>No hay notas</p>";
      } else if (res.status === 500) {
        notes.innerHTML =
          "<p>Error al obtener las notas. Por favor, inténtalo de nuevo más tarde.</p>";
      }
      return;
    }

    const notesData = await res.json();

    if (notesData.length === 0) {
      notes.innerHTML = "<p>No hay notas</p>";
      return;
    }

    notes.innerHTML = "";
    notesData.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("col", "s12", "m6");
      noteElement.innerHTML = `
      <div class="card" style="background-color:#222831">
        <div class="card-content">
          <span class="card-title" style="font-weight:600; color:#fd7014">${
            note.title
          }</span>
          <p style="margin-bottom:30px">${note.content}</p>
          <p class="right" style="color:#b5b3b3;">${formatDate(
            note.createdAt
          )}</p>
        </div>
        <div id="card-action-id" class="card-action">
          <button style="margin-right:5px; text-transform:none; background-color:#222831; color:#fd7014; border-radius: 50px; font-weight:600" class="delete-button btn" data-id="${
            note._id
          }">Eliminar<i class="material-icons right">delete_forever</i></button>
          <button style="margin-right:5px; text-transform:none; background-color:#222831; color:#fd7014; border-radius: 50px; font-weight:600" class="update-button btn" data-id="${
            note._id
          }" data-title="${note.title}" data-content="${
        note.content
      }">Actualizar<i class="material-icons right">update</i></button>
        </div>
      </div>
      `;
      notes.appendChild(noteElement);
    });
  } catch (error) {
    console.error("Error al obtener las notas:", error);
    notes.innerHTML =
      "<p>Error al obtener las notas. Por favor, inténtalo de nuevo más tarde.</p>";
  }
};

notes.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-button")) {
    const noteId = event.target.getAttribute("data-id");
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (res.ok) {
        getNotes(); // Refresh the notes list
        M.toast({
          html: "Nota eliminada correctamente",
          classes: "toast-custom rounded",
        }); // Actualizar etiquetas de Materialize
      } else {
        alert("No se pudo eliminar la nota. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
    }
  }
});

notes.addEventListener("click", async (event) => {
  if (event.target.classList.contains("update-button")) {
    const noteId = event.target.getAttribute("data-id");
    const title = event.target.getAttribute("data-title");
    const content = event.target.getAttribute("data-content");
    const modal = M.Modal.getInstance(document.getElementById("update-modal"));

    // Pre-rellenar los campos del modal con los datos de la nota
    document.getElementById("update-title").value = title;
    document.getElementById("update-content").value = content;

    // Abrir el modal
    modal.open();

    // Actualizar la nota al hacer clic en el botón de actualización del modal
    document.getElementById("update-note-btn").onclick = async () => {
      const updatedTitle = document.getElementById("update-title").value;
      const updatedContent = document.getElementById("update-content").value;

      if (!updatedTitle || !updatedContent) {
        M.toast({
          html: "Por favor, introduce un título y contenido para la nota",
          classes: "toast-custom rounded",
          displayLength: 2000,
          inDuration: 300,
          outDuration: 375,
        });
        return;
      }

      if (updatedTitle === title && updatedContent === content) {
        M.toast({
          html: "Por favor, actualiza el título o el contenido de la nota",
          classes: "toast-custom rounded",
          displayLength: 2000,
          inDuration: 300,
          outDuration: 375,
        });
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
          M.toast({
            html: "Nota actualizada correctamente",
            classes: "toast-custom rounded",
          });
          modal.close();
        } else {
          alert(
            "No se pudo actualizar la nota. Por favor, inténtalo de nuevo."
          );
        }
      } catch (error) {
        console.error("Error al actualizar la nota:", error);
        alert("No se pudo actualizar la nota. Por favor, inténtalo de nuevo.");
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
    M.toast({
      html: "Por favor, introduce el título y el contenido de la nota",
      classes: "toast-custom rounded",
      displayLength: 2000,
      inDuration: 300,
      outDuration: 375,
    });
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
      M.toast({
        html: "Nota creada correctamente",
        classes: "toast-custom rounded",
      }); // Actualizar etiquetas de Materialize
      resetButton.click();
      return;
    } else {
      alert("No se pudo crear la nota. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error al crear la nota:", error);
  }
});
