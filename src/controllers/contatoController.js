const Contact = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', {
        contato: {}
    });
};

exports.register = async (req, res) => {

    try {
        const contact = new Contact(req.body);
        await contact.register();

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }
        req.flash('success', 'Contact successfully registered.');
        req.session.save(() => res.redirect(`/contato/index/${contact.contact._id}`));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.editPage = async function (req, res) {
    if (!req.params.id) return res.render('404');

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.render('404');

    return res.render('contato', {
        contato: contact
    });
};

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const contact = new Contact(req.body);
        await contact.edit(req.params.id);

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('success', 'Contato atualizado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contact.contact._id}`));
    } catch {
        console.log(e);
        return res.render('404');
    }   
};

exports.delete = async function (req, res) {
    if (!req.params.id) return res.render('404');
    
    const deletedContact = await Contact.delete(req.params.id);
    if (!deletedContact) return res.render('404');

    req.flash('success', 'Contato deletado com sucesso.');
    req.session.save(() => res.redirect(req.get("Referrer") || "/"));
};