import config from './../config/config'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from './../webpack.config.client.js'

/* configures the Express app to use the Webpack middleware */
/* during development, when running the server, Express app will load the Webpack middleware */
/* relevant to the FE with respect to client-side code config, so that the FE and BE workflow is integrated */
/* utilizes the values set in webpack.config.client.js */
const compile = (app) => {
  if(config.env === "development"){
    const compiler = webpack(webpackConfig)
    const middleware = webpackMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    })
    app.use(middleware)
    app.use(webpackHotMiddleware(compiler))
  }
}

export default {
  compile
}