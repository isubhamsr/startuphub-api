const route = require('express').Router()
const adminVerify = require('../middlewares/adminVerify')
const adminAuth = require('../controllers/admin/auth')
const category = require("../controllers/category")
const news = require('../controllers/news')


route.post('/superadminsignup', adminAuth.superAdminsSignup)
route.post('/superadminsignin', adminAuth.superAdminSignin)

route.post('/addcategory', adminVerify.isSuperAdmin, category.addCategory)
route.get('/fetchcategory', adminVerify.isSuperAdmin, category.fetchCategoryForAdmin)
route.delete('/deletecategory', adminVerify.isSuperAdmin, category.deleteCategory)
route.put('/updatecategory', adminVerify.isSuperAdmin, category.updateCategory)

route.get('/fetchcategoryuser', category.fetchCategoryForUser)

route.post('/addnews', adminVerify.isSuperAdmin, news.addNews)

module.exports = route