import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { FactPage } from '@/factpage';
import {Compiled} from '@/Compiled';
import { Ap } from '@/Ap';


function App() {
  const [count, setCount] = useState([]);
  const [results,setResults] = useState([]);
  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route index element = {<Compiled/>}></Route>
          <Route path="/factpage" element =  {<FactPage/>}></Route>
          <Route path="/Ap" element =  {<Ap/>}></Route>
        </Routes>
        </BrowserRouter>
        
        
        
      </div>
    
    </>
  )
}

export default App
