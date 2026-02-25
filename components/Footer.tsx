// Footer.tsx = the bottom section of the website.
// provides brand name and copyright info.
const Footer = () => {
    return (
        <footer className="flex flex-col text-primary-pink mt-5 border-t border-primary-pink">
            <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
                <div className="flex flex-col justify-start items-start gap-6">
                    <p className="text-base text-primary-pink font-sans">
                        Pioneer 2026 <br />
                        All rights reserved &copy;
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;