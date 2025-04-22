import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Resize from './components/resize'
import { BrowserRouter } from 'react-router-dom'
import "../src/index.css"
// import { initGA, logPageView } from "./analytics";


function App() {
  // const location = useLocation();

  // useEffect(() => {
  //   initGA();
  // }, []);

  // useEffect(() => {
  //   logPageView();
  // }, [location]);

  return (
    <>
    <Resize />
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Resize />} />
        </Routes>
      </BrowserRouter> */}
    </>
  )
}

export default App
