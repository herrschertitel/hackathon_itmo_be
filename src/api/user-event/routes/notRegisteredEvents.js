module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-event/not-registered-events/:id",
      handler: "user-event.notRegisteredEvents",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
