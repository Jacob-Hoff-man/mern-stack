/* imports */
import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import {unfollow, follow} from './api-user.js'

/* function defining the React component */
export default function FollowProfileButton (props) {
  const followClick = () => {
    props.onButtonClick(follow)
  }
  const unfollowClick = () => {
    props.onButtonClick(unfollow)
  }
    return (<div>
      { props.following
        ? (<Button variant="contained" color="secondary" onClick={unfollowClick}>Unfollow</Button>)
        : (<Button variant="contained" color="primary" onClick={followClick}>Follow</Button>)
      }
    </div>)
}
/* the 'following' value will be determined and sent from the Profile component as a prop when FollowProfileButton is added */
FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired
}