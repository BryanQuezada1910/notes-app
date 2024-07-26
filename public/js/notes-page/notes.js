document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  getNotes();
});

const notes = document.getElementById("notes");

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
          <span class="card-title" style="font-weight:600; color:#fd7014">${note.title}</span>
          <p>${note.content}</p>
        </div>
        <div class="card-action">
          <button style="text-transform:none; background-color:#fd7014; color:#222831; border-radius: 50px;" class="delete-button btn" data-id="${note._id}">Eliminar</button>
          <button style="text-transform:none; background-color:#fd7014; color:#222831; border-radius: 50px;" class="update-button btn" data-id="${note._id}">Actualizar</button>
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
      } else {
        alert("No se pudo eliminar la nota. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al eliminar la nota:", error);
      alert("No se pudo eliminar la nota. Por favor, inténtalo de nuevo.");
    }
  }
});

notes.addEventListener("click", async (event) => {
  if (event.target.classList.contains("update-button")) {
    const noteId = event.target.getAttribute("data-id");
    const title = prompt("Introduce el nuevo título de la nota:");
    const content = prompt("Introduce el nuevo contenido de la nota:");

    if (!title || !content) {
      alert("Por favor, introduce un título y contenido para la nota.");
      return;
    }

    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        getNotes(); // Refresh the notes list
      } else {
        alert("No se pudo actualizar la nota. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      alert("No se pudo actualizar la nota. Por favor, inténtalo de nuevo.");
    }
  }
});

const newNoteForm = document.getElementById("new-note-form");

newNoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    alert("Por favor, introduce un título y contenido para la nota.");
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
      newNoteForm.reset();
      M.updateTextFields(); // Actualizar etiquetas de Materialize
    } else {
      alert("No se pudo crear la nota. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error al crear la nota:", error);
    alert("No se pudo crear la nota. Por favor, inténtalo de nuevo.");
  }
});