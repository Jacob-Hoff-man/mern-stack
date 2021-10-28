
/* listNewsFeed method makes a fetch request to the API, which gets/displays the related posts */
/* this method will load the posts that are rendered in the FE NewsFeed component */
const listNewsFeed = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/posts/feed/'+ params.userId, {
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

/* listByUser method loads the required posts for PostList */
const listByUser = async (params, credentials) => {
    try {
      let response = await fetch('/api/posts/by/'+ params.userId, {
        method: 'GET',
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

/* create method makes a fetch call to the create API */
const create = async (params, credentials, post) => {
    try {
      let response = await fetch('/api/posts/new/'+ params.userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: post
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* remove method makes a delete call to remove a post */
const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/' + params.postId, {
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

/* like method is used when a user clicks the like button to update likes array on Post */
const like = async (params, credentials, postId) => {
    try {
      let response = await fetch('/api/posts/like/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* unlike method is used when a user clicks the unlike button to update likes array on Post */
const unlike = async (params, credentials, postId) => {
    try {
      let response = await fetch('/api/posts/unlike/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* comment method is used to submit a new comment */
/* the method sends the user's Id, post Id, and comment obj from the view with the add comment request */
const comment = async (params, credentials, postId, comment) => {
    try {
      let response = await fetch('/api/posts/comment/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId, 
                              comment: comment})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

/* uncomment method is used to remove a specific comment */
/* the method sends the user's Id, post Id, and comment obj from the view with the remove comment request */
const uncomment = async (params, credentials, postId, comment) => {
    try {
      let response = await fetch('/api/posts/uncomment/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, postId: postId, comment: comment})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
}

export {
    listNewsFeed,
    listByUser,
    create,
    remove,
    like,
    unlike,
    comment,
    uncomment
}