<template>
  <div>
    <div class="btn-container">
      <div v-if="liveSessions.length > 0">
        <h2>
          <span v-if="!liveSessions[0].isPaused">Session is live</span>
          <span v-else>Session is paused</span>
        </h2>
        <h4>{{convertTime(liveSessions[0].startTime)}} - {{convertTime(liveSessions[0].endTime)}}</h4>
        <button @click="goToOptions">Options</button>
      </div>
      <div v-else>
        <h3>No live sessions</h3>
        <button @click="goToOptions">+ New session</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => {
    return {
      sessions: null,
      liveSessions: [],
      dataLoaded: false
    };
  },
  mounted: function() {
    chrome.storage.local.get("sessions", storage => {
      console.log(storage.sessions);
      if (!storage.sessions) return;
      this.sessions = storage.sessions;
      this.getLiveSessesions();
      console.log(this.liveSessions);
      this.dataLoaded = true;
    });
  },
  methods: {
    goToOptions() {
      chrome.tabs.create({ url: "/options.html" });
    },
    getLiveSessesions() {
      for (let i = 0; i < this.sessions.length; i++) {
        const session = this.sessions[i];
        const currentDate = new Date();
        if (session.days.includes(currentDate.getDay())) {
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
            this.liveSessions.push(session);
          }
        }
      }
    }, 
    convertTime(time) {
        const splitted = time.split(':');
        return splitted[0] + ':' + splitted[1];
    }
  }
};
</script>

<style>
html {
  width: 360px;
  padding: 20px;
  background-color: #7da2a9;
}
.btn-container {
  text-align: center;
  background-color: #7da2a9;
  color: #f7f7f7;
}
button {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  border-color: #f7f7f7 !important;
  background-color: #7da2a9 !important;
  color: #f7f7f7;
  cursor: pointer;
}
button:hover {
  opacity: 0.8;
}
</style>
