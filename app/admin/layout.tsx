import { ExamplesNav } from "@/app/admin/appSidebar";
import ReduxProvider from "@/client/store/provider";

import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
      <main className="w-full flex flex-1 flex-col items-center p-[20px]">
        <div className="w-full flex flex-col items-center border-grid border-b">
          <div className="w-full max-w-[1400px]">
            <div className="container py-4">
              <ExamplesNav />
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1400px]">
          <div className="w-full py-6">
            <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
              {children}
            </section>
          </div>
        </div>
      </main>
    </ReduxProvider>
  );
}
