import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { CONTACT_INFO, BUSINESS_HOURS, SOCIAL_LINKS } from "@/lib/constants";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export const metadata: Metadata = {
  title: "Contact Us | Moshzion - Get in Touch",
  description:
    "Have questions about our pizzas or services? Contact Moshzion for inquiries, feedback, or support. We're here to help!"
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-384">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-[#5D3A1A] mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-[#8B5A2B] max-w-3xl mx-auto leading-relaxed">
              Have a question, feedback, or special request? We&apos;d love to
              hear from you. Fill out the form below or reach out directly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-384">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-[#5D3A1A] mb-6">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#5D3A1A] mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="text-[#8B5A2B] mt-1" />
                    <div>
                      <p className="text-sm text-[#8B5A2B]/70 mb-1">Phone</p>
                      <a
                        href={`tel:${CONTACT_INFO.phone}`}
                        className="text-[#5D3A1A] hover:text-[#8B5A2B] transition-colors"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <EmailIcon className="text-[#8B5A2B] mt-1" />
                    <div>
                      <p className="text-sm text-[#8B5A2B]/70 mb-1">Email</p>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="text-[#5D3A1A] hover:text-[#8B5A2B] transition-colors break-all"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <LocationOnIcon className="text-[#8B5A2B] mt-1" />
                    <div>
                      <p className="text-sm text-[#8B5A2B]/70 mb-1">Address</p>
                      <p className="text-[#5D3A1A]">{CONTACT_INFO.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AccessTimeIcon className="text-[#8B5A2B] mt-1" />
                    <div>
                      <p className="text-sm text-[#8B5A2B]/70 mb-1">
                        Business Hours
                      </p>
                      <p className="text-[#5D3A1A]">{BUSINESS_HOURS.days}</p>
                      <p className="text-[#5D3A1A]">{BUSINESS_HOURS.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#5D3A1A] mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-[#5D3A1A] text-white rounded-full hover:bg-[#8B5A2B] transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-[#5D3A1A] text-white rounded-full hover:bg-[#8B5A2B] transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-[#5D3A1A] text-white rounded-full hover:bg-[#8B5A2B] transition-colors"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon />
                  </a>
                </div>
              </div>

              {/* Map Placeholder Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#5D3A1A] mb-4">
                  Find Us
                </h3>
                <div className="aspect-video bg-[#8B5A2B]/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LocationOnIcon
                      className="text-[#8B5A2B] mb-2"
                      sx={{ fontSize: 48 }}
                    />
                    <p className="text-[#8B5A2B] text-sm">
                      Map integration coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Response Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-384">
          <div className="bg-linear-to-r from-[#5D3A1A] to-[#8B5A2B] rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-display mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              For urgent order inquiries or support, call us directly at{" "}
              <span className="font-semibold">{CONTACT_INFO.phone}</span>
            </p>
            <p className="text-sm opacity-75">
              Average response time: Under 2 hours during business hours
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
