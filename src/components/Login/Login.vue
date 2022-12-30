<template src="./template.html">

</template>

<script>
import SourceService from "@/services/SourceService";
import {AuthHelpers} from "@/helpers/AuthHelpers";
import {ValidationUser} from "@/helpers/ValidationUser";



export default {
  name: "LoginPage",
  data() {
    return {
      isLoginType: true,
      loginForm: {
        login: '',
        password: ''
      },
      UserValidation: {
        name: true,
        surname: true,
        login: true,
        password: true
      },
      registrationForm: {
        name: '',
        surname: '',
        login: '',
        password: '',
      },
      source: new SourceService({
        endpoint: 'User',
        bindings: {
          login: 'Login'
        }
      })
    }
  },
  methods: {
    showPass() {
      const passwordField = document.querySelector('#password')
      if (passwordField.getAttribute('type') === 'password') passwordField.setAttribute('type', 'text')
      else passwordField.setAttribute('type', 'password')
    },
    _choseType() {
      this.isLoginType = !this.isLoginType;
    },
    _login() {
      this.source.customQuery('login', this.loginForm).then((result) => {
        if (result.success) {
          const res = result.data;
          AuthHelpers.login(false, res.id, res);
        }
      });
    },
    _CheckRegistrationUser() {
      if(ValidationUser._checkValidationName(this.registrationForm.name)) {
        this.UserValidation.name=true;
      }else this.UserValidation.name=false;
      if(ValidationUser._checkValidationSurname(this.registrationForm.surname)) {
        this.UserValidation.surname=true;
      }else this.UserValidation.surname=false;
      if(ValidationUser._checkValidationLogin(this.registrationForm.login)) {
        this.UserValidation.login=true;
      }else this.UserValidation.login=false;
      if(ValidationUser._checkValidationPassword(this.registrationForm.password)) {
        this.UserValidation.password=true;
      }else this.UserValidation.password=false;
    },
    _registration() {
      this._CheckRegistrationUser()
      if(ValidationUser._checkValidationName(this.registrationForm.name)&&
          ValidationUser._checkValidationSurname(this.registrationForm.surname)&&
          ValidationUser._checkValidationPassword(this.registrationForm.password)&&
          ValidationUser._checkValidationLogin(this.registrationForm.login)
      ) {
        const self = this;
        this.source.create(this.registrationForm).then((result) => {
          if (result.success) {
            self.source.update(result.data).then((result) => {
              if (result.success) {
                const res = result.data;
                AuthHelpers.login(false, res.id, res);
              }
            });
          }
        });
      }
      }
    },
  }
</script>

<style scoped src="./style.less" lang="less">
</style>