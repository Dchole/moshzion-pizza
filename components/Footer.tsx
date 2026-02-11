import Link from "next/link";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CONTACT_INFO, BUSINESS_HOURS, FOOTER_LINKS } from "@/lib/constants";
import { SocialLinks } from "@/components/ui";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-(--footer-bg) text-white pt-12 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="lg:max-w-sm">
            <h3 className="font-display text-5xl text-(--footer-pink) mb-4">
              Moshzion
            </h3>
            <p className="text-(--footer-muted) mb-6">
              Serving the community with delicious handcrafted pizzas since day
              one. Quality ingredients, friendly service, and a passion for
              great food.
            </p>
            <SocialLinks size="lg" className="mb-8 sm:mb-0" />
            <div className="sm:hidden space-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">Contact us via</p>
                <div className="flex items-center gap-2 text-(--footer-pink) mb-1">
                  <PhoneIcon sx={{ fontSize: 16 }} />
                  <span className="text-sm">Phone call</span>
                </div>
                <p className="text-white">{CONTACT_INFO.phone}</p>
                <div className="flex items-center gap-2 text-(--footer-pink) mt-3 mb-1">
                  <EmailIcon sx={{ fontSize: 16 }} />
                  <span className="text-sm">Email</span>
                </div>
                <p className="text-white">{CONTACT_INFO.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  Or come visit us at
                </p>
                <div className="flex items-center gap-2 text-(--footer-pink) mb-1">
                  <LocationOnIcon sx={{ fontSize: 16 }} />
                  <span className="text-sm">Our location</span>
                </div>
                <p className="text-white">{CONTACT_INFO.address}</p>
              </div>
              <div className="mt-6">
                <p className="text-sm text-(--footer-muted) mb-1">
                  Available every
                </p>
                <p className="text-3xl font-medium text-white mb-1 font-open-sans">
                  {BUSINESS_HOURS.days}
                </p>
                <p className="text-gray-400">{BUSINESS_HOURS.hours}</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm text-left text-(--footer-muted) mb-1">
              Available every
            </p>
            <p className="text-4xl font-medium text-white mb-1 font-open-sans">
              {BUSINESS_HOURS.days}
            </p>
            <p className="text-gray-400">{BUSINESS_HOURS.hours}</p>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <nav
              className="flex flex-wrap justify-center gap-6 text-sm"
              aria-label="Footer navigation"
            >
              {FOOTER_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/jobs"
                className="text-(--hiring-pink) hover:text-(--hiring-pink-hover) transition-colors"
              >
                We&apos;re Hiring
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-(--footer-copyright-bg) mt-12 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500 mb-4">
            <p className="text-(--footer-muted)">All rights reserved</p>
            <p className="text-(--footer-muted)">
              &copy; Copyright by Moshzion Pizza
            </p>
          </div>
          <div className="text-center border-t border-white/10 pt-4">
            <p className="text-xs text-gray-500">
              Images by talented photographers on{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white underline transition-colors"
              >
                Unsplash
              </a>
              {" · "}
              <Link
                href="/credits"
                className="text-gray-400 hover:text-white underline transition-colors"
              >
                View all credits
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
