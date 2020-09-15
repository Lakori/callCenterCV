<template>
    <div class="appeals">
      <div v-if="loader" class="appeal__load"><b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon></div>
        <b-card-group v-else deck  
            v-for="item in mainAppeals"
            :key="item.id"
            class="appeals-card">
            <b-card
                :header="item.topic"
                header-tag="header"
                :footer="item.status"
                footer-tag="footer"
                
                >
                <b-card-text>
                    <h5>{{item.voterSurname}} {{item.voterName}} {{item.voterPhone}}</h5><br/>
                    <h6><b>Адресат політик:</b> {{item.politicianSurname || 'не'}} {{item.politicianName || 'знайдено'}}</h6>
                    <h6><b>Адресат партія:</b>{{item.party || 'не знайдено'}}</h6>
                    <b>Текст звернення :</b><br/>{{item.contentPart}}<br/>
                </b-card-text>
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
    };
  },
  props: {
    appeals: {
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
  },
  watch: {
    async currentPage() {
      await this.getAllInfo();
    },
  },
  async created() {
    await this.getAllInfo();
  },
  methods: {
    async getAllInfo() {
      try {
        this.mainAppeals = [];
        this.loader = true;
        for (let i = 0; i <= this.appeals.length - 1; i++) {
          let infoVoter = await this.findVoter(this.appeals[i].voterId);
          if (this.appeals[i].politicalPartyId) {
            let infoParty = await this.findParty(
              this.appeals[i].politicalPartyId
            );
            this.appeals[i].party = infoParty.name;
          }
          if (this.appeals[i].deputyId) {
            let infoPolitician = await this.findPolitician(
              this.appeals[i].deputyId
            );
            this.appeals[i].politicianName = infoPolitician.name;
            this.appeals[i].politicianSurname = infoPolitician.surname;
          }

          this.appeals[i].voterSurname = infoVoter.surname;
          this.appeals[i].voterName = infoVoter.name;
          this.appeals[i].voterPhone = infoVoter.phone;

          this.appeals[i].contentPart = this.appeals[i].content
            .split('')
            .splice(0, 160)
            .join('');
          if (this.appeals[i].contentPart.length == 160) {
            this.appeals[i].contentPart = `${this.appeals[i].contentPart} ...`;
          }
          this.mainAppeals.push(this.appeals[i]);
        }
        this.loader = false;
        // await this.appeals.forEach(async item => {
        //   let infoVoter = await this.findVoter(item.voterId);
        //   if (item.politicalPartyId) {
        //     let infoParty = await this.findParty(item.politicalPartyId);
        //     item.party = infoParty.name;
        //   }
        //   if (item.deputyId) {
        //     let infoPolitician = await this.findPolitician(item.deputyId);
        //     item.politicianName = infoPolitician.name;
        //     item.politicianSurname = infoPolitician.surname;
        //   }

        //   item.voterSurname = infoVoter.surname;
        //   item.voterName = infoVoter.name;
        //   item.voterPhone = infoVoter.phone;

        //   item.contentPart = item.content
        //     .split('')
        //     .splice(0, 160)
        //     .join('');
        //   if (item.contentPart.length == 160) {
        //     item.contentPart = `${item.contentPart} ...`;
        //   }
        //   this.mainAppeals.push(item);
        // });
      } catch (err) {
        console.log(err);
      }
    },
    async findVoter(id) {
      try {
        let data = await this.$axios.get(`/voters/${id}`);
        return {
          surname: data.data.fullName.surname || 'без фамилии',
          name: data.data.fullName.name || 'без имени',
          phone: data.data.phone,
        };
      } catch (err) {
        console.log('nne');
        throw new Error(err);
      }
    },
    async findPolitician(id) {
      try {
        let data = await this.$axios.get(`/deputies/${id}`);

        return {
          surname: data.data.fullName.surname,
          name: data.data.fullName.name,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    async findParty(id) {
      try {
        let data = await this.$axios.get(`/political-parties/${id}`);
        return {
          name: data.data.name,
        };
      } catch (err) {
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

.appeal__load {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

