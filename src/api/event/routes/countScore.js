module.exports = {
  routes: [
      {
          method: "POST",
          path: "/events/count-score",
          handler: "event.countScore",
          config: {
              prefix: "",
              policies: []
          }
      },
  ],
};
