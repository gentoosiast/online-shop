import "./css/main.css";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";

const rootDiv = document.getElementById("root");
if (!rootDiv) {
  throw new Error("#root is not found");
}
if (!(rootDiv instanceof HTMLDivElement)) {
  throw new Error("#root is not HTMLDivElement");
}

const root = ReactDOM.createRoot(rootDiv);
root.render(App());
