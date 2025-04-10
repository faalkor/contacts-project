const e = require("connect-flash");

exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next(); 
};

exports.checkError = (err, req, res, next) => {
    if (err) {
        return res.render('404');
    }
    
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};


exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        
        req.flash('errors', 'O usuário não está logado.');
        
        req.session.save(() => {
            res.redirect('/');
        });
        
        return;
    }
    
    next();
 };
