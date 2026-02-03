import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function Footer() {
  return (
    <footer className="bg-[#332625] text-white pt-12 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Brand Section */}
          <div className="lg:max-w-sm">
            <h3 className="font-display text-5xl text-[#FFA9A9] mb-4">
              Moshzion
            </h3>
            <p className="text-gray-400 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mollis
              blandit sit varius in vitae viverra.
            </p>

            {/* Social Media Links */}
            <div
              className="flex gap-3 mb-8 sm:mb-0"
              aria-label="Social media links"
            >
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon sx={{ fontSize: 28 }} />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon sx={{ fontSize: 28 }} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon sx={{ fontSize: 28 }} />
              </a>
            </div>

            {/* Mobile Contact Info */}
            <div className="sm:hidden space-y-6">
              {/* Contact us via */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Contact us via</p>
                <div className="flex items-center gap-2 text-[#FFA9A9] mb-1">
                  <PhoneIcon sx={{ fontSize: 16 }} />
                  <span className="text-sm">Phone call</span>
                </div>
                <p className="text-white">(023) 456 7890</p>
                <div className="flex items-center gap-2 text-[#FFA9A9] mt-3 mb-1">
                  <EmailIcon sx={{ fontSize: 16 }} />
                  <span className="text-sm">Email</span>
                </div>
                <p className="text-white">contact@email.com</p>
              </div>

              {/* Or come visit us at */}
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  Or come visit us at
                </p>
                <div className="flex items-center gap-2 text-[#FFA9A9] mb-1">
                  <LocationOnIcon sx={{ fontSize: 16 }} />
                  <span className="text-sm">Our location</span>
                </div>
                <p className="text-white">Fire Cabin, Mint st. 15</p>
              </div>

              {/* Hours - Mobile */}
              <div className="mt-6">
                <p className="text-sm text-[#BDA8A8] mb-1">Available every</p>
                <p
                  className="text-3xl font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Monday - Saturday
                </p>
                <p className="text-gray-400">8 AM - 6 PM</p>
              </div>
            </div>
          </div>

          {/* Hours - Desktop */}
          <div className="hidden sm:block text-right">
            <p className="text-sm text-left text-[#BDA8A8] mb-1">
              Available every
            </p>
            <p
              className="text-4xl font-medium text-white mb-1"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Monday - Saturday
            </p>
            <p className="text-gray-400">8 AM - 6 PM</p>
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
              <Link
                href="/about"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/jobs"
                className="text-[#E8B4B4] hover:text-[#f0c4c4] transition-colors"
              >
                We&apos;re Hiring
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#24110F] mt-12 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p className="text-[#BDA8A8]">All rights reserved</p>
          <p className="text-[#BDA8A8]">&copy; Copyright by Moshzion Pizza</p>
        </div>
      </div>
    </footer>
  );
}
