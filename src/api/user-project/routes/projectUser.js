module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user/projects/:id",
      handler: "user-project.projectUser",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
