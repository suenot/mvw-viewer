import { render } from "solid-js/web";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
root.textContent = ""; // drop the static loading shell from index.html
render(() => <App />, root);
