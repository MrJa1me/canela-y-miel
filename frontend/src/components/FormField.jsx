// Campo de formulario reutilizable: etiqueta + campo + mensaje de error
function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
  min,
  maxLength,
  required = false,
}) {
  return (
    <div className="mb-3">
      {/* La etiqueta se une al campo con htmlFor/id */}
      <label htmlFor={id} className="form-label">
        {label}
      </label>

      {/* Si hay error, Bootstrap pinta el borde en rojo con "is-invalid" */}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        maxLength={maxLength}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={error ? "form-control is-invalid" : "form-control"}
      />

      {/* El mensaje solo aparece si existe un error */}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default FormField;
