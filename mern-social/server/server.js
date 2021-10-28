import config from './../config/config'
import app from './express'

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})

import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, 
                                    // useCreateIndex: true,  /* throws a bunch of deprc warnings */         
                                    useUnifiedTopology: true
                                   }, err => {
                                     if(err) throw err;
                                     console.log("Connected to MongoDB with URI:")
                                     console.log(config.mongoUri)
                                   }) 
