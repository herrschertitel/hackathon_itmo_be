module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-event/not-registered-events",
      handler: "user-event.notRegisteredEvents",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
