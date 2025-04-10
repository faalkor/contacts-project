import validator from 'validator';


export default class Contact {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
    if (!this.form) return;

    this.nameField = this.form.querySelector("#name");
    this.lastNameField = this.form.querySelector("#lastName");
    this.emailField = this.form.querySelector("#email");
    this.numberField = this.form.querySelector("#number");
  }

  init() {
    if (!this.form || this.form === null) return;
    this.validate();
  }

  validate() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const el = e.target;

      let errorMessages = [];
      let hasNumber = this.numberField.value.length > 0;
      let hasEmail = this.emailField.value.length > 0;

      if (this.nameField.value.trim().length === 0 ) {
        errorMessages.push({ selector: '.flash-msg-name', message: "Name is required." });
      }

      if (hasEmail && !validator.isEmail(this.emailField.value)) {
        errorMessages.push({ selector: '.flash-msg-email', message: "Invalid email." });
      }

      if (!hasNumber && !hasEmail) {
        errorMessages.push({ selector: '.flash-msg-email-or-number', message: "Email or number should be informed." });
      }

      // Show errors
      document.querySelectorAll('.flash-msg-name, .flash-msg-email, .flash-msg-email-or-number')
        .forEach(el => el.innerHTML = "");
      
      errorMessages.forEach(({ selector, message }) => {
        this.form.querySelector(selector).innerHTML = message;
        this.form.querySelector(selector).style = "color: red";
      });

      if (errorMessages.length === 0) el.submit();
    }); 
  }

}
