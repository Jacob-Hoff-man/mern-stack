/* fetch method to make a POST request to the create API */
/* passes the multipart form data */
/* used to submit the user-entered course details to the BE to create new course */
const create = async (params, credentials, course) => {
    try {
        let response = await fetch('/api/courses/by/'+ params.userId, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          },
          body: course
        })
        return response.json()

    } catch(err) { 
        console.log(err)
    }
}

/* fetch method to list all the courses in the db */
const list = async (signal) => {
    try {
      let response = await fetch('/api/courses/', {
        method: 'GET',
        signal: signal,
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* fetch method API endpoint to read the course details from the db */
const read = async (params, signal) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* fetch method to load list of courses based on userId */
/* takes the userId value in order to gen API route */
const listByInstructor = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/courses/by/'+params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
}

/* fetch method to add a new lesson in the FE by accessing newLesson API route */
const newLesson = async (params, credentials, lesson) => {
    try {
      let response = await fetch('/api/courses/'+params.courseId+'/lesson/new', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({lesson:lesson})
      })
      return response.json()
    } catch(err){
      console.log(err)
    }
}

/* fetch method to update a course in the FE */
const update = async (params, credentials, course) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: course
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* fetch method to remove a course in the FE */
const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/courses/' + params.courseId, {
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

/* fetch method to get a list of all published courses in the FE */
const listPublished = async (signal) => {
  try {
    let response = await fetch('/api/courses/published', {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
  create,
  list,
  read,
  listByInstructor,
  newLesson,
  update,
  remove,
  listPublished

}