
function Home(props) {

  const user = {}

  if (props.logged) {
    user.firstName = props.logged.firstName
    user.lastName = props.logged.lastName
  }

  return (
    <div className="home">
      <h1>Home</h1>
      <p>Hello {
        user.firstName ?
        user.firstName + ' ' + user.lastName :
        'stranger' }
      </p>
    </div>
  )
}

export default Home;