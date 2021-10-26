import { signout } from './api-auth.js'

const auth = {
  /* authenticate method saves the JWT credentials that are received from the server */
  /* credentials are stored in sessionStorage after confirming in-browser, and thus access to sessionStorage */
  /* callback function cb is executed and allows the component to define post-success signin/storing creds actions */
  authenticate(jwt, cb) {
    if(typeof window !== "undefined")
        sessionStorage.setItem('jwt', JSON.stringify(jwt))
    cb()
  },

  /* retrieve stored credentials and check if the current user is signed in */
  /* returns either the stored credential or false */
  isAuthenticated() {
    if (typeof window == "undefined")
      return false
    if (sessionStorage.getItem('jwt'))
      return JSON.parse(sessionStorage.getItem('jwt'))
    else
      return false
  },

  /* clear the stored JWT credentials from sessionStorage after a successful signout */
  /* callback function cb allows the component initiating the signout post-success signout functionality */
  clearJWT(cb) {
    if(typeof window !== "undefined")
      sessionStorage.removeItem('jwt')
    cb()
    signout().then((data) => {
        document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
  }

}

export default auth
