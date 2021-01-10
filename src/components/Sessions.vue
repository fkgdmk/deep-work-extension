<template>
  <div>
    <h3 class="mb-4 d-flex justify-content-center">
      Sessions
      <div
        style="font-size: 15px;"
        class="ml-2"
        v-b-tooltip.hover
        title="Create sessions by defining starttime-endtime and frequency"
      >
        <b-icon-info-circle></b-icon-info-circle>
      </div>
    </h3>
    <div v-if="!dataLoaded" class="d-flex justify-content-center">
      <b-spinner></b-spinner>
    </div>
    <div v-else>
      <div v-for="(session, index) in sessions" :key="index">
        <div class="d-flex justify-content-between">
          <h5>
            Session {{index + 1}}
            <b-badge v-if="shouldSessionBeRunning(session) && !session.isPaused" variant="success" style="font-size: 12px;">Live</b-badge>
            <b-badge v-if="session.isPaused" variant="warning" style="font-size: 12px;">Paused</b-badge>
          </h5>
          <div class="d-flex">
            <div v-if="shouldSessionBeRunning(session)">
              <b-button @click="updateIsPaused(index)">
                <b-icon-pause-fill v-if="!session.isPaused"></b-icon-pause-fill>
                <b-icon-play-fill v-else></b-icon-play-fill>
              </b-button>
            </div>
            <b-button @click="deleteSession(index)" class="ml-2">
              <b-icon-trash></b-icon-trash>
            </b-button>
          </div>
        </div>
        <b-row>
          <b-col>
            <label>Choose start time</label>
            <b-form-timepicker v-model="session.startTime" :locale="locale" class="mb-2"></b-form-timepicker>
            <label>Choose end time</label>
            <b-form-timepicker v-model="session.endTime" :locale="locale"></b-form-timepicker>
          </b-col>
          <b-col>
            <label>Choose when the session should occur</label>
            <b-form-radio
              v-model="session.frequency"
              @change="frequencyOnChange(index, 'everyday')"
              class="mr-2"
              value="everyday"
            >Everyday</b-form-radio>
            <b-form-radio
              v-model="session.frequency"
              @change="frequencyOnChange(index, 'weekdays')"
              class="mr-2"
              value="weekdays"
            >Only weekdays</b-form-radio>
            <b-form-radio v-model="session.frequency" value="custom">Custom</b-form-radio>
            <div v-if="session.frequency === 'custom'">
              <b-form-checkbox-group v-model="session.days" :options="customOptions"></b-form-checkbox-group>
            </div>
          </b-col>
        </b-row>
        <hr />
      </div>
      <div id="add-session-btn">
        <b-button :disabled="!valid" @click="addSession">
          <b-icon-plus />Add session
        </b-button>
      </div>
      <b-tooltip
        v-if="!valid"
        target="add-session-btn"
        placement="right"
        triggers="hover"
      >Finish other sessions before creating a new one</b-tooltip>
    </div>
  </div>
</template>

<script>
import {
  BIconTrash,
  BIconPlus,
  BIconInfoCircle,
  BIconPauseFill,
  BIconPlayFill
} from "bootstrap-vue";

export default {
  name: "Sessions",
  components: {
    BIconTrash,
    BIconPlus,
    BIconInfoCircle,
    BIconPauseFill,
    BIconPlayFill
  },
  mounted: function() {
    chrome.storage.local.get("sessions", storage => {
      console.log(storage.sessions);
      if (storage.sessions) this.sessions = storage.sessions;
      this.dataLoaded = true;
    });
  },
  data: () => {
    return {
      sessions: [
        {
          startTime: null,
          endTime: null,
          frequency: "everyday",
          days: [1, 2, 3, 4, 5, 6, 0],
          isPaused: false
        }
      ],
      dataLoaded: false,
      locale: window.navigator.language,
      customOptions: [
        {
          text: "Monday",
          value: 1
        },
        {
          text: "Tuesday",
          value: 2
        },
        {
          text: "Wednesday",
          value: 3
        },
        {
          text: "Thursday",
          value: 4
        },
        {
          text: "Friday",
          value: 5
        },
        {
          text: "Saturday",
          value: 6
        },
        {
          text: "Sunday",
          value: 0
        }
      ]
    };
  },
  computed: {
    valid: function() {
      return this.sessions.filter(session => {
        return session.startTime === null && session.endTime === null;
      }).length > 0
        ? false
        : true;
    }
  },
  watch: {
    sessions: {
      handler(sessions) {
        chrome.storage.local.get("sessions", storage => {
          if (!storage.sessions) storage.sessions = [];

          storage.sessions = sessions;
          chrome.storage.local.set(storage);
        });
      },
      deep: true
    }
  },
  methods: {
    addSession() {
      chrome.storage.local.get("sessions", storage => {
        if (!storage.sessions) storage.sessions = [];
        storage.sessions.push({
          startTime: null,
          endTime: null,
          frequency: "everyday",
          days: [1, 2, 3, 4, 5, 6, 0],
          isPaused: false
        });
        this.sessions = storage.sessions;
        chrome.storage.local.set(storage);
      });
    },
    deleteSession(index) {
      chrome.storage.local.get("sessions", storage => {
        storage.sessions.splice(index, 1);
        this.sessions = storage.sessions;
        chrome.storage.local.set(storage);
      });
    },
    frequencyOnChange(index, frequencyValue) {
      if (frequencyValue === "weekdays") {
        const days = [...this.customOptions];
        this.sessions[index].days = days.splice(0, 5).map(day => day.value);
      } else if (frequencyValue === "everyday") {
        this.sessions[index].days = this.customOptions.map(day => day.value);
      }
    },
    updateIsPaused(index) {
      chrome.storage.local.get("sessions", storage => {
        this.sessions[index].isPaused = !this.sessions[index].isPaused;
        storage.sessions = this.sessions;
        chrome.storage.local.set(storage);
      });
    },
    shouldSessionBeRunning(session) {
      if (session.startTime && session.endTime) {
        const currentDate = new Date();
        let startDate = new Date();
        startDate.setHours(session.startTime.split(":")[0]);
        startDate.setMinutes(session.startTime.split(":")[1]);
        startDate.setSeconds(session.startTime.split(":")[2]);
        console.log(startDate);

        let endDate = new Date();
        endDate.setHours(session.endTime.split(":")[0]);
        endDate.setMinutes(session.endTime.split(":")[1]);
        endDate.setSeconds(session.endTime.split(":")[2]);

        if (startDate < currentDate && endDate > currentDate) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>

<style>
</style>