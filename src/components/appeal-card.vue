<template>
    <div class="appeals">
        <b-card-group deck  
            v-for="item in appeals"
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
  props: {
    appeals: {
      type: Array,
      default() {
        [];
      },
    },
  },
  computed: {},
  async created() {
    await this.appeals.map(async (item, index) => {
      let infoVoter = await this.findVoter(item.voterId);
      if (item.politicalPartyId) {
        let infoParty = await this.findParty(item.politicalPartyId);
        item.party = infoParty.name;
      }
      if (item.deputyId) {
        let infoPolitician = await this.findPolitician(item.deputyId);
        item.politicianName = infoPolitician.name;
        item.politicianSurname = infoPolitician.surname;
      }

      item.voterSurname = infoVoter.surname;
      item.voterName = infoVoter.name;
      item.voterPhone = infoVoter.phone;

      item.contentPart = item.content
        .split('')
        .splice(0, 160)
        .join('');
      if (item.contentPart.length == 160) {
        item.contentPart = `${item.contentPart} ...`;
      }
      this.$set(this.appeals, index, item);
    });
  },
  methods: {
    async findVoter(id) {
      try {
        let data = await this.$axios.get(`/voters/${id}`);
        return {
          surname: data.data.fullName.surname || 'без фамилии',
          name: data.data.fullName.name || 'без имени',
          phone: data.data.phone,
        };
      } catch (err) {
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
</style>

