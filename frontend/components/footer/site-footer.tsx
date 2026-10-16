import { stegaClean } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { FooterLink } from "./footer-link";
import type { FooterModel } from "./model";

const socialIcons: Record<string, string> = {
  instagram: "instagram", facebook: "facebook-square", youtube: "youtube-square", twitter: "twitter-square",
};

export function SiteFooter({ dataAttribute, model }: {
  dataAttribute?: (path: string) => string | undefined;
  model: FooterModel;
}) {
  return <footer className="site-footer" data-footer-state="ready">
    <div className="container">
      <div className="shell-footer-main">
        <section className="shell-footer-contact" aria-label="Camp contact details">
          <h2><Link href="/" aria-label={`${model.copyrightOwner} home page`}>{model.copyrightOwner}</Link></h2>
          {model.contact.phone && <p>Call Now <FooterLink link={model.contact.phone} /></p>}
          {model.contact.email && <p><FooterLink link={model.contact.email} /></p>}
          {model.contact.addressLines.length > 0 && <address>{model.contact.addressLines.map((line) => <div key={line}>{line}</div>)}</address>}
          {model.intro && <p data-sanity={dataAttribute?.("intro")}>{model.intro}</p>}
        </section>
        <div className="shell-footer-social">
          <nav aria-label="Social links">{model.socialLinks.map((link) => {
            const icon = socialIcons[stegaClean(link.label).toLowerCase()];
            return <FooterLink key={link.key} link={link}>{icon ? <><Image src={`/images/shell/social/${icon}.svg`} alt="" width={34} height={34} /><span className="sr-only">{link.label}</span></> : link.label}</FooterLink>;
          })}</nav>
          {model.acaLogo && <Image src={model.acaLogo.src} alt={model.acaLogo.alt} width={192} height={116} className="shell-aca-logo" />}
        </div>
      </div>
      {model.columns.length > 0 && <div className="shell-footer-columns">{model.columns.map((column) => <section key={column.key}>
        <h2>{column.heading}</h2><ul>{column.links.map((link) => <li key={link.key}><FooterLink link={link} /></li>)}</ul>
      </section>)}</div>}
      <nav className="shell-footer-legal" aria-label="Legal links">{model.legalLinks.map((link) => <FooterLink key={link.key} link={link} />)}</nav>
    </div>
    <p className="shell-copyright">© <span data-sanity={dataAttribute?.("copyrightStartYear")}>{model.copyrightYears}</span>, <span data-sanity={dataAttribute?.("copyrightOwner")}>{model.copyrightOwner}</span> | Website by <a href="https://ovswebsites.com">OVS Websites</a></p>
  </footer>;
}
