import { createRoot } from "react-dom/client"
import "@/app/styles/index.scss"
import App from "@/app/App.tsx"
import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClientApi } from "@/shared/api/api"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClientApi}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
)
