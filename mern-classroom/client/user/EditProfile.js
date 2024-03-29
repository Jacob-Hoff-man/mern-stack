/* imports */
import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom'

/* styles are injected into the component using the hook returned by makeStyles */
const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(12),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}))

/* function defining the React component */
export default function EditProfile({ match }) {
  const classes = useStyles()

  /* initializing the state */
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    about: '',
    open: false,
    error: '',
    redirectToProfile: false,
    educator: false
  })
  
  /* JWT is retrieved from sessionStorage using isAuthenticated */
  const jwt = auth.isAuthenticated()

  /* load the user info */
  /* this effect needs to rerun when the userId param changes in the route, hence the second arg */
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, name: data.name, email: data.email, educator: data.educator})
      }
    })

    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])
  
  const clickSubmit = () => {

    /* initialize FormData and append updated values for file submission */
    let userData = new FormData()
    values.name && userData.append('name', values.name)
    values.email && userData.append('email', values.email)
    values.password && userData.append('password', values.password)
    values.about && userData.append('about', values.about)
    values.photo && userData.append('photo', values.photo)
    userData.append('educator', values.educator)

    // const user = {
    //   name: values.name || undefined,
    //   email: values.email || undefined,
    //   password: values.password || undefined,
    //   educator: values.educator 
    // }

    update({
      userId: match.params.userId
    }, {
      t: jwt.token
    }, userData).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, redirectToProfile: true})
      }
    })
    console.log("end")
  }

  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    setValues({...values, [name]: value})
  }

  const handleCheck = (event, checked) => {
    setValues({...values, educator: checked})
  }

  if (values.redirectToProfile) {
    return (<Redirect to={'/user/' + match.params.userId}/>)
  }

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Edit Profile
          </Typography>
            <label htmlFor="icon-button-file">
              <Button variant="contained" color="default" component="span">
                Upload 
                <FileUpload/>
              </Button>
            </label>
            <span className={classes.filename}>{values.photo ? values.photo.name : ''}</span>
            <br/>
            <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
            <TextField id="multiline-flexible" label="About" multiline rows="2" value={values.about} onChange={handleChange('about')} margin="normal" /><br/>
            <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
            <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/><br/>
          <br/>
          <Typography variant="subtitle1" className={classes.subheading}>
            I am an Educator
          </Typography>
          <FormControlLabel
            control={
              <Switch classes={{
                                checked: classes.checked,
                                bar: classes.bar,
                              }}
                      checked={values.educator}
                      onChange={handleCheck}
              />}
            label={values.educator? 'Yes' : 'No'}
          />
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
}