<template>
    <div class="v-main-wrapper" v-if="logged">
       <b-button class="logout" @click="logout" variant="outline-primary">Вихід</b-button>
      <div class="v-main-wrapper__block">
          <router-view />
      </div>
     
    </div>

   
</template>

<script>
export default {
  name: 'v-main-wrapper',
  components: {},
  data() {
    return {
      logged: false,
    };
  },
  async beforeCreate() {
    try {
      this.logged = false;
      let data = await this.$axios.get('/account');

      let conditions = encodeURIComponent(
        JSON.stringify({
          name: 'call centre',
        })
      );
      let roles = await this.$axios.get(`/roles?conditions=${conditions}`);
      if (!data.data.userData) {
        this.$router.push({ path: '/login' });
        this.logged = false;
      } else {
        roles.data.page.data[0].roleId === data.data.userData.roleId
          ? (this.logged = true)
          : this.$router.push({ path: '/login' });
      }
    } catch (err) {
      this.$router.push({ path: '/login' });
      this.logged = false;
    }
  },
  methods: {
    async logout() {
      try {
        await this.$axios.get('/account/signout');
        this.$router.push({ path: '/login' });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss">
</style>
