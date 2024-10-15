import { useState } from "react";

export const useForm = (initialValues = {}) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (fn) => (e) => {
    e.preventDefault();
    // faire quelque chose avec le formData
    fn();
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};
