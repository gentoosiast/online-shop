import React, { useState } from "react";
import { isFullNameValid } from './validations';

export function FullNameInput() {
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error && isFullNameValid(fullName)) {
      setError(false);
    }
    setFullName(e.target.value)
  };

  // e: React.FocusEvent<HTMLInputElement>
  const handleBlur = () => {
    console.log("full", fullName.split(' '));
    if (!isFullNameValid(fullName)) {
      setError(true);
    }
  }

  const getClassName = () => {
    const baseClassName = "form-input";
    if (error) {
      return `${baseClassName} form-input_invalid`;
    }

    if (!error && fullName.length > 0) {
      return `${baseClassName} form-input_valid`;
    }

    return baseClassName;
  }

  return (
    <div className="form-field">
      <label className="form-label" htmlFor="fullname-input">Full Name:</label>
      <input type="text" className={getClassName()} id="fullname-input"
        value={fullName} onBlur={handleBlur} onChange={handleChange}></input>
      {error &&
        <p className="form-alert" role="alert">Full Name should consist of at least two words</p>
      }
    </div>
  );
}
