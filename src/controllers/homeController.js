const Contact = require('../models/ContatoModel')

exports.index = async (req, res) => {
    const contacts = await Contact.searchContacts();
    res.render('index', { contacts });
};
