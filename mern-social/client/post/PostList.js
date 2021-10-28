/* imports */
import React from 'react'
import PropTypes from 'prop-types'
import Post from './Post'

/* function defining the React component */
export default function PostList (props) {
    /* renders any list of Posts provided */
    return (
        <div style={{marginTop: '24px'}}>
            {
                props.posts.map((item, i) => {
                    return <Post post={item} key={i} onRemove={props.removeUpdate}/>
                })
            }
        </div>
    )
}
/* list of Posts required */
/* removeUpdate function is required passed as a prop from parent component (Newsfeed) */
PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired
}