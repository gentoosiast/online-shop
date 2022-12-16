const checkWordsLength = (value: string, numWords: number, wordLength: number) => {
  const words = value.trim().split(' ');

  return words.length >= numWords && words.every((word) => word.length >= wordLength);
}

export const validators = {
  fullName: (value: string) => {
    if (!checkWordsLength(value, 2, 3)) {
      return 'Full Name should consist of at least two words, three characters each';
    }
    return null;
  },

  phone: (value: string) => {
    if (!/^\+\d{9,}$/.test(value)) {
      return 'Phone number should start with "+" and consist of 9 digits or more';
    }
    return null;
  },

  address: (value: string) => {
    if (!checkWordsLength(value, 3, 5)) {
      return 'Address should consist of at least three words, five characters each';
    }
    return null;
  },

  email: (value: string) => {
    if (!/[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Email should be valid email address";
    }
    return null;
  },

  cardNumber: (value: string) => {
    if (!/^\d{16}$/.test(value)) {
      return 'Credit card number should consist of 16 digits';
    }
    return null;
  },

  cardExpiration: (value: string) => {
    if (!(value.length === 4 && value.slice(0, 2) <= '12')) {
      return 'Credit card expiration date should consist of 4 digits; month should be less than 12';
    }
    return null;
  },

  cardCVV: (value: string) => {
    if (!/^\d{3}$/.test(value)) {
      return 'CVV should consist of 3 digits';
    }
    return null;
  }
};
