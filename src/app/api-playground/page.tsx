import { ApiPlayground } from "@/components/api-playground/api-playground";

export const metadata = {
  title: "API Playground",
  description: "Interactive local MyPayTag API playground for sending and receiving app developers.",
};

export default function ApiPlaygroundPage() {
  return <ApiPlayground />;
}
