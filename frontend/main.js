import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/Login';
import Contact from './modules/Contact';

const login = new Login('.form-login');
const register = new Login('.form-register');
const contact = new Contact('.form-contact-register');
const contactEdit = new Contact('.form-contact-edit');

login.init();
register.init();
contact.init();
contactEdit.init();

import './assets/css/style.css';
