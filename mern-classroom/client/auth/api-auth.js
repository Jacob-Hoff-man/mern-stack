
/* signin method uses fetch to make a POST call, which verifies user */
/* the response from the server is returned as a promise, when successful a JWT is returned */
const signin = async (user) => {
    try {
      let response = await fetch('/auth/signin/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* signout method uses fetch to make a GET call to the signout API endpoint on the server */
/* the response from the server is returned as a promise, an API request success response */
const signout = async () => {
    try {
      let response = await fetch('/auth/signout/', { method: 'GET' })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

export { signin, signout }