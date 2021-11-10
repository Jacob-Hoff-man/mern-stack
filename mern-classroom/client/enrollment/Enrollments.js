/* imports */
import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import CompletedIcon from '@material-ui/icons/VerifiedUser'
import InProgressIcon from '@material-ui/icons/DonutLarge'
import {Link} from 'react-router-dom'

/* styles are injected into the component using the hook returned by makeStyles */
const useStyles = makeStyles(theme => ({
    title: {
      padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
      color: theme.palette.openTitle
    },
    media: {
      minHeight: 400
    },
    container: {
      minWidth: '100%',
      paddingBottom: '14px'
    },
    imageList: {
      width: '100%',
      minHeight: 100,
      padding: '12px 0 10px'
    },
    tile: {
      textAlign: 'center'
    },
    image: {
      height: '100%'
    },
    tileBar: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      textAlign: 'left'
    },
    tileTitle: {
      fontSize:'1.1em',
      marginBottom:'5px',
      color:'#fffde7',
      display:'block'
    },
    action:{
      margin: '0 10px'
    },
    progress:{
      color: '#b4f8b4'
    }
}))

/* function defining the React component */
/* takes a list of enrollments as props */
export default function Enrollments(props){
    const classes = useStyles()

    return (
        <div>
            <ImageList rowHeight={120} className={classes.imageList} cols={4}>
            {props.enrollments.map((course, i) => (
                <ImageListItem key={i} className={classes.tile}>
                    <Link to={"/learn/"+course._id}><img className={classes.image} src={'/api/courses/photo/'+course.course._id} alt={course.course.name} /></Link>
                    <ImageListItemBar className={classes.tileBar}
                        title={<Link to={"/learn/"+course._id} className={classes.tileTitle}>{course.course.name}</Link>}
                        actionIcon={
                            <div className={classes.action}>
                            {
                                course.completed ? (<CompletedIcon color="secondary"/>)
                                                 : (<InProgressIcon className={classes.progress} />)
                            }
                            </div>
                        }
                    />
                </ImageListItem>
            ))}
            </ImageList>
        </div>
    )
}