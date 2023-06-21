module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user/score-category",
      handler: "general-info.scoreCategory",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
