import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "@/views/app/App"
import { APP_ID } from "@/configs"

const container = document.createElement("div");
container.id = `${APP_ID}-app`;
document.body.appendChild(container);
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
