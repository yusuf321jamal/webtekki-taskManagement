const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
}) => {
  const baseStyles = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s",
    opacity: disabled || loading ? 0.6 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: "#007bff",
      color: "white",
    },
    secondary: {
      backgroundColor: "#6c757d",
      color: "white",
    },
    danger: {
      backgroundColor: "#dc3545",
      color: "white",
    },
  };

  const styles = { ...baseStyles, ...variants[variant] };

  return (
    <button
      type={type}
      onClick={onClick}
      style={styles}
      disabled={disabled || loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
