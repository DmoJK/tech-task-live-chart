import { MainPage } from "@/pages/MainPage"
import { FirstPage } from "@/pages/FirstPage"
import { SecondPage } from "@/pages/SecondPage"
import { Navigate, Route, Routes } from "react-router-dom"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/first" element={<FirstPage />} />
        <Route path="/second" element={<SecondPage />} />
        <Route path="*" element={<Navigate replace to={"/main"} />} />
      </Routes>
    </div>
  )
}

export default App
