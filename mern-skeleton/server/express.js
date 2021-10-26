/*  -DEVELOPER/PRODUCTION MODE SWITCH INSTRUCTIONS-:
    when development mode lines are executed, Webpack will compile and bundle the React code to place it in dist/bundle.js
    these two specific lines are only meant for development mode and should be commented out when building for
    production!
*/
import express from 'express'
import devBundle from './devBundle' /* for development mode */
const app = express()
devBundle.compile(app) /* for development mode */

/* configuring the Express app further before exporting */
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

/* configuring the Express app to handle requests to static files starting at /dist */
import path from 'path'
const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

/* mounting user API routes to Express app configuration */
import userRoutes from './routes/user.routes'
app.use('/', userRoutes)
/* mounting auth-related API routes to Express app configuration */
import authRoutes from './routes/auth.routes'
app.use('/', authRoutes)

/* handling auth-related errors thrown by express-jwt while validating JWT tokens in incoming requests */
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({"error" : err.name + ": " + err.message})
    }else if (err) {
      res.status(400).json({"error" : err.name + ": " + err.message})
      console.log(err)
    }
})

// /* serve template.js at the root URL (in response to GET request for '/' route) */
// import Template from './../template'
// app.get('/', (req, res) => {
//     res.status(200).send(Template())
// })


/* server-side rendering implementation */
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import StaticRouter from 'react-router-dom/StaticRouter'
import MainRouter from './../client/MainRouter'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme'
import Template from './../template'

/* upon receiving any GET request, prepare, gen, and return server-side rendered FE code */
app.get('*', (req, res) => {
  /* generate CSS styles using Material-UI's ServerStyleSheets instance for received request */
  const sheets = new ServerStyleSheets()
  const context = {}

  /* use renderToString to generate markup, which renders components specific to the route requested */
  /* StaticRouter is used in order to wrap MainRouter with ThemeProvider, but still provide the routing props on client-side */
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  ) 

  /* check if a redirect was rendered in the components to be sent in the markup */
  if (context.url) {
    return res.redirect(303, context.url)
  }
  /* if no redirect, get CSS string from sheets using sheets.toString */
  const css = sheets.toString()
  
  /* return template with markup and CSS styles injected in the response */
  res.status(200).send(Template({
      markup: markup,
      css: css
  }))

})

export default app