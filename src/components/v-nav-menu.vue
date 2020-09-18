
<template>
  <div class="v-nav__menu">
        <div class="v-nav__menu__links">
            <router-link :to="{name: 'deputatCreate'}">
                <div class="v-nav__menu__links-item"><b-icon icon="person-circle"></b-icon>Добавить политика</div>
            </router-link>
            <router-link :to="{name: 'politicianShow'}">
                <div class="v-nav__menu__links-item"><b-icon icon="person-circle"></b-icon>Просмотр политиков</div>
            </router-link>
            <router-link :to="{name: 'partyCreate'}">
                <div class="v-nav__menu__links-item"><b-icon icon="gear-fill"></b-icon>Добавить партию</div>
            </router-link>
            <router-link :to="{name: 'partyShow'}">
                <div class="v-nav__menu__links-item"><b-icon icon="gear-fill"></b-icon>Просмотр партий</div>
            </router-link>
            
            <router-link :to="{name: 'regionCreate'}">
                <div class="v-nav__menu__links-item"><b-icon icon="house-fill"></b-icon>Добавить регион</div>
            </router-link>
             <router-link :to="{name: 'regionShow'}">
                <div class="v-nav__menu__links-item"><b-icon icon="house-fill"></b-icon>Просмотр регионов</div>
            </router-link>
             <router-link :to="{name: 'constituencyCreate'}">
                <div class="v-nav__menu__links-item"><b-icon icon="house-fill"></b-icon>Добавить округ</div>
            </router-link>
            <router-link :to="{name: 'constituencyShow'}">
                <div class="v-nav__menu__links-item"><b-icon icon="house-fill"></b-icon>Просмотр округов</div>
            </router-link>
            <router-link :to="{name: 'usersShow'}">
                <div class="v-nav__menu__links-item"><b-icon icon="house-fill"></b-icon>Просмотр всех пользователей</div>
            </router-link>
             <router-link :to="{name: 'rolesCreate'}">
                <div class="v-nav__menu__links-item"><b-icon icon="house-fill"></b-icon>Создать роль</div>
            </router-link>
            <div class="v-nav__menu__links-item" @click="logout"><b-icon icon="house-fill"></b-icon>Выйти из системы</div>
            <!-- <router-link :to="{name: 'login'}"> -->
            <!-- <div class="v-nav__menu__links-item" v-if="!logged"><b-icon icon="house-fill"></b-icon>Войти в систему</div> -->
            <!-- </router-link> -->
            
        </div>
    </div>
</template>


<script>
export default {
  data() {
    return {};
  },

  methods: {
    async logout() {
      try {
        await this.$axios.get('/auth/signout');
        this.$axios.defaults.headers.common['x-access-token'] = null;
        this.$router.push({ path: '/login' });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>


