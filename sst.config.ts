/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "saas-boilerplate",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const table = new sst.aws.Dynamo("Todo", {
      fields: {
        id: "string",
      },
      primaryIndex: { hashKey: "id" },
    });
    new sst.aws.Nextjs("MyWeb", {
      link: [table],
    });
  },
});
