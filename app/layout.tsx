import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Lang Quiz - Word Set Management",
  description: "Learn vocabulary with word sets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        <Providers>
          <div className="min-h-screen">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold text-gray-900">단어 세트 학습</h1>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
