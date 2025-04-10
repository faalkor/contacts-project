const mongoose = require('mongoose');
const validator = require('validator');


const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    number: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    createdAt: { type: Date, default: Date.now }
});


const ContactModel = mongoose.model('Contact', ContactSchema);


class Contact {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contact = null;
    }

    async register() {
        // Checa dados form
        this.validate();
        if (this.errors.length > 0) return;

        this.contact = await ContactModel.create(this.body);
    }

    validate() {
        this.cleanData();
        this.nameValidation();
        this.emailValidation();
        this.contactInfoValidation();
    }

    nameValidation() {
        if (!this.body.name) {
            this.errors.push('Name is required.');
            return false;
        }
        return true;
    }

    cleanData() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            name: this.body.name.trim().toLowerCase(),
            lastName: this.body.lastName.trim().toLowerCase(),
            number: this.body.number.trim(),
            email: this.body.email.trim(),
        };
    }

    emailValidation() {
        if (this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('Invalid email.');
        }
    }

    contactInfoValidation() {
        if (!this.body.number && !this.body.email) {
            this.errors.push('Contact must have: number or email.');
            return false;
        }
        return true;
    }

    static async findById(id) {
        if (typeof id !== 'string') return;

        const contact = await ContactModel.findById(id);
        return contact;
    }

    async edit(id) {
        if (typeof id !== 'string') return;
        this.validate();
        if (this.errors.length > 0) return;

        this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
    }

    static async searchContacts() {
        const contatos = await ContactModel.find()
            .sort({ name: 1 });
        return contatos;
    } 

    static async delete(id) {
        if (typeof id !== 'string') return;
        return await ContactModel.findOneAndDelete({ _id: id });
    }
}

module.exports = Contact;
