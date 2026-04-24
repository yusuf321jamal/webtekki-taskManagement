const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  name,
}) => {
  const inputStyles = {
    width: "100%",
    padding: "10px",
    border: `1px solid ${error ? "#dc3545" : "#ddd"}`,
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s",
  };

  const containerStyles = {
    marginBottom: "15px",
  };

  const labelStyles = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500",
    color: "#333",
  };

  const errorStyles = {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "5px",
  };

  return (
    <div style={containerStyles}>
      {label && (
        <label style={labelStyles}>
          {label} {required && <span style={{ color: "#dc3545" }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyles}
      />
      {error && <div style={errorStyles}>{error}</div>}
    </div>
  );
};

export default Input;
