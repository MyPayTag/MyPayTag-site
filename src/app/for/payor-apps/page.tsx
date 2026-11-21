import type { Metadata } from "next";
import { RolePage } from "@/components/marketing/role-page";

export const metadata: Metadata = { title: "For payor app developers | MyPayTag", description: "Integrate Paytags into your sending app. Resolve recipient preferences into supported payment routes and validated instructions." };

export default function Page() { return <RolePage audience="payor" />; }
