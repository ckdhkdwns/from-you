module.exports = function (plop) {
  plop.setGenerator("feature", {
    description: "From You feature structure",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Feature name:",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "app/{{name}}",
        templateFiles: "plop/feature/**/*",
        base: "plop/feature",
      },
    ],
  });
};
