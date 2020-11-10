import axios from "axios";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avance";

const tareas = document.querySelector(".listado-pendientes");

if (tareas) {
  tareas.addEventListener("click", (e) => {
    if (e.target.classList.contains("check")) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;

      const url = `${location.origin}/tareas/${idTarea}`;

      axios.patch(url, { idTarea }).then(function (respuesta) {
        if (respuesta.status === 200) {
          icono.classList.toggle("completo");

          actualizarAvance();
        }
      });
    }

    if (e.target.classList.contains("fa-trash")) {
      const tareaHTML = e.target.parentElement.parentElement;
      const idTarea = tareaHTML.dataset.tarea;

      Swal.fire({
        title: "Seguro que quieres borrar esta tarea?",
        text: "Es una acción irreversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Borrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const url = `${location.origin}/tareas/${idTarea}`;
          axios.delete(url, { params: { idTarea } }).then(function (respuesta) {
            if (respuesta.status === 200) {
              tareaHTML.parentElement.removeChild(tareaHTML);
              Swal.fire("Tarea Eliminada", respuesta.data, "success");
              actualizarAvance();
            }
          });
        }
      });
    }
  });
}

export default tareas;
