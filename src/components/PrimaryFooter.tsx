import React from "react";
import { siteName, SocialLink, socialLinks } from "globalData";
import Link from "./Link";

const Social = ({ name, icon, url }: SocialLink) => (
  <Link
    key={name}
    className="px-5 py-3 text-sm font-semibold hover:text-primary-50
    focus:text-primary-50 transition-colors duration-300"
    to={url}
  >
    {icon({ className: "h-6 w-6" })}
  </Link>
);

export default function PrimaryFooter() {
  const socials = [] as unknown as SocialLink[];

  for (const social in socialLinks) {
    if (Object.prototype.hasOwnProperty.call(socialLinks, social)) {
      const element = socialLinks[social];
      socials.push(element);
    }
  }
  return (
    <footer className="bg-primary-500 text-white">
      <div>
        <div className="container mx-auto py-4 px-5 flex flex-col md:flex-row justify-between items-center">
          <Link
            to="/"
            className="text-lg font-semibold tracking-widest uppercase
                rounded-lg focus:outline-none focus:shadow-outline"
          >
            {siteName}
          </Link>
          <div className="text-center flex justify-center items-center">
            <Link
              to="https://aspstake.io/audit-report.pdf"
              internal
              className="underline hover:text-primary-50 transition-colors duration-300"
            >
              View Our Audit
            </Link>
            {socials.map(({ ...props }, i) => (
              <Social key={i} {...props} />
            ))}
          </div>
          <div className="text-sm text-center">
            Copyright &copy; {new Date().getFullYear()} ASP.
          </div>
        </div>
      </div>
    </footer>
  );
}
