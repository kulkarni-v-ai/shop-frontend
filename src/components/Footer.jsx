import { Link } from "react-router-dom";

function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer>
            {/* Back to Top */}
            <div className="footer-top" onClick={scrollToTop}>
                <span>Back to top ↑</span>
            </div>

            {/* Footer Columns */}
            <div className="footer-main">
                <div className="footer-columns">
                    <div className="footer-column">
                        <h4>House of Visuals</h4>
                        <Link to="/">Agency Home</Link>
                        <Link to="/shop">Shop</Link>
                        <a href="/#who-we-are">About Us</a>
                        <a href="/#why-us">Why Us</a>
                    </div>

                    <div className="footer-column">
                        <h4>Services</h4>
                        <a href="/#who-we-are">Creative Insight</a>
                        <a href="/#who-we-are">Digital Attention</a>
                        <a href="/#who-we-are">Performance Marketing</a>
                        <a href="/#who-we-are">Brand Strategy</a>
                    </div>

                    <div className="footer-column">
                        <h4>Connect</h4>
                        <a href="#">Instagram</a>
                        <a href="#">LinkedIn</a>
                        <a href="#">Behance</a>
                        <a href="#">Dribbble</a>
                    </div>

                    <div className="footer-column">
                        <h4>Support</h4>
                        <Link to="/profile">Your Account</Link>
                        <Link to="/cart">Your Cart</Link>
                        <a href="#">Shipping Info</a>
                        <a href="#">Contact Us</a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <span className="footer-logo">
                        ◈ House of Visuals
                    </span>
                    <span className="footer-copyright">
                        © 2026 House of Visuals. The Vision Is Clear.
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
