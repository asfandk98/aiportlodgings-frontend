import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant pt-xl pb-20 md:pb-xl px-container-margin">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
          <div>
            <h4 className="font-label-bold text-label-bold text-primary-container mb-4">About</h4>
            <ul className="space-y-2 text-on-surface-variant text-body-md">
              <li><Link className="hover:text-secondary" href="/about-us">Our Story</Link></li>
              <li><Link className="hover:text-secondary" href="/hotels">Partner Hotels</Link></li>
              <li><a className="hover:text-secondary" href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-bold text-label-bold text-primary-container mb-4">Quick Links</h4>
            <ul className="space-y-2 text-on-surface-variant text-body-md">
              <li><Link className="hover:text-secondary" href="/hotels">Search Hotels</Link></li>
              <li><Link className="hover:text-secondary" href="/hotels?stay_type=day_use">Day Use Rooms</Link></li>
              <li><Link className="hover:text-secondary" href="/blog">Terminal Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-bold text-label-bold text-primary-container mb-4">Support</h4>
            <ul className="space-y-2 text-on-surface-variant text-body-md">
              <li><Link className="hover:text-secondary" href="/contact">Help Center</Link></li>
              <li><Link className="hover:text-secondary" href="/terms-of-service">Cancellation Policy</Link></li>
              <li><Link className="hover:text-secondary" href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-bold text-label-bold text-primary-container mb-4">Connect</h4>
            <ul className="space-y-2 text-on-surface-variant text-body-md">
              <li><a className="hover:text-secondary" href="#">Facebook</a></li>
              <li><a className="hover:text-secondary" href="#">Instagram</a></li>
              <li><a className="hover:text-secondary" href="#">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant pt-lg flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-primary-container">
            <span className="material-symbols-outlined">call</span>
            <span className="font-headline-md text-headline-md font-bold">24/7 Support: +971 50 247 7593</span>
          </div>
          <p className="text-label-sm text-label-sm text-outline">© {new Date().getFullYear()} AirportHotelDubai.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}