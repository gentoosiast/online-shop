export const isFullNameValid = (value: string) => {
  const words = value.trim().split(' ');
  const isLengthValid = words.every(word => word.length>=3);
  return words.length >= 2 && isLengthValid;
};

export const isPhoneNumberValid = (value: string) => {
  return (value[0] === '+') && (value.length>=10) && !isNaN(Number(value.slice(1)));
}

export const isAddressValid = (value: string) => {
  const words = value.trim().split(' ');
  const isLengthValid = words.every(word => word.length>=5);
  return words.length >= 3 && isLengthValid;
};

export const isEmailValid = (value: string) => {
  const reg = /^\S+@\S+\.\S+$/;
  return reg.test(value);
};
