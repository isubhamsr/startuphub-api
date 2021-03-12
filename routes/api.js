const route = require('express').Router()
const adminAuth = require('../controllers/admin/auth')


route.post('/adminsignup', adminAuth.signup)

module.exports = route