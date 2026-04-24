import { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease-out",
  };

  const modalStyles = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "24px",
    maxWidth: "450px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    animation: "slideIn 0.3s ease-out",
  };

  const headerStyles = {
    marginBottom: "20px",
  };

  const titleStyles = {
    fontSize: "24px",
    fontWeight: "600",
    color: type === "danger" ? "#dc3545" : "#333",
    marginBottom: "8px",
  };

  const messageStyles = {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.5",
  };

  const buttonGroupStyles = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  };

  const confirmButtonStyles = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: type === "danger" ? "#dc3545" : "#28a745",
    color: "white",
    transition: "all 0.2s",
  };

  const cancelButtonStyles = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#6c757d",
    color: "white",
    transition: "all 0.2s",
  };

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyles}>
          <h3 style={titleStyles}>{title}</h3>
          <p style={messageStyles}>{message}</p>
        </div>
        <div style={buttonGroupStyles}>
          <button
            style={cancelButtonStyles}
            onClick={onClose}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#5a6268")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#6c757d")
            }
          >
            {cancelText}
          </button>
          <button
            style={confirmButtonStyles}
            onClick={onConfirm}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                type === "danger" ? "#c82333" : "#218838")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                type === "danger" ? "#dc3545" : "#28a745")
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from {
              transform: translateY(-50px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
