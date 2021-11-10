/* imports */
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import auth from './../auth/auth-helper'
import {remove} from './api-user.js'
import {Redirect} from 'react-router-dom'

/* styles are injected into the component using the hook returned by makeStyles */

/* function defining the React component */
export default function DeleteUser(props) {
    /* initializing the state, set false so it does not render first */
    const [open, setOpen] = useState(false)
    const [redirect, setRedirect] = useState(false)
    
    /* JWT is retrieved from sessionStorage using isAuthenticated */
    const jwt = auth.isAuthenticated()
    
    /* handler methods */
    /* calls the remove fetch method using the userId and JWT to delete the user's account from db*/
    const deleteAccount = () => { 
      remove({
        /* userId that was sent from the Profile component props */
        userId: props.userId
      }, {t: jwt.token}).then((data) => {
        if (data && data.error) {
          console.log(data.error)
        } else {
          auth.clearJWT(() => console.log('deleted'))
          setRedirect(true)
        }
      })
    }

    /* open the DeleteUser dialog on button click */
    const clickButton = () => {
        setOpen(true)
    }

    /* close the DeleteUser dialog on 'cancel' dialog-button click */
    const handleRequestClose = () => {
      setOpen(false)
    }
    
    /* redirect to root upon successful delete request */
    if (redirect) {
      return <Redirect to='/'/>
    }

    return (
        <span>
            <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
            <DeleteIcon/>
            </IconButton>
    
            <Dialog open={open} onClose={handleRequestClose}>
            <DialogTitle>{"Delete Account"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Confirm to delete your account.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRequestClose} color="primary">
                Cancel
                </Button>
                <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
                Confirm
                </Button>
            </DialogActions>
            </Dialog>
        </span>
    
    )

}

/* validate the required injection of userId as a prop with PropTypes requirement validator */
/* DeleteUser takes userId as a prop to be used and is required */
DeleteUser.propTypes = {
    userId: PropTypes.string.isRequired
}