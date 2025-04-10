import validator from 'validator';

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
    this.msgEmail = document.querySelector('.flash-msg-email');
    this.msgPassword = document.querySelector('.flash-msg-password');
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form || this.form === null) return;
    
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.validate(e);
    }); 
  }

  validate(e) {
    this.cleanFields();
    let error = false;
    const el = e.target;
    const email = el.querySelector('input[name="email"]');
    const password = el.querySelector('input[name="password"]');

    if (!validator.isEmail(email.value)) {
      this.msgEmail.innerHTML = "Invalid email.";
      this.msgEmail.style = "color: red";
      error = true;
    }
    if (password.value.length < 6 || password.value.length > 50) {
      this.msgPassword.innerHTML = "Invalid password.";
      this.msgPassword.style = "color: red";
      error = true;
    }
    
    if (error) return;

    el.submit();
  }

  cleanFields() {
    this.msgEmail.innerHTML = "";
    this.msgPassword.innerHTML = ""
  }
}
