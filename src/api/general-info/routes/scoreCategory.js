module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user/score-category/:id",
      handler: "general-info.scoreCategory",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
