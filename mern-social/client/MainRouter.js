import React from 'react'
import {Route, Switch} from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
/* React component imports */
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import Menu from './core/Menu'

/* renders the custom React component with respect to the first child of the route path specified */
/* new routes are injected into the application via specification in the switch statement */
/* the order of placement in Switch is important */
const MainRouter = () => {
    return ( 
    <div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>
      </Switch>
    </div>
   )
}

export default MainRouter