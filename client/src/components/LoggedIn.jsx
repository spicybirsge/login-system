export default function LoggedIn(props) {
const logout = () => {
  window.localStorage.clear()
  window.location.href = '/'

}

    return <><h1>Hello {props.data.data.username}</h1>
    <br/>
    <button onClick={logout}>Logout</button>
    </>
}