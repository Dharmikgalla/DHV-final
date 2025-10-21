export const metadata = {
  title: "Interactive Hierarchical Clustering",
  description:
    "Learn hierarchical clustering through interactive visualizations.",
};

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

