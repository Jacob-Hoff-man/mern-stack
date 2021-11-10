/* fetch method to create a new enrollment based on userId and courseId */
const create = async (params, credentials) => {
    try {
        let response = await fetch('/api/enrollment/new/'+params.courseId, {
          method: 'POST',
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

/* fetch method to retrieve the enrollment details to be rendered, based on enrollmentId */
const read = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/enrollment/' + params.enrollmentId, {
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

/* fetch method to put request to the complete enrollment route */
const complete = async (params, credentials, enrollment) => {
    try {
      let response = await fetch('/api/enrollment/complete/' + params.enrollmentId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify(enrollment)
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* retrieve and display the statistics for a published course */
const enrollmentStats = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/enrollment/stats/'+params.courseId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* queries the db and returns the enrolled enrollments for the specified user */
const listEnrolled = async (credentials, signal) => {
    try {
      let response = await fetch('/api/enrollment/enrolled', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}
  
const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/enrollment/' + params.enrollmentId, {
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
  
export {
    create,
    read,
    complete,
    remove,
    listEnrolled,
    enrollmentStats
}