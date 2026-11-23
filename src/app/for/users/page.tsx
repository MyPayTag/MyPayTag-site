import type { Metadata } from "next";
import { RolePage } from "@/components/marketing/role-page";

export const metadata: Metadata = { title: "Get paid your way | MyPayTag", description: "One Paytag for your preferred wallet, chain and asset. Join MyPayTag early access." };

export default function Page() { return <RolePage audience="user" />; }
