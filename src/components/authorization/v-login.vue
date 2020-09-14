<template>
<div class="loginForm">
  <div>
    <b-form @submit="onSubmit">
      <b-form-group
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


      <b-button class="main-size" type="submit" variant="primary">Увійти</b-button>
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
    };
  },
  methods: {
    async onSubmit(e) {
      try {
        e.preventDefault();
        let formData = new FormData();
        formData.append('phone', this.phone);
        formData.append('password', this.password);
        await this.$axios.post('/auth/signin', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-form-data': true,
          },
        });
        this.reset();
        this.$router.push({ path: '/' });
      } catch (err) {
        console.log(err);
      }
    },
    reset() {
      this.name = '';
      this.password = '';
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