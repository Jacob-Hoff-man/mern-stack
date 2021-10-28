/* imports */
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Divider from '@material-ui/core/Divider'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'
import FollowProfileButton from './../user/FollowProfileButton'
import ProfileTabs from './../user/ProfileTabs'
import {listByUser} from './../post/api-post.js'

/* styles are injected into the component using the hook returned by makeStyles */
const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle
  },
  largeAvatar: {
      width: 60,
      height: 60,
      margin: 10
  }
}))

/* function defining the React component */
export default function Profile({ match }) {
    const classes = useStyles()
    /* initialize the state values with an empty user and set redirectToSignin to false */
    const [values, setValues] = useState({
        user: {following:[], followers:[]},
        redirectToSignin: false,
        following: false
    })
    /* initialize the array of posts to state */
    const [posts, setPosts] = useState([])

    /* JWT is retrieved from sessionStorage using isAuthenticated */
    const jwt = auth.isAuthenticated()

    /* photoURL is constructed from the state */
    /* add time value to photourl to bypass browser's default caching behavior */
    const photoUrl = values.user._id ? `/api/users/photo/${values.user._id}?${new Date().getTime()}` : '/api/users/defaultphoto'

    /* this effect needs to rerun when the userId param changes in the route, hence the second arg */
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        /* uses match.params.userId val and calls read User fetch method */
        /* authentication JWT is passed into read to verify */
        read({
            userId: match.params.userId
        }, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
            console.log("errror")
            setValues({...values, redirectToSignin: true})
        } else {
            console.log("setting user")
            /* check if signed-in user is already following the user in profile with checkFollow */
            let following = checkFollow(data)
            setValues({...values, user: data, following: following })
            loadPosts(data._id)
        }
        })
  
        return function cleanup(){
            abortController.abort()
        }
  
    }, [match.params.userId])
    
    /* return match if user is in signed-in user's followers list, else undefined */ 
    const checkFollow = (user) => {
        const match = user.followers.some((follower) => {
            return follower._id == jwt.user._id
        })
        return match
    }

    /* FollowProfileButton handler */ 
    const clickFollowButton = (callApi) => {
        callApi({
          userId: jwt.user._id
        }, {
          t: jwt.token
        }, values.user._id).then((data) => {
          if (data.error) {
            setValues({...values, error: data.error})
          } else {
            setValues({...values, user: data, following: !values.following})
          }
        })
    }

    /* calls the listByUser fetch method to load the required posts for PostList */
    const loadPosts = (user) => {
      listByUser({
        userId: user
      }, {
        t: jwt.token
      }).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setPosts(data)
        }
      })
    }

    /* removes the specific post and updates this change to the post list using setPosts */
    const removePost = (post) => {
      const updatedPosts = posts
      const index = updatedPosts.indexOf(post)
      updatedPosts.splice(index, 1)
      setPosts(updatedPosts)
      
    }

    if (values.redirectToSignin) {
        return <Redirect to='/signin'/>
    }

    return (
        <Paper className={classes.root} elevation={4}>
          <Typography variant="h6" className={classes.largeAvatar}>
            Profile
          </Typography>
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={photoUrl} />
              </ListItemAvatar>
              <ListItemText primary={values.user.name} secondary={values.user.email}/> {
               auth.isAuthenticated().user && auth.isAuthenticated().user._id == values.user._id
               ? (<ListItemSecondaryAction>
                  <Link to={"/user/edit/" + values.user._id}>
                    <IconButton aria-label="Edit" color="primary">
                      <Edit/>
                    </IconButton>
                  </Link>
                  <DeleteUser userId={values.user._id}/>
                </ListItemSecondaryAction>)
               : (<FollowProfileButton following={values.following} onButtonClick={clickFollowButton}/>)
              }
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemText primary={values.user.about} secondary={"Joined: " + (new Date(values.user.created)).toDateString()}/>
            </ListItem>
          </List>
          <ProfileTabs user={values.user} posts={posts} removePostUpdate={removePost}/>

        </Paper>

    )

}