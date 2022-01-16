import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import useToken from './components/useToken';
import MainApp from './MainApp';

function App() {
  const { getToken, removeToken, setToken } = useToken();
  const [activePage, setActivePage] = useState("New Poll");

  return(
    <Router>
      <Routes>
        <Route path="/" element={<MainApp/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
