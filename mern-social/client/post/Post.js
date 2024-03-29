/* imports */
import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import {remove, like, unlike} from './api-post.js'
import Comments from './Comments'

/* styles are injected into the component using the hook returned by makeStyles */
const useStyles = makeStyles(theme => ({
    card: {
      maxWidth:600,
      margin: 'auto',
      marginBottom: theme.spacing(3),
      backgroundColor: 'rgba(0, 0, 0, 0.06)'
    },
    cardContent: {
      backgroundColor: 'white',
      padding: `${theme.spacing(2)}px 0px`
    },
    cardHeader: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    text: {
      margin: theme.spacing(2)
    },
    photo: {
      textAlign: 'center',
      backgroundColor: '#f2f5f4',
      padding:theme.spacing(1)
    },
    media: {
      height: 200
    },
    button: {
     margin: theme.spacing(1),
    }
}))

/* function defining the React component */
export default function Post (props){
    const classes = useStyles()

    /* JWT is retrieved from sessionStorage using isAuthenticated */
    const jwt = auth.isAuthenticated()

    /* checks whether the currently signed-in user is referenced in the post's likes array or not */
    /* this is used on initializing state to figure out the total number of likes to display (include current user or no) */
    const checkLike = (likes) => {
      let match = likes.indexOf(jwt.user._id) !== -1
      return match
    }

    /* likes value is set to the state */
    const [values, setValues] = useState({
      like: checkLike(props.post.likes),
      likes: props.post.likes.length,
      comments: props.post.comments
    })
    
    // useEffect(() => {
    //   setValues({...values, like:checkLike(props.post.likes), likes: props.post.likes.length, comments: props.post.comments})
    // }, [])

    /* calls the appropriate fetch method based on whether it is a like or unlike action, dependent on 'like' state variable */
    /* updates the state of the like and likes count for the post */
    const clickLike = () => {
      let callApi = values.like ? unlike : like
      callApi({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, props.post._id).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setValues({...values, like: !values.like, likes: data.likes.length})
        }
      })
    }
  
    /* allows the comments and comment count to be updated when a comment is added or deleted */
    /* passed as a prop to Comments component */
    const updateComments = (comments) => {
      setValues({...values, comments: comments})
    }
    
    /* called when the delete button is clicked on a post */
    /* makes a fetch call to the delete post API and on success will update the list of posts in state using onRemove */
    /* onRemove is provided as a prop from parent component */
    const deletePost = () => {   
      remove({
        postId: props.post._id
      }, {
        t: jwt.token
      }).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          props.onRemove(props.post)
        }
      })
    }
  
    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar src={'/api/users/photo/'+props.post.postedBy._id}/>
                }
                action={
                    props.post.postedBy._id === auth.isAuthenticated().user._id &&
                    <IconButton onClick={deletePost}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={<Link to={"/user/" + props.post.postedBy._id}>{props.post.postedBy.name}</Link>}
                subheader={(new Date(props.post.created)).toDateString()}
                className={classes.cardHeader}
            />
            <CardContent className={classes.cardContent}>
                <Typography component="p" className={classes.text}>
                    {props.post.text}
                </Typography>
                {
                    props.post.photo &&
                    (<div className={classes.photo}>
                        <img
                        className={classes.media}
                        src={'/api/posts/photo/'+props.post._id}
                        />
                    </div>)
                }
            </CardContent>
            <CardActions>
            { values.like
              ? <IconButton onClick={clickLike} className={classes.button} aria-label="Like" color="secondary">
                  <FavoriteIcon />
                </IconButton>
              : <IconButton onClick={clickLike} className={classes.button} aria-label="Unlike" color="secondary">
                  <FavoriteBorderIcon />
                </IconButton> } <span>{values.likes}</span>
                <IconButton className={classes.button} aria-label="Comment" color="secondary">
                  <CommentIcon/>
                </IconButton> <span>{values.comments.length}</span>
            </CardActions>
            <Divider/>
            <Comments postId={props.post._id} comments={values.comments} updateComments={updateComments}/>
        </Card>
    )
    
}
  
Post.propTypes = {
    post: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}