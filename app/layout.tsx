import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/app/lib/utils/cn";

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
      <body className={cn(
        "bg-neutral-50",
        "font-sans antialiased"
      )}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-primary-600">
                      단어 학습
                    </h1>
                  </Link>
                  <nav className="flex items-center gap-6">
                    <Link
                      href="/wordsets"
                      className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      단어 세트
                    </Link>
                    <Link
                      href="/folders"
                      className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      폴더
                    </Link>
                  </nav>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-200 bg-white py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <p className="text-center text-sm text-neutral-600">
                  © 2025 Lang Quiz. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
