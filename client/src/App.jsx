import logo from './logo.svg';
import {useState, useEffect} from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import urls from "./variables/urls"
import LoggedIn from './components/LoggedIn';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const validateToken = async() => {
      const token = window.localStorage.getItem('token')
      if(!token) {
        setData({})
        setIsLoggedIn(false)
        setLoading(false)
        return;
      }

      const getTokenData = await fetch(urls.backend+'/get-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      })

      const data = await getTokenData.json()

      if(data.success) {
        setData(data)
        setIsLoggedIn(true)
        setLoading(false)
        return;
      } else {
        setData({})
        setIsLoggedIn(false)
        setLoading(false)
        return;
      }


    }
    validateToken()
  }, [])

  if(loading) {
    return <></>
  }
    return (<BrowserRouter>

    <Routes>
      <Route path='/' element={isLoggedIn ? <LoggedIn data={data}/>: <Navigate to="/login"/>}/>
      <Route path='/login' element={isLoggedIn ? <Navigate to="/"/> : <Login/>}/>
      <Route path='/register' element={isLoggedIn ? <Navigate to="/"/> : <Register/>}/>
    </Routes>
    </BrowserRouter>)
  
 
}

export default App;
