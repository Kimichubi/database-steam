export const generateConfirmationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Gera um código de 6 dígitos
};
