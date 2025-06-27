import { Metadata } from "next";
import ReduxProvider from "@/client/store/provider";
import { AdminLayoutClient } from "@/app/admin/adminLayoutClient";

const title = "Examples";
const description = "Check out some examples app built using the components.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </ReduxProvider>
  );
}
