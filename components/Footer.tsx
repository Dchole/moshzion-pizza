import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  CONTACT_INFO,
  BUSINESS_HOURS,
  SOCIAL_LINKS,
  FOOTER_LINKS
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-(--footer-bg) text-white pt-12 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Brand Section */}
          <div className="lg:max-w-sm">
            <h3 className="font-display text-5xl text-(--footer-pink) mb-4">
              Moshzion
            </h3>
            <p className="text-gray-400 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mollis
              blandit sit varius in vitae viverra.
            </p>

            {/* Social Media Links */}
            <nav
              className="flex gap-3 mb-8 sm:mb-0"
              aria-label="Social media links"
            >
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon sx={{ fontSize: 28 }} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon sx={{ fontSize: 28 }} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon sx={{ fontSize: 28 }} />
              </a>
            </nav>

            {/* Mobile Contact Info */}
            <div className="sm:hidden space-y-6">
              {/* Contact us via */}
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

              {/* Or come visit us at */}
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

              {/* Hours - Mobile */}
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

          {/* Hours - Desktop */}
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

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Links */}
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

      {/* Copyright */}
      <div className="bg-(--footer-copyright-bg) mt-12 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p className="text-(--footer-muted)">All rights reserved</p>
          <p className="text-(--footer-muted)">
            &copy; Copyright by Moshzion Pizza
          </p>
        </div>
      </div>
    </footer>
  );
}
