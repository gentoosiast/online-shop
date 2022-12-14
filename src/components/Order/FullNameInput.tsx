import React, { useState } from "react";
import { isFullNameValid } from './validations';

export function FullNameInput() {
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value)
    if (fullNameError && isFullNameValid(e.target.value)) {
      setFullNameError(false);
    }
    setFullName(e.target.value)
  };

  // e: React.FocusEvent<HTMLInputElement>
  const handleBlur = () => {
    setFullNameError(!isFullNameValid(fullName))
  }

  const getClassName = () => {
    const baseClassName = "form-input";
    if (fullNameError) {
      return `${baseClassName} form-input_invalid`;
    }

    if (!fullNameError && fullName.length > 0) {
      return `${baseClassName} form-input_valid`;
    }

    return baseClassName;
  }

  return (
    <div className="form-field">
      <label className="form-label" htmlFor="fullname-input">Full Name:</label>
      <input type="text" className={getClassName()} id="fullname-input" name="fullname-input"
        value={fullName} onBlur={handleBlur} onChange={handleChange}></input>
      {fullNameError &&
        <p className="form-alert" role="alert">Full Name should consist of at least two words, three characters each</p>
      }
    </div>
  );
}
