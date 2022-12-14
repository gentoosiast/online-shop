export const isFullNameValid = (value: string) => {
  const words = value.trim().split(' ');

  return words.length >= 2;
};
