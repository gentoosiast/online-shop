import React, { useState } from "react";
import { isAddressValid, isEmailValid, isFullNameValid, isPhoneNumberValid } from './validations';

export function PersonalDetails() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [fullNameError, setFullNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "fullname-input") {
      setFullName(e.target.value)
      if (fullNameError && isFullNameValid(e.target.value)) {
        setFullNameError(false);
      }
    } else if (e.target.name === "phone-input") {
      setPhone(e.target.value)
      if (phoneError && isPhoneNumberValid(e.target.value)) {
        setPhoneError(false);
      }
    } else if (e.target.name === "address-input") {
      setAddress(e.target.value)
      if (addressError && isAddressValid(e.target.value)) {
        setAddressError(false);
      }
    } else if (e.target.name === "email-input") {
      setEmail(e.target.value)
      if (emailError && isEmailValid(e.target.value)) {
        setEmailError(false);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "fullname-input") {
      setFullNameError(!isFullNameValid(fullName))
    } else if (e.target.name === "phone-input") {
      setPhoneError(!isPhoneNumberValid(phone))
    } else if (e.target.name === "address-input") {
      setAddressError(!isAddressValid(address))
    } else if (e.target.name === "email-input") {
      setEmailError(!isEmailValid(email))
    }
  }

  const getClassName = (name:string) => {
    const baseClassName = "form-input";
    const validClassName = `${baseClassName} form-input_invalid`;
    const invalidClassName = `${baseClassName} form-input_valid`;
    if (name === "fullname-input") {
      if (fullNameError) return validClassName;
      if (!fullNameError && fullName.length > 0) return invalidClassName;
    } else if (name === "phone-input") {
      if (phoneError) return validClassName;
      if (!phoneError && phone.length > 0) return invalidClassName;
    } else if (name === "address-input") {
      if (addressError) return validClassName;
      if (!addressError && address.length > 0) return invalidClassName;
    } else if (name === "email-input") {
      if (emailError) return validClassName;
      if (!emailError && email.length > 0) return invalidClassName;
    }
    return baseClassName;
  }

  return (
    <div className="form-field">
      <div>
        <h2 className="form-subtitle">Personal information</h2>
        <div className="form-item">
          <label className="form-label" htmlFor="fullname-input">Full Name:</label>
          <input type="text" className={getClassName("fullname-input")} id="fullname-input" name="fullname-input"
            value={fullName} onBlur={handleBlur} onChange={handleChange}></input>
        </div>
        {fullNameError &&
            <p className="form-alert" role="alert">Full Name should consist of at least two words, three characters each</p>
          }
        <div className="form-item">
          <label className="form-label" htmlFor="phone-input">Phone number:</label>
          <input type="tel" className={getClassName("phone-input")} id="phone-input" name="phone-input"
            minLength={9}
            pattern="[+][0-9]{9,}"
            value={phone} onBlur={handleBlur} onChange={handleChange}
            ></input>
        </div>
        {phoneError &&
            <p className="form-alert" role="alert">Phone number should start with '+' and consist of at least nine digits</p>
          }
        <div className="form-item">
          <label className="form-label" htmlFor="address-input">Delivery address:</label>
          <input type="text" className={getClassName("address-input")} id="address-input" name="address-input"
            value={address} onBlur={handleBlur} onChange={handleChange}
            ></input>
        </div>
        {addressError &&
            <p className="form-alert" role="alert">Address should consist of at least three words, five characters each</p>
          }
          <div className="form-item">
          <label className="form-label" htmlFor="email-input">E-mail:</label>
          <input type="email" className={getClassName("email-input")} id="email-input" name="email-input"
            pattern="/^\S+@\S+\.\S+$/"
            value={email} onBlur={handleBlur} onChange={handleChange}
            ></input>
        </div>
        {emailError &&
            <p className="form-alert" role="alert">Should be a valid e-mail</p>
          }
      </div>
    </div>
  );
}
