import React from 'react'
import { hydrate } from 'react-dom'
import App from './App'

/* hydrate preserves the server-rendered markup */
/* only event handlers are attached when React takes over in the browser--load performance increase */
hydrate(<App/>, document.getElementById('root'))