module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-event/registered-events",
      handler: "user-event.registeredEvents",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
