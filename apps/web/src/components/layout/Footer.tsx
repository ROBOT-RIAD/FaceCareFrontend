import { Link } from "react-router"

interface FooterProps {
  email?: string
  tagline?: string
  className?: string
}

export function Footer({
  email = "info@glowmi.net",
  tagline = "Science with Intelligence",
  className = "",
}: FooterProps) {
  return (
    <footer
      className={`w-full bg-[#2e3033] text-gray-200 pt-12 pb-8 px-4 sm:px-6 lg:px-8 transition-colors ${className}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Top Navigation Links */}
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20 text-sm font-medium tracking-wide text-gray-100"
        >
          <Link
            to="/"
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            About Us
          </Link>
          <Link
            to="/privacy-policy"
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="transition-colors hover:text-white hover:underline underline-offset-4"
          >
            Terms &amp; Conditions
          </Link>
        </nav>

        {/* Middle Section: Left Contact, Center Emblem & Tagline, Right Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-8 sm:gap-6 py-2">
          {/* Left: Contact Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-base font-medium text-white mb-1.5">
              Contact Us
            </h4>
            <a
              href={`mailto:${email}`}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Email: {email}
            </a>
          </div>

          {/* Center: Botanical Flower Knot Logo & Tagline */}
          <div className="flex flex-col items-center text-center">
            {/* Floral Insignia */}
            <div className="mb-3 text-white/90 transition-transform duration-300 hover:scale-105">
              <FloralEmblem className="size-14 text-white" />
            </div>

            {/* Tagline */}
            <p className="text-lg md:text-xl font-normal tracking-wide text-white/95">
              {tagline}
            </p>
          </div>

          {/* Right: Contact Info */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="text-base font-medium text-white mb-1.5">
              Contact Us
            </h4>
            <a
              href={`mailto:${email}`}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Email: {email}
            </a>
          </div>
        </div>

        {/* Bottom Section: Follow Us & Social Icons */}
        <div className="flex flex-col items-center justify-center gap-3.5 pt-2">
          <span className="text-sm font-medium text-gray-300 tracking-wider">
            Follow Us
          </span>

          {/* Social Icons Row */}
          <div className="flex items-center gap-4 text-gray-200">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-1 hover:text-white transition-transform hover:scale-110"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-1 hover:text-white transition-transform hover:scale-110"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-1 hover:text-white transition-transform hover:scale-110"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="p-1 hover:text-white transition-transform hover:scale-110"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>

            {/* X (formerly Twitter) */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="p-1 hover:text-white transition-transform hover:scale-110"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Snapchat */}
            <a
              href="https://snapchat.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snapchat"
              className="p-1 hover:text-white transition-transform hover:scale-110"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.007 2c-3.793 0-6.19 2.597-6.223 5.485-.01.815.187 1.656.368 2.235.132.423.277.834.124 1.166-.184.4-1.018.665-1.57.844-.316.103-.787.26-.816.592-.036.425.426.83 1.07 1.144.204.1.442.2.668.324.498.272.766.702.58 1.253-.298.882-1.39 1.488-2.607 1.872-.45.14-.627.433-.6.719.034.349.387.545.892.658 1.127.25 2.51.138 3.535.836.31.21.6.488.948.571.493.118 1.037-.12 1.573-.357.778-.344 1.597-.706 2.057-.706.45 0 1.25.352 2.02.695.545.244 1.1.49 1.61.368.347-.082.639-.36.947-.57.994-.678 2.378-.574 3.535-.837.505-.113.857-.31.892-.658.026-.286-.151-.579-.6-.719-1.218-.384-2.31-.99-2.607-1.872-.186-.55.082-.98.58-1.253.226-.123.464-.224.668-.324.644-.314 1.106-.72 1.07-1.144-.029-.332-.5-.49-.816-.592-.552-.18-1.386-.444-1.57-.844-.153-.332-.008-.743.124-1.166.18-.58.378-1.42.368-2.235C18.196 4.597 15.8 2 12.007 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * Botanical geometric floral knot insignia inspired by the reference image
 */
function FloralEmblem({ className = "size-14 text-white" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="translate(50, 50)">
        {/* 4 Interwoven Petal Loops */}
        {[0, 90, 180, 270].map((rot) => (
          <g key={rot} transform={`rotate(${rot})`}>
            {/* Main Outer Teardrop Loop */}
            <path
              d="M0,-6 C-9,-18 -18,-30 -10,-40 C-2,-48 14,-42 16,-30 C18,-18 7,-10 0,-6"
              fill="none"
            />
            {/* Interlacing Cross Loop */}
            <path
              d="M-6,0 C-18,-9 -30,-18 -40,-10 C-48,-2 -42,14 -30,16 C-18,18 -10,7 -6,0"
              fill="none"
            />
            {/* Inner Bridge Curve */}
            <path
              d="M-10,-10 C-4,-17 4,-17 10,-10 C17,-4 17,4 10,10"
              fill="none"
              strokeWidth="2"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

export default Footer
