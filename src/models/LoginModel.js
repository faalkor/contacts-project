const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');


const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});


const LoginModel = mongoose.model('Login', LoginSchema);


class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async registrar() {
        // Checa dados form
        this.validar();
        if (this.errors.length > 0) return;
        
        // Checa base de dados
        const user = await this.userExists();
        if (user) this.errors.push('Usuário já cadastrado.');
        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body);
    }

    async userExists() {
        const user = await LoginModel.findOne({email: this.body.email});
        return user;
    }

    validar() {
        this.cleanData();
        this.validarEmail();
        this.validarSenha();
    }

    cleanData() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email.trim().toLowerCase(),
            password: this.body.password,
        };
    }


    validarSenha() {
        if (this.body.password.length < 6 || this.body.password.length > 30) {
            this.errors.push('Senha precisa ter entre 6 e 30 caracteres');
        }
    }

    validarEmail() {
        if(!validator.isEmail(this.body.email)) {
            this.errors.push('Email inválido');
        }
    }

    async autenticar() {
        try {
            this.validar();
            if (this.errors.length > 0) return;

            const user = await this.userExists();

            if (user) {
                this.user = user;

                if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
                    this.errors.push('Usuário ou senha inválidos.');
                    return;
                }
            }
            else {
                throw new Error('Usuário não encontrado.');
            }

        } catch (e) {
            this.errors.push('Usuário ou senha inválidos.');
            return;
        }

    }

}

module.exports = Login;
