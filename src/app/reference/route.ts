import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  url: "/api/openapi.yaml",
  theme: "default",
  metaData: {
    title: "MyPayTag API Reference",
    description: "Interactive Scalar reference for the public MyPayTag API.",
  },
});
