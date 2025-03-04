import { useNavigate } from "react-router-dom"

const MainPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate("/first")}>First Test Task</button>
      <button onClick={() => navigate("/second")}>Second Test Task</button>
    </div>
  )
}

export default MainPage
