<template>
    <div>
        <div v-if="!appeals.length">
            <h1>Пошук звернень</h1>
            <br/>

            <form @submit.prevent="search">
                <h3>Введить дані для пошуку </h3>
                <br/>
                <label>Введіть фамілію політика для пошука:</label>
                <div  class="center__container">
                    
                    <b-form-group class="item">
                        <b-form-input
                            class="main-size"
                            id="surname"
                            v-model="surname"
                            type="text"
                            placeholder="Введіть фамілію політика"
                        ></b-form-input>
                    </b-form-group>
                    <!-- <b-form-group class="item">
                        <b-form-input
                            class="main-size"
                            id="name"
                            v-model="name"
                            type="text"
                            placeholder="Введіть ім'я політика"
                        ></b-form-input>
                    </b-form-group> -->
                </div>
                <div v-if="noPolitician" style="color:red">Політика не знайдено</div>
                <div class="date">
                    <div class="item">
                        <div>
                            <label for="example-datepicker">Оберіть дати для пошука:</label>
                            <b-form-datepicker placeholder="Дата початок пошука" id="example-datepicker" v-model="fromDate" class="mb-2"></b-form-datepicker>
                        </div>
                        <div>
                            <b-form-datepicker placeholder="Дата кінець пошука" id="example-datepicker" v-model="toDate" class="mb-2"></b-form-datepicker>
                        </div>
                        <div style="color:red" v-if="noDates">За ці дати не знайдено звернень</div>
                    </div>   
                    <div class="item">
                        <b-button variant="success" v-if="fromDate || toDate" @click="newDate">Видалити дату</b-button>
                    </div>
                </div>

               <b-button variant="outline-primary" type="submit">Показати звернення</b-button>
            </form>
            
        </div>
        <br/>
        <div style="width:100%;" v-if="appeals.length">
          
            <div class="appeals__back"  @click="backToSearch"> <b-icon style="margin-right:5px" icon="backspace-fill"></b-icon>Назад</div>
       
            <b-button  class="downloadAppeals" variant="primary" @click="downloadXlsx">Завантажити звернення</b-button>
            <h5>Всього звернень: {{appeals.length}}</h5>
            <appeal-card   :appeals="appeals"/>
        </div>
        
    </div>
</template>

<script>
import appealCard from '@/components/appeal-card';
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
      noDates: false,
      deputyId: null,
    };
  },
  components: {
    appealCard,
  },
  methods: {
    async search(e) {
      try {
        this.appeals = [];
        e.preventDefault();
        if (this.surname) {
          this.deputyId = await this.searchBySurname();
        }

        if (this.fromDate && this.toDate && this.deputyId) {
          let appealsArr = await this.searchByDate(this.deputyId);
          appealsArr.length
            ? (this.appeals = appealsArr)
            : (this.noDates = true);
        } else if (!this.fromDate && !this.toDate && this.deputyId) {
          let conditions = encodeURIComponent(
            JSON.stringify({
              deputyId: this.deputyId,
            })
          );
          let data = await this.$axios.get(`appeals?conditions=${conditions}`);
          this.appeals = data.data.page.data;
        } else if (this.fromDate && this.toDate && !this.deputyId) {
          let appealsArr = await this.searchByDate();
          appealsArr.length
            ? (this.appeals = appealsArr)
            : (this.noDates = true);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async searchBySurname() {
      try {
        let surname = this.surname.split('');
        surname.splice(0, 1, surname[0].toUpperCase());
        let surnameStr = surname.join('');

        //try to find politician with only 1st letter to UpperCase
        let data = await this.searchBySurnameToUpper(false, surnameStr);
        if (data.length) {
          //if there in politician with only 1st

          this.noPolitician = false;
          return data[0].deputyId;
        } else {
          let data = await this.searchBySurnameToUpper(true, surnameStr);
          data.length
            ? ((this.politician = data), (this.noPolitician = false))
            : (this.noPolitician = true);
          return data[0].deputyId;
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
    async searchByDate(id) {
      try {
        let conditionObj = {
          createdAt: {
            $gte: this.fromDate,
            $lte: this.toDate,
          },
        };
        if (id) {
          conditionObj.deputyId = id;
        }
        let conditions = encodeURIComponent(JSON.stringify(conditionObj));
        let data = await this.$axios.get(`/appeals?conditions=${conditions}`);
        return data.data.page.data;
      } catch (err) {
        console.log(err);
      }
    },
    async downloadXlsx() {
      try {
        console.log(1);
      } catch (err) {
        console.log(err);
      }
    },

    backToSearch() {
      this.appeals = [];
      this.surname = '';
      this.politician = [];
      this.noPolitician = false;
      this.name = '';
      this.fromDate = null;
      this.toDate = null;
      this.appeals = [];
      this.noDates = false;
    },
    newDate(e) {
      e.preventDefault();
      this.fromDate = null;
      this.toDate = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.center__container {
  display: flex;
  flex-direction: row;
}

.item {
  width: 40%;
  margin-right: 3%;
}

.appeals__back {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}
.downloadAppeals {
  width: 300px;
  margin-bottom: 20px;
}

.date {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
