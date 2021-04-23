<template>
    <div>
        <div v-if="!appeals.length">
            <h1>Пошук звернень</h1>
            <br/>

            <form @submit.prevent="search">
                <h3>Введить дані для пошуку </h3>
                <br/>
                <div class="search__container">
                  <div class="search__item">
                    <label>Введіть фамілію політика для пошука:</label>
                    <div  class="center__container">
                    
                      <b-form-input list="my-list-id" class="item" v-model="surname"></b-form-input>

                        <datalist id="my-list-id">
                          <option v-for="deputy in politicians" :key="deputy.id" >{{ deputy.fullName.surname }} {{deputy.fullName.name}}</option>
                        </datalist>
                    </div>
                  </div>
                  <h2>АБО</h2>
                  <div class="search__item">
                   <label>Введіть фамілію чи телефон користувача</label>
                    <div  class="center__container">
                  
                      <b-input class="item" v-model="userData" placeholder="Номер повинен починатись з +380..."></b-input>
                    </div> 
                    <br/>
                     <div v-if="noUser" class="noUser">Користувача не знайдено</div>
                  </div>
                </div>
                <br/>
                <div class="date">
                    <div class="item">
                        <div>
                            <label>Оберіть дати для пошука:</label>
                            <b-form-datepicker placeholder="Дата початок пошука" id="example-datepicker1" v-model="fromDate" class="mb-2"></b-form-datepicker>
                        </div>
                        <br/>
                        <div>
                            <b-form-datepicker placeholder="Дата кінець пошука" id="example-datepicker2" v-model="toDate" class="mb-2"></b-form-datepicker>
                        </div>
                        <div style="color:red" v-if="noDates">За ці дати не знайдено звернень</div>
                    </div>   
                    <div class="item">
                        <b-button variant="success" v-if="fromDate || toDate" @click="newDate">Видалити дату</b-button>
                    </div>
                </div>

               <b-button variant="outline-primary" type="submit">Показати звернення</b-button>
            </form>
            <br/>
            <h5 v-if="noMatches" style="color:red">Не знайдено жодного звернення</h5>
        </div>
        <br/>
        <div style="width:100%;" v-if="appeals.length">
          
            <div class="appeals__back"  @click="backToSearch"> <b-icon style="margin-right:5px" icon="backspace-fill"></b-icon>Назад</div>
       
            <b-button  class="downloadAppeals" variant="primary" @click="downloadXlsx">Завантажити ВСІ звернення</b-button>
            <h5>Всього звернень: {{this.rows}}</h5><br/>
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
              style="justify-content:center; margin-bottom:20px"
            ></b-pagination>
            <appeal-card   :partiesArr="parties" :politicianArr="politicians" :currentPage="newPage" :appeals="appeals"/>
             <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
              style="justify-content:center; margin-bottom:20px"
            ></b-pagination>
        </div>
        
    </div>
</template>

<script>
import appealCard from '@/components/appeal-card';
export default {
  data() {
    return {
      surname: '',
      userData: '',
      politicians: [],
      parties: [],
      noPolitician: false,
      name: '',
      fromDate: null,
      toDate: null,
      appeals: [],
      noDates: false,
      deputyId: null,
      voterId: null,
      currentPage: 0,
      perPage: 10,
      rows: null,
      newPage: null,
      noMatches: false,
      noUser: false,
    };
  },
  components: {
    appealCard,
  },
  watch: {
    async currentPage() {
      if (this.currentPage && this.surname) {
        let appealsArr = await this.searchByDate(this.deputyId);
        this.appeals = appealsArr;
        this.newPage = this.currentPage;
      } else if (this.currentPage && this.userData && !this.noUser) {
        let appealsArr = await this.searchByDate(this.voterId);
        this.appeals = appealsArr;
        this.newPage = this.currentPage;
      }
    },
  },
  async created() {
    await this.getAllPolitician();
    await this.getAllParties();
  },
  methods: {
    async getAllPolitician() {
      try {
        this.parties = [];
        let data = await this.$axios.get('/deputies');
        this.politicians = data.data.page.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getAllParties() {
      try {
        this.parties = [];
        let data = await this.$axios.get('/political-parties');
        this.parties = data.data.page.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    async search(e) {
      try {
        e.preventDefault();
        this.currentPage = 0;
        this.noUser = false;
        if (this.surname) {
          this.voterId = null;
          this.deputyId = await this.searchBySurname();
          if (this.deputyId) {
            this.currentPage = 1;
          }
        } else if (this.userData) {
          this.deputyId = null;
          this.userData.includes(0)
            ? (this.voterId = await this.searchUserMob())
            : (this.voterId = await this.searchUserData());

          if (this.voterId) {
            this.currentPage = 1;
          }
        } else {
          this.voterId = null;
          this.deputyId = null;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async searchUserMob() {
      try {
        let conditions = encodeURIComponent(
          JSON.stringify({
            phone: this.userData,
          })
        );
        let data = await this.$axios.get(`voters?conditions=${conditions}`);

        if (data.data.totalItems) {
          return data.data.page.data[0].voterId;
        } else {
          this.noUser = true;
          this.currentPage = 0;
          return null;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async searchUserData() {
      try {
        let conditions = encodeURIComponent(
          JSON.stringify({
            fullName: {
              surname: this.userData,
            },
          })
        );
        let data = await this.$axios.get(`voters?conditions=${conditions}`);
        if (data.data.totalItems) {
          return data.data.page.data[0].voterId;
        } else {
          this.noUser = true;
          this.currentPage = 0;
          return null;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async searchByDate(id) {
      try {
        let conditionObj = {};
        this.noMatches = false;
        let options = encodeURIComponent(
          JSON.stringify({
            page: {
              index: this.currentPage - 1,
              size: this.perPage,
            },
          })
        );

        if (this.fromDate && this.toDate) {
          conditionObj.createdAt = {
            $gte: this.fromDate,
            $lte: this.toDate,
          };
        }
        if (id && this.deputyId) {
          conditionObj.deputyId = id;
        } else if (id && this.voterId) {
          conditionObj.voterId = id;
        }
        let conditions = encodeURIComponent(JSON.stringify(conditionObj));
        let data = await this.$axios.get(
          `/appeals?conditions=${conditions}&options=${options}`
        );
        this.rows = data.data.totalItems;
        this.noMatches = data.data.totalItems > 0 ? false : true;
        return data.data.page.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    async searchBySurname() {
      try {
        if (this.surname) {
          let fullName = this.surname.split(' ');
          let conditions = encodeURIComponent(
            JSON.stringify({
              fullName: {
                surname: fullName[0],
                name: fullName[1],
              },
            })
          );
          let data = await this.$axios.get(`deputies?conditions=${conditions}`);
          return data.data.page.data[0].deputyId;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async downloadXlsx() {
      try {
        let conditionObj = {};
        if (this.fromDate && this.toDate) {
          conditionObj.createdAt = {
            $gte: this.fromDate,
            $lte: this.toDate,
          };
        }
        if (this.deputyId && this.deputyId !== 'політика не знайдено') {
          conditionObj.deputyId = this.deputyId;
        } else if (this.voterId) {
          conditionObj.voterId = this.voterId;
        }
        let conditions = encodeURIComponent(JSON.stringify(conditionObj));
        let data = await this.$axios.get(
          `/appeals-xlsx?conditions=${conditions}`,
          { responseType: 'blob' }
        );
        let fileURL = window.URL.createObjectURL(new Blob([data.data]));
        let fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'file.xlsx');
        document.body.appendChild(fileLink);

        fileLink.click();
      } catch (err) {
        throw new Error(err);
      }
    },

    backToSearch() {
      this.appeals = [];
      this.surname = '';
      this.politician = [];
      this.noPolitician = false;
      this.noUser = false;
      this.name = '';
      this.fromDate = null;
      this.toDate = null;
      this.appeals = [];
      this.noDates = false;
      this.back = false;
      this.currentPage = null;
      this.voterId = null;
      this.userData = null;
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
.search__container {
  display: flex;
  flex-direction: row;

  h2 {
    color: #007bff;
    margin-right: 20px;
    margin-left: 10px;
  }
}

.search__item {
  width: 40%;
}
.center__container {
  display: flex;
  flex-direction: row;
}

.item {
  width: 100%;
  margin-right: 5%;
}

.appeals__back {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: -70px;
  width: 150px;
  cursor: pointer;
  margin-bottom: 40px;
  z-index: 10;
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

.noPolitician,
.noUser {
  color: red;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
