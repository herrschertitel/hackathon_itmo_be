module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-event/registered-events/:id",
      handler: "user-event.registeredEvents",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
