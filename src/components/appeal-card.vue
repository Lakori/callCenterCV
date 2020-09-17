<template>
    <div class="appeals">
      <div v-if="loader" class="appeal__load"><b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon></div>
        <b-card-group v-else deck  
            v-for="(item, index) in mainAppeals"
            :key="item.id"
            class="appeals-card">
            <b-card>
                <template v-slot:header>
                  <b><h5>{{item.topic}}</h5></b>
                </template>
                <b-card-text>
                    <h5>{{item.voterSurname}} {{item.voterName}} {{item.voterPhone}}</h5><br/>
                    <h6><b>Адресат політик:</b> {{item.politicianName || 'не знайдено'}}</h6>
                    <h6><b>Адресат партія:</b>{{item.party || 'не знайдено'}}</h6>
                    <b>Текст звернення :</b><br/>
                    <div v-if="!(check === index)"> {{item.contentPart}}
                      <b class="more" @click="check = index" v-if="item.contentPart.length == 160">...</b>
                    </div>
                    <div v-else> {{item.content}}</div>
                    <div class="img__container" v-if="item.image">
                      <a target="_blank" :href="item.image"><img :src="item.image"></a>
                     <a target="_blank" :href="item.image" download> Завантажити </a>
                    </div>
                </b-card-text>
                <template v-slot:footer>
                  <b class="greenStatus" :class="{newStatus: item.status === 'new'}">{{itemStatus(item.status)}}</b>
                </template>
            </b-card>
        </b-card-group>
    </div>
</template>

<script>
export default {
  data() {
    return {
      mainAppeals: [],
      loader: false,
      politicianReduced: [],
      partiesReduced: [],
      fullInfo: false,
      check: null,
      bigImg: false,
      statuses: {
        new: 'Нове звернення',
        moderate: 'Звернення опубліковано',
        sendForClarification: 'Звернення направлено на розгляд адресатові',
        accepted: 'За зверненням розпочато перевірку',
      },
    };
  },
  props: {
    appeals: {
      type: Array,
      default() {
        [];
      },
    },
    politicianArr: {
      type: Array,
      default() {
        [];
      },
    },
    currentPage: {
      type: Number,
      default() {
        1;
      },
    },
    partiesArr: {
      type: Array,
      default() {
        [];
      },
    },
  },
  watch: {
    async currentPage() {
      await this.getAllInfo();
    },
  },
  async created() {
    this.politicianReduced = this.politicianArr.reduce((acc, current) => {
      acc[current.deputyId] = `${current.fullName.surname} ${
        current.fullName.name
      }`;
      return acc;
    }, {});
    await this.getAllInfo();
  },
  methods: {
    itemStatus(status) {
      let ruStatus;
      for (let key in this.statuses) {
        status === key ? (ruStatus = this.statuses[key]) : null;
      }
      return ruStatus;
    },
    async downloadImg(img) {
      try {
        let link = document.createElement('a');
        link.target = '_blank';
        link.download = 'img.jpg';
        link.href = `${img}`;
        link.click();
      } catch (err) {
        console.log(err);
      }
    },
    async getAllInfo() {
      try {
        this.mainAppeals = [];
        this.loader = true;
        for (let i = 0; i <= this.appeals.length - 1; i++) {
          let infoVoter = await this.findVoter(this.appeals[i].voterId);

          if (this.appeals[i].politicalPartyId) {
            this.partiesArr.forEach(item => {
              this.appeals[i].politicalPartyId === item.politicalPartyId
                ? (this.appeals[i].party = item.name)
                : null;
            });
          }
          if (this.appeals[i].deputyId) {
            this.politicianArr.forEach(item => {
              this.appeals[i].deputyId === item.deputyId
                ? (this.appeals[i].politicianName = `${item.fullName.surname} ${
                    item.fullName.name
                  }`)
                : null;
            });
          }

          this.appeals[i].voterSurname = infoVoter.surname;
          this.appeals[i].voterName = infoVoter.name;
          this.appeals[i].voterPhone = infoVoter.phone;

          this.appeals[i].contentPart = this.appeals[i].content
            .split('')
            .splice(0, 160)
            .join('');

          this.mainAppeals.push(this.appeals[i]);
        }
        this.loader = false;
      } catch (err) {
        console.log(err);
      }
    },
    async findVoter(id) {
      try {
        let data = await this.$axios.get(`/voters/${id}`);
        return {
          surname: data.data.fullName.surname || 'без фамилии',
          name: data.data.fullName.name || '',
          phone: data.data.phone,
        };
      } catch (err) {
        console.log('nne');
        throw new Error(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.appeals {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &-card {
    min-width: 30%;
    max-width: 30%;
    margin-bottom: 20px;
    margin-right: 20px;
  }
}

.img__container {
  display: flex;
  flex-direction: column;
  img {
    max-width: 30%;
    max-height: 150px;
  }

  .img__download {
    height: 60px;
    width: 150px;
    margin-right: 0;
    margin-left: auto;
  }
}

.appeal__load {
  width: 100%;
  display: flex;
  justify-content: center;
}

.more {
  color: blue;
  cursor: pointer;
}

.greenStatus {
  color: green;
}
.newStatus {
  color: red;
}
</style>

