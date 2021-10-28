/* imports */
import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper'
import PostList from './PostList'
import {listNewsFeed} from './api-post.js'
import NewPost from './NewPost'

/* styles are injected into the component using the hook returned by makeStyles */
const useStyles = makeStyles(theme => ({
    card: {
      margin: 'auto',
      paddingTop: 0,
      paddingBottom: theme.spacing(3)
    },
    title: {
      padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
      color: theme.palette.openTitle,
      fontSize: '1em'
    },
    media: {
      minHeight: 330
    }
}))

/* function defining the React component */
export default function Newsfeed () {
    const classes = useStyles()
    const [posts, setPosts] = useState([])
    const jwt = auth.isAuthenticated()
  
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      /* fetch method that will load the posts in PostList */
      listNewsFeed({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, signal).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setPosts(data)
        }
      })
      return function cleanup(){
        abortController.abort()
      }
  
    }, [])
  
    /* adds a new post that was created in the NewPost componenet and adds it to the posts in the state */
    const addPost = (post) => {
      const updatedPosts = [...posts]
      updatedPosts.unshift(post)
      setPosts(updatedPosts)
    }

    /* removes the delete post from the Post component in PostList from the posts in the state */
    const removePost = (post) => {
      const updatedPosts = [...posts]
      const index = updatedPosts.indexOf(post)
      updatedPosts.splice(index, 1)
      setPosts(updatedPosts)
    }
  
    return (
        <Card className={classes.card}>
            <Typography type="title" className={classes.title}>
            Newsfeed
            </Typography>
            <Divider/>
            <NewPost addUpdate={addPost}/>
            <Divider/>
            <PostList removeUpdate={removePost} posts={posts}/>
        </Card>
    )
}