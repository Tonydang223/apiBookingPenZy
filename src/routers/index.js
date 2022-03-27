

const auth = require('./auth')
const booking = require('./bookings')
const user = require('./user')
const property = require('./property')
function pathRoute(app){
    app.use('/auth',auth);
    app.use('/api',booking)
    app.use('/user',user)
    app.use('/api',property);

}

module.exports = pathRoute
