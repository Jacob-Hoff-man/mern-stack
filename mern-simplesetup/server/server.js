/* Express app */
/* initialize Express app */
/*  
    when development mode lines are executed, Webpack will compile and bundle the React code to place it in dist/bundle.js
    these two specific lines are only meant for development mode and should be commented out when building for
    production
*/
import express from 'express'
import devBundle from './devBundle' /* for development mode */
const app = express()
devBundle.compile(app) /* for development mode */


/* build out the remaining Node server application */
/* configure the Express app to return/serve static files from the dist folder when requested route starts with /dist */
import path from 'path'
const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

/* route-handling to receive GET requests at / */
import template from './../template'
app.get('/', (req, res) => {
   res.status(200).send(template())
})

/* start a server that listens on the specified port for incoming requests */
let port = process.env.PORT || 3000
app.listen(port, function onStart(err) {
 if (err) {
  console.log(err) 
 }
 console.info('Server started on port %s.', port)
})

/* connect the Node server to MongoDB */
import { MongoClient } from 'mongodb'

const url = process.env.MONGODB_URI ||
    'mongodb+srv://jacob:jacob@cluster0.lmzmd.mongodb.net/default?retryWrites=true&w=majority' ||
    'mongodb://localhost:27017/mernSimpleSetup'

MongoClient.connect(url, (err, db)=>{
  console.log("Connected successfully to mongodb server using URL:")
  console.log(url)
  db.close()
})