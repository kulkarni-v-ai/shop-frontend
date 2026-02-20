function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer>
            {/* Back to Top */}
            <div className="footer-top" onClick={scrollToTop}>
                <span>Back to top</span>
            </div>

            {/* Footer Columns */}
            <div className="footer-main">
                <div className="footer-columns">
                    <div className="footer-column">
                        <h4>Get to Know Us</h4>
                        <a href="#">About HOV Shop</a>
                        <a href="#">Careers</a>
                        <a href="#">Press Releases</a>
                        <a href="#">HOV Science</a>
                    </div>

                    <div className="footer-column">
                        <h4>Connect with Us</h4>
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                    </div>

                    <div className="footer-column">
                        <h4>Make Money with Us</h4>
                        <a href="#">Sell on HOV Shop</a>
                        <a href="#">Become an Affiliate</a>
                        <a href="#">Advertise Your Products</a>
                    </div>

                    <div className="footer-column">
                        <h4>Let Us Help You</h4>
                        <a href="#">Your Account</a>
                        <a href="#">Returns Centre</a>
                        <a href="#">Customer Service</a>
                        <a href="#">Help</a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <span className="footer-logo">
                        <span className="footer-logo-icon">▲ </span>HOV Shop
                    </span>
                    <span className="footer-copyright">
                        © 2026 HOV Shop. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
