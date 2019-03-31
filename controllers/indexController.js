module.exports = {
    loginPage: (req, res, next) => {
        if (req.user) {
            //user already logged
            res.redirect("/users");
        } else {
            //user not logged
            res.render("login", {
                title: req.app.get("app-name"),
                error: req.flash("error")
            });
        }
    },
    authenticate: (req, res, next) => {
        //Check is user exits in database, etc..
        res.redirect("/users");
    },
    logout: (req, res, next) => {
        req.logout();
        res.redirect("/");
    }
};