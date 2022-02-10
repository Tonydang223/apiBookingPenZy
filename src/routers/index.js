

const auth = require('./auth')
const booking = require('./bookings')
function pathRoute(app){
    app.use('/auth',auth);
    app.use('/api',booking)
}

module.exports = pathRoute
