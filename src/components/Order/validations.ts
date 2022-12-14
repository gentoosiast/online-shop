export const isFullNameValid = (value: string) => {
  const words = value.trim().split(' ');
  const isLengthValid = words.every(word => word.length>=3);
  return words.length >= 2 && isLengthValid;
};
