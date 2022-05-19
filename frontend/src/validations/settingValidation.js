const settingValidation = (values) => {
  const errors = {};

  if (!values.name || values.name === "") {
    errors.name = "Nama harus diisi";
  }

  if (!values.value || values.value === "") {
    errors.value = "Value harus diisi";
  }
  return errors
};

export default settingValidation;