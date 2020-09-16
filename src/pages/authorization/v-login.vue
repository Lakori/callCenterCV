<template>
<div class="loginForm">
  <div>
    
    <b-form>
      <h1>Увійти в систему</h1>
      <b-form-group v-if="!value"
        label="Телефон:"
        label-for="phone"
      >
        <b-form-input
        class="main-size"
          id="phone"
          v-model="phone"
          type="text"
          required
          placeholder="Введіть телефон"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Пароль:"
        label-for="password"
        >
        <b-form-input
        class="main-size"
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="Введіть пароль"
        ></b-form-input>
      </b-form-group>


      <b-button class="main-size" @click="checkPassword" variant="primary">Увійти</b-button>

      <div style="color:red" v-if="wrong">Невірний номер</div>
      <div style="color:red" v-if="wrongPass">Невірний код або пароль</div>
    </b-form>
  </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      password: '',
      smsCode: '',
      wrong: false,
      value: '',
      wrongPass: false,
    };
  },
  methods: {
    reset() {
      this.name = '';
      this.password = '';
    },
    async checkPassword(e) {
      try {
        e.preventDefault();
        this.wrong = false;
        await this.$axios.post('/account/identification', {
          phone: this.phone,
        });
        let pass = await this.$axios.post('/account/authentication', {
          password: this.password,
          smscode: this.smsCode,
        });
        if (!pass.data.authenticated) {
          this.wrongPass = true;
        } else {
          this.reset();
          this.$router.push({ path: '/' });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async toRegistrationPage(evt) {
      evt.preventDefault();
      // Reset our form values
      this.reset();
      this.$router.push({ path: '/registration' });
    },
  },
};
</script>

<style lang="scss">
.loginForm {
  background: white;
  width: 100%;
  height: 100vh;
  form {
    width: 600px;
    margin: auto;
    margin-top: 50px;
    padding: 20px;
    font-size: 20px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  }

  .main-size {
    font-size: 16px;
  }
}
</style>