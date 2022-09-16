import { Link } from "react-router-dom"
import urls from '../variables/urls'

export default function Login() {

    const login = async() => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if(!username || !password) {
            return document.getElementById('login-status-info').innerText = `Fill Up All The Fields`
        }

        const submitData = await fetch(urls.backend+'/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const data = await submitData.json()
        if(data.success) {
           window.localStorage.setItem('token', data.token);
           return window.location.href = '/'
        } else {

            return document.getElementById('login-status-info').innerText = data.message  
        }
    }
    return (<>
    <h4 id="login-status-info">Login</h4>
        <input type="text" name="username" id="username" placeholder="username" required></input><br/>
        <input type="password" name="password" id="password" placeholder="password" required></input><br/>
<button onClick={login}>Login</button><br/>
<Link to="/register">Sign Up?</Link>
</>
    )
}