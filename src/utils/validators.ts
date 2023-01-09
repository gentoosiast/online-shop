import { isValidEmail } from 'js-email-validation';

const checkWordsLength = (value: string, numWords: number, wordLength: number) => {
  const words = value.trim().split(' ').filter((word) => word !== '');

  return words.length >= numWords && words.every((word) => word.length >= wordLength);
}

export const validators = {
  fullName: (value: string) => {
    if (!checkWordsLength(value, 2, 3)) {
      return 'Должно быть введено не менее 2х слов, каждое длиной более 3х символов';
    }
    return null;
  },

  phone: (value: string) => {
    if (!/^\+\d{9,}$/.test(value)) {
      return 'Номер телефона должен начинаться с "+" и содержать не менее 9 цифр';
    }
    return null;
  },

  address: (value: string) => {
    if (!checkWordsLength(value, 3, 5)) {
      return 'Должно быть введено не менее 3х слов, каждое длиной не менее 5 символов';
    }
    return null;
  },

  email: (value: string) => {
    if (!isValidEmail(value)) {
      return "Должен быть введен действительный email";
    }
    return null;
  },

  cardNumber: (value: string) => {
    if (!/^\d{16}$/.test(value)) {
      return 'Номер кредитной карты должен состоять из 16 цифр';
    }
    return null;
  },

  cardExpiration: (value: string) => {

    if (!(value.length === 4 && /^(0[1-9]|1[0-2])\d{2}$/.test(value))) {
      return 'Дата истечения срока действия карты должна состоять из 4 цифр; месяца должны быть введены в формате 01 - 12';
    }

    const month = parseInt(value.slice(0, 2), 10) - 1; // the month used by Date() is 0-indexed
    const year = 2000 + parseInt(value.slice(2));
    const cardDate = new Date(year, month, 1);
    cardDate.setMonth(cardDate.getMonth() + 1);
    const currentDate = new Date();

    if (currentDate > cardDate) {
      return 'Ваша кредитная карта имеет истекший срок действия';
    }

    return null;
  },

  cardCVV: (value: string) => {
    if (!/^\d{3}$/.test(value)) {
      return 'CVV должен состоять из 3 цифр';
    }
    return null;
  }
};
