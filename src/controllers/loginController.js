const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if (req.session.user) return res.render('welcome');
    return res.render('login');
};

exports.register = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.registrar();
    
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('back');
            });        
            return;
        }
    
        req.flash('success', 'Usuário criado com sucesso.');
        req.session.save(function() {
            return res.redirect('back');
        });           
    } catch (e) { 
        console.log(e);
        return res.render('404');
    }
};


exports.login = async (req,res) => {
    try {
        const login = new Login(req.body);
        await login.autenticar();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('back');
            });        
            return;
        }

        req.flash('success', 'Login realizado com sucesso.');
        req.session.user = login.user;
        req.session.save(function() {
            return res.redirect('back');
        });   

    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.logout = (req,res) => { 
    req.session.destroy();
    res.redirect('/');
};
