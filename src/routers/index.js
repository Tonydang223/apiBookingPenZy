

const auth = require('./auth')
const booking = require('./bookings')
const user = require('./user')
function pathRoute(app){
    app.use('/auth',auth);
    app.use('/api',booking)
    app.use('/user',user)

}

module.exports = pathRoute
