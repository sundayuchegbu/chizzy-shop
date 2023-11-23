export const shortenText = (text, n) => {
  if (text.length > n) {
    const shortenedText = text.substring(0, n).concat('...');
    return shortenedText;
  }
  return text;
};

// validate email
export const validateEmail = (email) => {
  return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
};
