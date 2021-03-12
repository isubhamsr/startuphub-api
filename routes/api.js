const route = require('express').Router()
const adminAuth = require('../controllers/admin/auth')


route.post('/superadminsignup', adminAuth.superAdminsSignup)
route.post('/superadminsignin', adminAuth.superAdminSignin)

module.exports = route