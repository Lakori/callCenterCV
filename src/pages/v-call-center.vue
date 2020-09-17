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
                    <b-form-input list="my-list-id" class="item" v-model="surname"></b-form-input>

                      <datalist id="my-list-id">
                        <option v-for="deputy in politicians" :key="deputy.id" >{{ deputy.fullName.surname }} {{deputy.fullName.name}}</option>
                      </datalist>
                </div>
                <div v-if="noPolitician" class="noPolitician">Політика не знайдено</div>
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
      politicians: [],
      parties: [],
      noPolitician: false,
      name: '',
      fromDate: null,
      toDate: null,
      appeals: [],
      noDates: false,
      deputyId: null,
      currentPage: 1,
      perPage: 10,
      rows: null,
      newPage: null,
      noMatches: false,
    };
  },
  components: {
    appealCard,
  },
  watch: {
    async currentPage() {
      let appealsArr = await this.searchByDate(this.deputyId);
      this.appeals = appealsArr;
      this.newPage = this.currentPage;
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
        console.log(err);
      }
    },
    async getAllParties() {
      try {
        this.parties = [];
        let data = await this.$axios.get('/political-parties');
        this.parties = data.data.page.data;
      } catch (err) {
        console.log(err);
      }
    },
    async search(e) {
      try {
        this.appeals = [];
        e.preventDefault();
        if (this.surname) {
          this.deputyId = await this.searchBySurname();
        } else {
          this.deputyId = null;
        }

        let appealsArr = await this.searchByDate(this.deputyId);
        this.appeals = appealsArr;
        this.newPage = this.currentPage;
      } catch (err) {
        console.log(err);
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
        if (id) {
          conditionObj.deputyId = id;
        }
        let conditions = encodeURIComponent(JSON.stringify(conditionObj));
        let data = await this.$axios.get(
          `/appeals?conditions=${conditions}&options=${options}`
        );
        this.rows = data.data.totalItems;
        this.noMatches = data.data.totalItems > 0 ? false : true;
        return data.data.page.data;
      } catch (err) {
        console.log(err);
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
        console.log(err);
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

.noPolitician {
  color: red;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
