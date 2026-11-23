import type { Metadata } from "next";
import { RolePage } from "@/components/marketing/role-page";

export const metadata: Metadata = { title: "For payee app developers | MyPayTag", description: "Make your app a preferred receiving destination with user-authorized capabilities and provider-built payment instructions." };

export default function Page() { return <RolePage audience="payee" />; }
