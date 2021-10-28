/* imports */
import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import unicornbikeImg from './../assets/images/unicornbike.jpg'
import Grid from '@material-ui/core/Grid'
import FindPeople from './../user/FindPeople'
import Newsfeed from './../post/Newsfeed'
import auth from './../auth/auth-helper'

/* styles are injected into the component using the hook returned by makeStyles */
const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(5)
    },
    title: {
      padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
      color: theme.palette.openTitle
    },
    media: {
      minHeight: 400
    }
}))

/* function defining the React component */
export default function Home({history}){
  const classes = useStyles()
  const [defaultPage, setDefaultPage] = useState(false)

  useEffect(()=> {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten()
    }
  }, [])

  return (
    <div className={classes.root}>
      { !defaultPage &&
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <Typography variant="h6" className={classes.title}>
                Home Page
              </Typography>
              <CardMedia className={classes.media} image={unicornbikeImg} title="Unicorn Bicycle"/>
              <Typography variant="body2" component="p" className={classes.credit} color="textSecondary">Photo by <a href="https://unsplash.com/@boudewijn_huysmans" target="_blank" rel="noopener noreferrer">Boudewijn Huysmans</a> on Unsplash</Typography>
              <CardContent>
                <Typography type="body1" component="p">
                  Welcome to the MERN Social home page. 
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      }
      {defaultPage &&
        <Grid container spacing={8}>
          <Grid item xs={8} sm={7}>
            <Newsfeed/>
          </Grid>
          <Grid item xs={6} sm={5}>
            <FindPeople/>
          </Grid>
        </Grid>
      }
    </div>
  )

}
