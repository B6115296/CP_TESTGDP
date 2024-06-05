import { useEffect } from "react";
import Swal from "sweetalert2";

const SweetAlertModal = ({ isOpen, onClose, title, message, icon }) => {
  useEffect(() => {
    if (isOpen) {
      Swal.fire({
        title: title || "",
        html: message || "",
        icon: icon || "info",
        showCancelButton: false,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        onClose();
      });
    }
  }, [isOpen, onClose, title, message, icon]);

  return null;
};

export default SweetAlertModal;
