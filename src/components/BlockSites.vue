<template>
  <div class="mb-4">
    <h3 class="mb-4 d-flex justify-content-center">
      Blocked sites 
      <div style="font-size: 15px;" class="ml-2" v-b-tooltip.hover title="Define which websites should be inaccessible doing sessions">
        <b-icon-info-circle></b-icon-info-circle>
      </div>
    </h3>
    <b-row>
      <b-col md="4">
        <h6>Add single website</h6>
        <div class="d-flex">
          <b-form-input
            type="text"
            v-model="site"
            class="mr-2"
            @keyup.enter="add"
            placeholder="Enter website..."
          />
          <b-button @click="add" :disabled="!valid">
            <b-icon-plus></b-icon-plus>
          </b-button>
        </div>
        <small
          id="emailHelp"
          v-if="errorMsg"
          class="form-text"
          style="color: #e05043;"
        >{{ errorMsg }}</small>
        <h6 class="mt-4">Add group of websites</h6>
        <b-form-checkbox
          v-model="multipleSitesChoices.soMeChecked"
          name="check-button"
          switch
        >Social media sites</b-form-checkbox>
        <b-form-checkbox
          v-model="multipleSitesChoices.newsChecked"
          name="check-button"
          switch
        >News sites</b-form-checkbox>
        <b-form-checkbox
          v-model="multipleSitesChoices.mailChecked"
          name="check-button"
          switch
        >Mail sites</b-form-checkbox>
        <b-form-checkbox
          v-model="multipleSitesChoices.imChecked"
          name="check-button"
          switch
        >Instant Messaging sites</b-form-checkbox>
      </b-col>
      <b-col md="8" style="border: 1px solid #d1d0d0; height: 340px; overflow-y: scroll;">
        <div
          v-for="(site, index) in blockedSites"
          :key="index"
          class="d-flex align-items-center mt-2"
        > 
          <div class="mr-2">https://{{ site }}</div>
          <b-icon-x @click="remove(index)" style="cursor: pointer"></b-icon-x>
        </div>
      </b-col>
    </b-row>
    <hr>
  </div>
</template>

<script>
import { BIconX, BIconPlus, BIconInfoCircle } from "bootstrap-vue";

export default {
  name: "BlockSites",
  components: {
    BIconX,
    BIconPlus,
    BIconInfoCircle
  },
  mounted: function() {
    this.getLocalStorageData().then(() => {
      this.dataLoaded = true;
    });
  },
  data: () => {
    return {
      site: "",
      blockedSites: [],
      errorMsg: null,
      valid: false,
      dataLoaded: false,
      multipleSitesChoices: {
        soMeChecked: false,
        newsChecked: false,
        mailChecked: false,
        imChecked: false
      },
      socialMediaSites: [
        "facebook.com",
        "reddit.com",
        "twitter.com",
        "instagram.com"
      ],
      newsSites: [
        "dr.dk",
        "eb.dk",
        "politiken.dk",
        "bbc.com",
        "thetimes.com",
        "cnn.com",
        "theguardian.com"
      ],
      webshops: [
        "zalando.com",
      ],
      mailSites: ["mail.google.com", "outlook.live.com"],
      imSites: ["slack.com", "microsoft.teams.com"]
    };
  },
  watch: {
    multipleSitesChoices: {
      handler() {
        if (this.dataLoaded) {
          this.updateMultipleSitesChoices();
        }
      },
      deep: true
    },
    "multipleSitesChoices.soMeChecked": function(checked) {
      if (this.dataLoaded) {
        if (checked) {
          this.addMultiple(this.socialMediaSites);
        } else {
          this.removeMultiple(this.socialMediaSites);
        }
      }
    },
    "multipleSitesChoices.newsChecked": function(checked) {
      if (this.dataLoaded) {
        if (checked) {
          this.addMultiple(this.newsSites);
        } else {
          this.removeMultiple(this.newsSites);
        }
      }
    },
    "multipleSitesChoices.mailChecked": function(checked) {
      if (this.dataLoaded) {
        if (checked) {
          this.addMultiple(this.mailSites);
        } else {
          this.removeMultiple(this.mailSites);
        }
      }
    },
    "multipleSitesChoices.imChecked": function(checked) {
      if (this.dataLoaded) {
        if (checked) {
          this.addMultiple(this.imSites);
        } else {
          this.removeMultiple(this.imSites);
        }
      }
    },
    site: function(value) {
      if (value.includes("www")) {
        this.errorMsg = "Do not use www. in front of the domain";
        this.valid = false;
        return;
      }
      if (value.includes("https") || value.includes("http")) {
        this.errorMsg = "Do not use http/https. in front of the domain";
        this.valid = false;
        return;
      }
      if (value.length === 0) {
        this.valid = false;
        return;
      }
      this.errorMsg = null;
      this.valid = true;
    }
  },
  methods: {
    getLocalStorageData() {
      return new Promise((res) => {
        chrome.storage.local.get(
          ["blockedSites", "multipleSitesChoices"],
          storage => {
            if (storage.blockedSites)
              this.blockedSites = storage.blockedSites
            
            if (storage.multipleSitesChoices)
              this.multipleSitesChoices = storage.multipleSitesChoices
            
            res();
          }
        );
      }).catch(error => {
        console.log(error);
      })
    },
    updateMultipleSitesChoices() {
      chrome.storage.local.get("multipleSitesChoices", res => {
        res.multipleSitesChoices = this.multipleSitesChoices;
        chrome.storage.local.set(res);
      });
    },
    addMultiple(sites) {
      chrome.storage.local.get("blockedSites", res => {
        if (!res.blockedSites) res.blockedSites = [];

        res.blockedSites.push(...sites);
        this.blockedSites = res.blockedSites;
        chrome.storage.local.set(res);
      });
    },
    removeMultiple(sites) {
      chrome.storage.local.get("blockedSites", res => {
        sites.forEach(site => {
          const index = res.blockedSites.indexOf(site);
          res.blockedSites.splice(index, 1);
        });
        this.blockedSites = res.blockedSites;
        chrome.storage.local.set(res);
      });
    },
    add() {
      chrome.storage.local.get("blockedSites", res => {
        const site = this.site;
        this.site = "";
        if (!res.blockedSites) res.blockedSites = [];

        if (res.blockedSites.includes(site)) return;

        res.blockedSites.push(site);
        this.blockedSites = res.blockedSites;
        chrome.storage.local.set(res);
      });
    },
    remove(index) {
      chrome.storage.local.get("blockedSites", res => {
        res.blockedSites.splice(index, 1);
        this.blockedSites = res.blockedSites;
        chrome.storage.local.set(res);
      });
    }
  }
};
</script>

<style>
body {
  background-color: #DADED4;
}
button {
  background-color: #164A41;
}
</style>