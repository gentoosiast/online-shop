import cardDefaultImg from '../../assets/card-default.svg';
import cardVISAImg from '../../assets/card-visa.svg';
import cardMasterCardImg from '../../assets/card-mastercard.svg';
import cardAmExImg from '../../assets/card-amex.svg';
import React, { useReducer, useState } from 'react';
import { validators } from './validators'

interface ISegment {
  quantity: number;
  separator: string;
}

export const OrderForm = () => {
  interface IFormInput {
    value: string;
    maxLength?: number;
    segments?: ISegment;
    label: string;
    isValid: boolean;
    validator: (value: string) => string | null;
  }

  enum CreditProviderImage {
    Default = cardDefaultImg,
    VISA = cardVISAImg,
    MasterCard = cardMasterCardImg,
    AmericanExpress = cardAmExImg
  }

  type IFormInputNames = keyof Omit<IFormData, "global">;
  type IErrors = Record<IFormInputNames, string | null>;

  interface IFormGlobal {
    errors: Partial<IErrors>;
    cardImage: CreditProviderImage;
  }

  interface IFormData {
    global: IFormGlobal;
    fullName: IFormInput;
    phone: IFormInput;
    address: IFormInput;
    email: IFormInput;
    cardNumber: IFormInput;
    cardExpiration: IFormInput;
    cardCVV: IFormInput;
  }

  const enum ActionType {
    'change',
    'validation',
  }

  const isKeyOfFormData = (value: string): value is IFormInputNames => {
    return value in initialState && value !== 'global';
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isKeyOfFormData(name)) {
      return;
    }
    dispatch({ type: ActionType.change, payload: { name, value } });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isKeyOfFormData(name)) {
      return;
    }
    dispatch({ type: ActionType.validation, payload: { name, value } });
  };

  const handleKeydownOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
      'ArrowLeft',
      'ArrowRight',
      'Backspace',
      'Home',
      'End',
      'Tab',
      'Delete',
      'Enter',
      'NumpadEnter',
    ];

    if (!allowedKeys.includes(e.key) && (e.key < '0' || e.key > '9')) {
      e.preventDefault();
    }
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  }

  const initialState: IFormData = {
    global: {
      errors: {},
      cardImage: CreditProviderImage.Default,
    },

    fullName: {
      value: '',
      label: 'Full Name:',
      isValid: false,
      validator: validators.fullName,
    },

    phone: {
      value: '+',
      label: 'Phone:',
      isValid: false,
      validator: validators.phone,
    },

    address: {
      value: '',
      label: 'Shipping address:',
      isValid: false,
      validator: validators.address,
    },

    email: {
      value: '',
      label: 'Email:',
      isValid: false,
      validator: validators.email,
    },

    cardNumber: {
      value: '',
      segments: {
        quantity: 4,
        separator: ' ',
      },
      maxLength: 16,
      label: 'Card number:',
      isValid: false,
      validator: validators.cardNumber,
    },

    cardExpiration: {
      value: '',
      segments: {
        quantity: 2,
        separator: '/',
      },
      maxLength: 4,
      label: 'Exp Date:',
      isValid: false,
      validator: validators.cardExpiration,
    },

    cardCVV: {
      value: '',
      maxLength: 3,
      label: 'CVV',
      isValid: false,
      validator: validators.cardCVV,
    }
  };

  const getClassName = (formField: IFormInputNames) => {
    const baseClassName = "form-input";
    if (formState.global.errors[formField]) {
      return `${baseClassName} form-input_invalid`;
    }

    if (formState[formField].isValid) {
      return `${baseClassName} form-input_valid`;
    }

    return baseClassName;
  }

  const formReducer = (state: IFormData, action: { type: ActionType, payload: { name: IFormInputNames; value: string; } }): IFormData => {
    switch (action.type) {
      case ActionType.change: {
        const {name} = action.payload;
        const item = state[name];
        const newValue = item.segments ? action.payload.value.split(item.segments.separator).join('') : action.payload.value;

        if (item.maxLength && newValue.length > item.maxLength) {
          return state;
        }

        if (name === 'cardNumber') {
          if (newValue.startsWith('3')) {
            state.global.cardImage = CreditProviderImage.AmericanExpress;
          } else if (newValue.startsWith('4')) {
            state.global.cardImage = CreditProviderImage.VISA;
          } else if (newValue.startsWith('5')) {
            state.global.cardImage = CreditProviderImage.MasterCard;
          } else {
            state.global.cardImage = CreditProviderImage.Default;
          }
        }

        item.value = item.segments ? splitWithSeparator(newValue, item.segments.quantity, item.segments.separator) : newValue;
        const validationMessage = item.validator(newValue);
        state[name].isValid = !validationMessage
        if (state.global.errors[name]) {
          state.global.errors[name] = validationMessage
        }

        return { ...state };
      }

      case ActionType.validation: {
        const {name} = action.payload;
        const item = state[name];
        const newValue = item.segments ? action.payload.value.split(item.segments.separator).join('') : action.payload.value;
        state.global.errors[name] = item.validator(newValue);
        state[name].isValid = !state.global.errors[name];

        return { ...state };
      }

      default:
        return state;
    }
  };

  const splitWithSeparator = (value: string, segmentLength: number, separator: string): string => {
    const regex = new RegExp(`.{1,${segmentLength}}`, 'g');
    const segments = value.split(separator).join('').match(regex);

    if (!segments) {
      return value;
    }

    return segments.join(separator);
  }

  const isFormValid = () => {
    return Object.keys(formState).every((name) => {
      if (!isKeyOfFormData(name)) {
        return true;
      }

      if (formState[name].isValid) {
        return true;
      }

      return false;
    });
  }

  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  return (
    <form className='order-form' autoComplete='off'>
      <fieldset className='form-fieldset'>
        <legend className='form-legend'>Personal Details</legend>
        <div className='form-field'>
          <label className='form-label' htmlFor='order-fullName'>{formState.fullName.label}</label>
          <input type="text" className={getClassName('fullName')} id="order-fullName" name="fullName" value={formState.fullName.value}
            onChange={handleChange} onBlur={handleBlur} />
          {formState.global.errors['fullName'] &&
            <p className='form-alert form-alert-error' role='alert'>{formState.global.errors['fullName']}</p>}
        </div>
        <div className='form-field'>
          <label className='form-label' htmlFor='order-phone'>{formState.phone.label}</label>
          <input type="text" className={getClassName('phone')} id="order-phone" name="phone" value={formState.phone.value}
            onChange={handleChange} onBlur={handleBlur} />
          {formState.global.errors['phone'] &&
            <p className='form-alert form-alert-error' role='alert'>{formState.global.errors['phone']}</p>}
        </div>
        <div className='form-field'>
          <label className='form-label' htmlFor='order-email'>{formState.email.label}</label>
          <input type="email" className={getClassName('email')} id="order-email" name="email" value={formState.email.value}
            onChange={handleChange} onBlur={handleBlur} />
          {formState.global.errors['email'] &&
            <p className='form-alert form-alert-error' role='alert'>{formState.global.errors['email']}</p>}
        </div>
        <div className='form-field'>
          <label className='form-label' htmlFor='order-address'>{formState.address.label}</label>
          <input type="text" className={getClassName('address')} id="order-address" name="address" value={formState.address.value}
            onChange={handleChange} onBlur={handleBlur} />
          {formState.global.errors['address'] &&
            <p className='form-alert form-alert-error' role='alert'>{formState.global.errors['address']}</p>}
        </div>
      </fieldset>
      <fieldset className='form-fieldset'>
        <legend className='form-legend'>Credit Card Information</legend>
        <div className='form-field'>
          <label className='form-label' htmlFor='order-card-number'>{formState.cardNumber.label}</label>
          <input type="text" className={getClassName('cardNumber')} id="order-card-number" name="cardNumber" placeholder="3 - AmEx; 4 - VISA; 5 - MasterCard"
            value={formState.cardNumber.value}
            onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeydownOnlyNumbers} />
          {formState.global.errors['cardNumber'] &&
            <p className='form-alert form-alert-error' role='alert'>{formState.global.errors['cardNumber']}</p>}
        </div>
        <div className='form-card-row'>
          <div className='form-card-image' role="img" aria-label="image representing type of the credit card"
            style={{backgroundImage: `url(${formState.global.cardImage})`}}></div>
          <div className='form-field'>
            <label className='form-label' htmlFor='order-card-expiration'>{formState.cardExpiration.label}</label>
            <input type="text" className={getClassName('cardExpiration')} id="order-card-expiration" name="cardExpiration" placeholder="mm / yy"
              value={formState.cardExpiration.value}
              onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeydownOnlyNumbers} />
          </div>
          <div className='form-field'>
            <label className='form-label' htmlFor='order-card-cvv'>{formState.cardCVV.label}</label>
            <input type="text" className={getClassName('cardCVV')} id="order-card-cvv" name="cardCVV" value={formState.cardCVV.value}
              onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeydownOnlyNumbers} />
          </div>
        </div>
        <div className="form-field">
          {formState.global.errors['cardExpiration'] &&
            <p className='form-alert form-alert-error' role='alert'>{formState.global.errors['cardExpiration'] }</p>}
        </div>
        <div className="form-field">
          {formState.global.errors['cardCVV'] &&
            <p className='form-alert form-alert-error' role='alert'>{formState.global.errors['cardCVV'] }</p>}
        </div>
      </fieldset>
      { isFormSubmitted &&
        <p className="form-alert form-alert-success" role="alert">Order Successful. Thank you so much for your order</p>}
      <button className='submit-button' type="submit" onSubmit={handleSubmit} disabled={!isFormValid()}>Order</button>
    </form>
  );
};
