
/* create method takes user data from the view component and uses fetch to make POST call */
/* the response from the server is returned as a promise */
const create = async (user) => {
    try {
        let response = await fetch('/api/users/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* list method uses fetch to make a GET call for retrieving all users in db */
/* the response from the server is returned as a promise, when successful a User obj array  */
const list = async (signal) => {
    try {
      let response = await fetch('/api/users/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* read method uses fetch to make a GET call for retrieving a specific user by ID in db */
/* additionally, the requesting component must provide valid JWT received after sign-in */
/* the response from the server is returned as a promise, when successful a User obj or restriction notification */
const read = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/users/' + params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* update method uses fetch to make a PUT call to update the specific existing User in db */
/* additionally, the requesting component must provide valid JWT received after sign-in */
/* the response from the server is returned as a promise, when successful a server response to User update */
const update = async (params, credentials, user) => {
    try {
      let response = await fetch('/api/users/' + params.userId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(user)
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* remove method uses fetch to make a DELETE call, which deletes the specific existing user in db */
/* additionally, the requesting component must provide valid JWT received after sign-in */
/* the response from the server is returned as a promise, when successful a server response to User delete */
const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/users/' + params.userId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

export { create, list, read, update, remove }