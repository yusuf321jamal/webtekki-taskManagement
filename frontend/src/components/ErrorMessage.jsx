const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  const errorStyles = {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
    position: "relative",
  };

  const closeStyles = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#721c24",
  };

  return (
    <div style={errorStyles}>
      {message}
      {onClose && (
        <button onClick={onClose} style={closeStyles}>
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
