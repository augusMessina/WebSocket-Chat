export const checkSpecialChars = (str: string) => {
  const specialChars = /[`!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
  if (specialChars.test(str) || str.includes(" ")) {
    throw new Error("username cant contain special characters or spaces");
  }
};
