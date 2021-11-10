/* imports */
import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import auth from './../auth/auth-helper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import {create} from './api-course.js'
import {Link, Redirect} from 'react-router-dom'

/* styles are injected into the component using the hook returned by makeStyles */
const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing(12),
      paddingBottom: theme.spacing(2)
    },
    error: {
      verticalAlign: 'middle'
    },
    title: {
      marginTop: theme.spacing(2),
      color: theme.palette.openTitle
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 300
    },
    submit: {
      margin: 'auto',
      marginBottom: theme.spacing(2)
    },
    input: {
      display: 'none'
    },
    filename:{
      marginLeft:'10px'
    }
}))

/* function defining the React component */
export default function NewCourse() {
    const classes = useStyles()

    /* initialize the state of the form */
    const [values, setValues] = useState({
        name: '',
        description: '',
        image: '',
        category: '',
        redirect: false,
        error: ''
    })

    const jwt = auth.isAuthenticated()
  
    /* handler that tracks changes to the form view fields */
    /* takes the new values entered into the input field and sets them to state */
    const handleChange = name => event => {
      const value = name === 'image'
        ? event.target.files[0]
        : event.target.value
      setValues({...values, [name]: value })
    }

    /* handler that responds to the click submit button by setting state data to a FormData obj */
    /* FormData ensures the correct format for multipart/form-data encoding type necessary for sending reqs containing file uploads */
    /* then, create fetch method is called to create a new course in the BE */
    const clickSubmit = () => {
        let courseData = new FormData()
        values.name && courseData.append('name', values.name)
        values.description && courseData.append('description', values.description)
        values.image && courseData.append('image', values.image)
        values.category && courseData.append('category', values.category)
        create({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, courseData).then((data) => {
            if (data.error) {
            setValues({...values, error: data.error})
            } else {
            setValues({...values, error: '', redirect: true})
            }
        })
    }
  
    /* redirect user to new course page as a response from the server for a successful new course submission */
    if (values.redirect) {
        return (<Redirect to={'/teach/courses'}/>)
    }

    return (<div>
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" className={classes.title}>
                New Course
                </Typography>
                <br/>
                <input accept="image/*" onChange={handleChange('image')} className={classes.input} id="icon-button-file" type="file" />
                <label htmlFor="icon-button-file">
                    <Button variant="contained" color="secondary" component="span">
                        Upload Photo
                        <FileUpload/>
                    </Button>
                </label> 
                <span className={classes.filename}>{values.image ? values.image.name : ''}</span>
                <br/>
                <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/>
                <br/>
                <TextField
                id="multiline-flexible"
                label="Description"
                multiline
                rows="2"
                value={values.description}
                onChange={handleChange('description')}
                className={classes.textField}
                margin="normal"
                />
                <br/> 
                <TextField id="category" label="Category" className={classes.textField} value={values.category} onChange={handleChange('category')} margin="normal"/>
                <br/>
                {
                values.error && (<Typography component="p" color="error">
                    <Icon color="error" className={classes.error}>error</Icon>
                    {values.error}</Typography>)
                }
            </CardContent>
            <CardActions>
                <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
                <Link to='/teach/courses' className={classes.submit}><Button variant="contained">Cancel</Button></Link>
            </CardActions>
        </Card>
    </div>)
} 