import { brandTagline, footerColumns } from '@/lib/infogiph-home-content';
import Link from 'next/link';
import { InfogiphWordmark } from './icons';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <InfogiphWordmark className="h-7 w-auto text-foreground mb-4" />
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {brandTagline}
            </p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h5 className="font-semibold text-sm mb-3">{col.heading}</h5>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted-foreground">
          <span>
            © {new Date().getFullYear()} Infogiph. All rights reserved.
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/infographic-maker"
              className="hover:text-foreground transition-colors"
            >
              Infographic Maker
            </Link>
            <span>•</span>
            <Link
              href="/free-infographic-maker"
              className="hover:text-foreground transition-colors"
            >
              Free Infographic Maker
            </Link>
            <span>•</span>
            <Link
              href="/infographic-video-maker"
              className="hover:text-foreground transition-colors"
            >
              Infographic Video Maker
            </Link>
            <span>•</span>
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <span>•</span>
            <Link
              href="/blog/infographics-generator-ai"
              className="hover:text-foreground transition-colors"
            >
              AI Infographic Generator
            </Link>
            <span>•</span>
            <Link
              href="/blog/text-to-infographic-generator"
              className="hover:text-foreground transition-colors"
            >
              Text to Infographic
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
