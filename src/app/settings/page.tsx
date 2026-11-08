import { ReceivePathSettingsPage } from "@/components/settings/receive-path-settings-page";

export const metadata = {
  title: "Receive Path Settings",
  description: "Prioritize receive paths and PayToDapps for authenticated MyPayTag users.",
};

export default function SettingsPage() {
  return <ReceivePathSettingsPage />;
}
