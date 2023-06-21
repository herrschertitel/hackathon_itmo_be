module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user/publication/:id",
      handler: "user-publication.publicationUser",
      config: {
        prefix: "",
        policies: []
      }
    },
  ],
};
