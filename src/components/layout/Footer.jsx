import logoMark from "../../assets/branding/megamart-mark-primary.svg";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-brand">
      <img src={logoMark} alt="" width="24" height="24" className="footer-brand-mark" />
      <span>MegaMart</span>
    </div>

    <nav className="footer-links" aria-label="Footer">
      <a
        href="https://github.com/Vros15/megamart-react-storefront"
        className="footer-link"
        target="_blank"
        rel="noreferrer"
      >
        Frontend repo
      </a>
      <a
        href="https://github.com/Vros15/ecommerce-backend-api"
        className="footer-link"
        target="_blank"
        rel="noreferrer"
      >
        Backend repo
      </a>
    </nav>

    <p className="footer-copyright">© {new Date().getFullYear()} MegaMart. Portfolio project, not a real store.</p>
  </footer>
);

export default Footer;
