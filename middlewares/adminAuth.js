function adminAuth(req, res, next){

    if(req.session.user != undefined){
        next()
    } else {
        res.redirect("/erro_login")
    }
}

module.exports = adminAuth