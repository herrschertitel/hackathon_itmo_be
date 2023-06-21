module.exports = {
  routes: [
    {
      method: "POST",
      path: "/user-event/filter-event/:id",
      handler: "user-event.filterEvent",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
