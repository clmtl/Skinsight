export const patterns = {
  last_name: /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\-]*$/,
  first_name: /^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\-]*$/,
  email: /^\S+@\S+$/i,
  doctor_adeli: /^[0-9]*$/,
  phone: /^[0-9]*$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};
