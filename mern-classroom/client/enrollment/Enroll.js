/* imports */
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import {create} from './api-enrollment'
import auth from '../auth/auth-helper'
import {Redirect} from 'react-router-dom'

/* styles are injected into the component using the hook returned by makeStyles */
const useStyles = makeStyles(theme => ({
    form: {
        minWidth: 500
    }
}))

/* function defining the React component */
export default function Enroll(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    enrollmentId: '',
    error: '',
    redirect: false
  })
  const jwt = auth.isAuthenticated()

  /* invoked when the enroll button is clicked, which will fetch the create enrollment API */
  const clickEnroll = () => {
    create({
      courseId: props.courseId
    }, {
      t: jwt.token
    }).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, enrollmentId: data._id, redirect: true})
      }
    })
  }

  /* redirect user to enrollment details, once the enrollment fetch call is successful */
  if(values.redirect){
    return (<Redirect to={'/learn/'+values.enrollmentId}/>)
  }

  return (
    <Button variant="contained" color="secondary" onClick={clickEnroll}> Enroll </Button>
  )
}

/* associated course's Id as prop from the parent component, used when making create enrollment API call */
Enroll.propTypes = {
    courseId: PropTypes.string.isRequired
}