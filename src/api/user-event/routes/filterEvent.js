module.exports = {
  routes: [
    {
      method: "POST",
      path: "/user-event/filter-event",
      handler: "user-event.filterEvent",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
