import React from "react";
import { PersonalDetails } from "./components/Order/FullNameInput";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IItem } from './types/IItem'; // TODO: temporary hack

export function App() {
  return (
    <div className="max-w-xs m-auto text-center text-emerald-700">
      Welcome aboard, best teammate on the planet Earth 🤗
      <PersonalDetails/>
    </div>
  );
}
