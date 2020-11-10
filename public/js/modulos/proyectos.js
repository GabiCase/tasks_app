import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");

if (btnEliminar) {
  btnEliminar.addEventListener("click", (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl;

    Swal.fire({
      title: "Seguro?",
      text: "Es una acción irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${location.origin}/proyectos/${urlProyecto}`;

        axios
          .delete(url, { params: { urlProyecto } })
          .then((res) => {
            Swal.fire("Borrado!", res.data, "success"),
              setTimeout(() => {
                window.location.href = "/";
              }, 3000);
          })
          .catch(() => {
            Swal.fire({
              type: "error",
              title: "Hubo un error",
              text: "No pudo eliminarse el proyecto",
            });
          });
      }
    });
  });
}

export default btnEliminar;
