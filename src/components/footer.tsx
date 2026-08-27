import { menuItems, myAccount } from "@/features/landing/contents";
import SectionContainer from "./section-container";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t">
      <SectionContainer className="flex items-center justify-between gap-8 md:flex-row">
        <div className="flex gap-3">
          <span className="text-primary text-xl font-bold">A.H</span>
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Anjar Hariadi</h3>
            <p>Home of crafting</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 md:items-start">
          <span className="text-muted-foreground font-mono">Explore</span>
          <ul className="flex flex-wrap gap-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`${item.route}`}
                  className="hover:text-primary font-serif hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center gap-3 md:items-start">
          <span className="text-muted-foreground font-mono">Connect</span>
          <div className="flex flex-wrap gap-3">
            {myAccount.map((account, index) => (
              <Link
                href={account.href}
                aria-label={account.ariaLabel}
                key={`acc-${index}`}
              >
                <div className="text-muted-foreground/50 hover:text-primary w-fit border p-2 transition-colors">
                  <account.icon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionContainer>
      <div className="text-muted-foreground py-8 text-center font-mono">
        &copy; {new Date().getFullYear()} •{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/anjarhariadi/alphaleonis"
          className="underline"
        >
          Source
        </a>
      </div>
    </footer>
  );
};

export default Footer;
