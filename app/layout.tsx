import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'TrendCaption AI — Captions that trend',
  description:
    'Upload an image or video and TrendCaption AI generates scroll-stopping captions, hashtags, and engagement scores for Instagram, LinkedIn, X, and Facebook.',
  openGraph: {
    title: 'TrendCaption AI — Captions that trend',
    description:
      'Upload media, get platform-perfect captions, hashtags, and virality scores in seconds.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrendCaption AI',
    description: 'Captions that trend. Powered by AI.',
  },
};

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
