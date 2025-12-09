const Footer = () => {
    return (
        <footer className="footer rounded-2xl sm:footer-horizontal footer-center bg-base-100 shadow-md text-base-content p-4">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by McHackers</p>
            </aside>
        </footer>
    );
};

export default Footer;