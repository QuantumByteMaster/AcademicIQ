import { Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bottom-0 w-full bg-background z-50 py-8 border-t-2 border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:relative">
          <div className="text-sm text-foreground text-center">
            © {new Date().getFullYear()} AcademicIQ. All rights reserved.
          </div>

          <div className="flex items-center gap-4 md:absolute md:right-0">
            <a
              href="https://x.com/RAJ_BHASKAR_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-[#1DA1F2] transition-colors duration-200"
              aria-label="Follow on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
