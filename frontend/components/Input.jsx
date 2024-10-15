import styles from "../styles/Input.module.css";

const Select = (props) => {
  return (
    <select
      {...props}
      className={`${styles.inputStyle} ${props.className}`}>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const Input = (props) => {
  const placeholderText = props.placeholder || props.name;

  switch (props.type) {
    case "select":
      return (
        <Select
          {...props}
          className={`${styles.inputStyle} ${props.className}`}
        />
      );
    default:
      return (
        <input
          {...props}
          className={`${styles.inputStyle} ${props.className}`}
          placeholder={placeholderText}
        />
      );
  }
};
