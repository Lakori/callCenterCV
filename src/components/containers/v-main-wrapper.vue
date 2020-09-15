<template>
    <div class="v-main-wrapper">
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
          name: 'admin',
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
};
</script>

<style lang="scss">
</style>
