const route = require('express').Router()
const adminVerify = require('../middlewares/adminVerify')
const adminAuth = require('../controllers/admin/auth')
const category = require("../controllers/category")


route.post('/superadminsignup', adminAuth.superAdminsSignup)
route.post('/superadminsignin', adminAuth.superAdminSignin)

route.post('/addcategory', adminVerify.isSuperAdmin, category.addCategory)
route.get('/fetchcategory', adminVerify.isSuperAdmin, category.fetchCategory)
route.delete('/deletecategory', adminVerify.isSuperAdmin, category.deleteCategory)

module.exports = route