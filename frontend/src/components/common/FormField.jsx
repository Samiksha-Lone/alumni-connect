import React from 'react';

export default function FormField({
  id,
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  textarea = false,
  rows = 4,
  className = '',
  ...props
}) {
  const baseClassName = `form-input ${className}`.trim();

  return (
    <label className="block" htmlFor={id}>
      {label ? <span className="form-label">{label}</span> : null}
      {textarea ? (
        <textarea
          id={id}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`${baseClassName} min-h-[120px] resize-y`}
          {...props}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClassName}
          {...props}
        />
      )}
    </label>
  );
}
