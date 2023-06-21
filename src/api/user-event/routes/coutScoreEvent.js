module.exports = {
  routes: [
      {
          method: "POST",
          path: "/user-event/count-score",
          handler: "user-event.countScoreEvent",
          config: {
              prefix: "",
              policies: []
          }
      },
  ],
};
