<template>
    <div>
        <div>
            <h1>Обращения политика</h1>
           <br/>

            <form @submit.prevent="searchBySurname">
                <div  class="center__container">
                    <b-form-group class="item">
                        <b-form-input
                            class="main-size"
                            id="surname"
                            v-model="surname"
                            type="text"
                            required
                            placeholder="Введите фамилию политика*"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group class="item">
                        <b-form-input
                            class="main-size"
                            id="name"
                            v-model="name"
                            type="text"
                            placeholder="Введите имя политика"
                        ></b-form-input>
                    </b-form-group>
                </div>
                <b-button variant="outline-primary" type="submit">Поиск</b-button>
            </form>
            <div>{{politician}}</div>
            <div v-if="noPolitician">Политиков не найдено</div>
            <form @submit.prevent="searchByDate">
                <h2>Выберите дату</h2>
                <div>
                    <label for="example-datepicker">С:</label>
                    <b-form-datepicker id="example-datepicker" v-model="fromDate" class="mb-2"></b-form-datepicker>
                </div>
                 <div>
                    <label for="example-datepicker">По:</label>
                    <b-form-datepicker id="example-datepicker" v-model="toDate" class="mb-2"></b-form-datepicker>
                </div>

               <b-button variant="outline-primary" type="submit">Показать обращения</b-button>
            </form>
            <div v-if="appeals.length">
                <div v-for="item in appeals" :key="item.id">
                    {{item.topic}}
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      surname: '',
      politician: [],
      noPolitician: false,
      name: '',
      fromDate: null,
      toDate: null,
      appeals: [],
    };
  },
  methods: {
    async searchBySurname(e) {
      try {
        e.preventDefault();
        this.politician = [];
        let surname = this.surname.split('');
        surname.splice(0, 1, surname[0].toUpperCase());
        let surnameStr = surname.join('');

        let data = await this.searchBySurnameToUpper(false, surnameStr);

        if (data.length) {
          //   for (let item of data) {
          //     item.phone = await this.getPhone(item.userId);
          //   }
          this.noPolitician = false;
          return (this.politician = data);
        } else {
          let data = await this.searchBySurnameToUpper(true, surnameStr);
          console.log(data);
          //   for (let item of data) {
          //     item.phone = await this.getPhone(item.userId);
          //   }
          data.length
            ? ((this.politician = data), (this.noPolitician = false))
            : (this.noPolitician = true);
          // return (this.politician = data);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async searchBySurnameToUpper(toUp, surnameStr) {
      try {
        toUp ? (surnameStr = surnameStr.toUpperCase()) : null;
        let fullName = {
          surname: surnameStr,
        };
        if (this.name) {
          fullName.name = this.name;
        }
        let conditions = encodeURIComponent(
          JSON.stringify({
            fullName,
          })
        );
        let data = await this.$axios.get(`deputies?conditions=${conditions}`);
        return data.data.page.data;
      } catch (err) {
        console.log(err);
      }
    },
    async searchByDate() {
      try {
        let conditions = encodeURIComponent(
          JSON.stringify({
            createdAt: {
              $gte: this.fromDate,
              $lte: this.toDate,
            },
          })
        );
        let data = await this.$axios.get(`/appeals?conditions=${conditions}`);
        // let data = await this.$axios.get('/appeals');
        console.log(data);
        this.appeals = data.data.page.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.center__container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;

  .item {
    width: 40%;
    margin-right: 3%;
  }
}
</style>
