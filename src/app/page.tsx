import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Github,
  Linkedin,
  type LucideIcon,
  Mail,
  MoveRight,
  Send,
  Youtube,
} from "lucide-react";
import {
  getExperiencesCached,
  getPortfoliosCached,
  getProfileCached,
} from "@/features/landing/actions";
import type { ReactElement } from "react";
import NavBar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionContainer from "@/components/section-container";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Tools {
  alt: string;
  image: string;
  ariaLabel?: string;
}

interface Account {
  icon: ReactElement<LucideIcon>;
  href: string;
  ariaLabel?: string;
}

const myAccount: Account[] = [
  {
    icon: <Github />,
    href: "https://github.com/anjarhariadi",
    ariaLabel: "Anjar's Github",
  },
  {
    icon: <Linkedin />,
    href: "https://www.linkedin.com/in/anjar2hariadi/",
    ariaLabel: "Anjar's Linkedin",
  },
  {
    icon: <Mail />,
    href: `mailto:creative.anjar@gmail.com`,
    ariaLabel: "Anjar's Email",
  },
  {
    icon: <Youtube />,
    href: "https://www.youtube.com/@an.alphaleonis",
    ariaLabel: "Anjar's Youtube",
  },
];

const myTool: Tools[] = [
  {
    alt: "Jira",
    image: "/mytools/jira.png",
    ariaLabel: "Jira as project management tool",
  },

  {
    alt: "Go Lang",
    image: "mytools/go.svg",
    ariaLabel: "Go Lang as coding tool",
  },
  {
    alt: "React JS",
    image: "mytools/react.svg",
    ariaLabel: "React JS as coding tool",
  },
  {
    alt: "Flutter",
    image: "mytools/flutter.svg",
    ariaLabel: "Flutter as coding tool",
  },
  {
    alt: "Vue JS",
    image: "mytools/vue.svg",
    ariaLabel: "Vue JS as coding tool",
  },
  {
    alt: "Figma",
    image: "mytools/figma.svg",
    ariaLabel: "Figma as design tool",
  },
  {
    alt: "Typst",
    image: "/mytools/typst.png",
    ariaLabel: "Typst as document writing tool",
  },
];

export default async function Home() {
  const [me, portfolios, experiences] = await Promise.all([
    getProfileCached(),
    getPortfoliosCached(),
    getExperiencesCached(),
  ]);

  return (
    <main className="scroll-smooth">
      <NavBar />

      {/* Hero Section */}
      <SectionContainer id="home" className="relative">
        <div className="relative z-10 flex h-full flex-col-reverse items-center gap-8 py-8 md:flex-row">
          <div className="flex flex-[4] flex-col gap-4">
            <h1 className="text-display leading-normal font-bold">
              <span className="text-primary">Welcome!</span> 🙌, to my home of
              crafting!
            </h1>
            <span className="mb-5 font-serif text-xl">
              Hello, my name is
              <span className="font-bold"> Anjar Dwi Hariadi</span>.
              {me?.greeting}
            </span>
            <div className="mt-4 flex gap-6">
              <Link
                href={"#contact"}
                className={cn(buttonVariants({ size: "xl" }), "w-fit")}
              >
                Let&apos;s Connect
                <MoveRight />
              </Link>
              <Link
                href={`${me?.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "xl", variant: "link" }),
                  "w-fit",
                )}
              >
                <Download />
                Resume
              </Link>
            </div>
          </div>

          <div className="flex-[2] p-3">
            <div className="bg-primary absolute mx-10 my-16 animate-bounce rounded-t-full rounded-l-full p-3">
              <span className="text-5xl">{me?.mood}</span>
            </div>
            <Image
              alt="my image"
              src={me?.image ?? "/me.jpg"}
              width={800}
              height={800}
              loading="eager"
              className="aspect-square border-2 object-cover p-3"
            />
          </div>
        </div>
        <div className="hero-bg" aria-hidden="true" />
      </SectionContainer>

      {/* My Tools */}
      <SectionContainer>
        <div className="bg-sidebar flex items-center border px-4 py-3">
          <h3 className="mr-5 text-lg font-bold">Tools</h3>
          <div className="flex flex-wrap items-center gap-3">
            {myTool.map((tool) => (
              <Tooltip key={tool.alt}>
                <TooltipTrigger>
                  <Image
                    width={200}
                    height={200}
                    priority
                    alt={tool.alt}
                    src={tool.image}
                    className="aspect-[4/3] w-10 object-contain opacity-100 transition-opacity hover:opacity-60"
                  />
                </TooltipTrigger>
                <TooltipContent>{tool.ariaLabel}</TooltipContent>
              </Tooltip>
            ))}
            etc.
          </div>
        </div>
      </SectionContainer>

      {/* Profile Desc */}
      <SectionContainer id="profile">
        <span className="text-primary font-mono text-lg font-bold">
          About Me
        </span>
        <h1 className="text-4xl font-bold">{me?.descTitle}</h1>
        <p className="text-muted-foreground mb-3 text-lg whitespace-pre-wrap">
          {me?.descContent}
        </p>
        <div className="mt-4 flex gap-6">
          {myAccount.map((account, index) => (
            <Link
              href={account.href}
              aria-label={account.ariaLabel}
              key={index}
              className="text-muted-foreground/50 hover:text-primary transition-colors"
            >
              {account.icon}
            </Link>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer>
        <Separator />
      </SectionContainer>

      {/* Experience */}
      <SectionContainer id="experience" className="flex items-center">
        <h1 className="text-primary text-lg font-bold">Experience</h1>
        <div>
          {experiences.map((experience, index) => {
            const lastItem = index === experiences.length - 1;
            return (
              <div key={`exp-${experience.id}`} className="flex gap-6">
                <span className="text-muted-foreground w-42 font-mono text-sm font-light">
                  {experience.period}
                </span>
                <div className="relative">
                  <div className="bg-background border-primary aspect-square w-3 -translate-x-1 translate-y-1 rounded-full border-2" />
                  <div className="h-full border-l"></div>
                </div>
                <div className={lastItem ? "" : "pb-16"}>
                  <h2 className="text-lg font-bold">{experience.company}</h2>
                  <h4 className="text-muted-foreground font-mono">
                    {experience.title}
                  </h4>
                  <p>{experience.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionContainer>

      <SectionContainer>
        <Separator />
      </SectionContainer>

      {/* My portfolio */}
      <SectionContainer id="portfolio" className="flex items-center">
        <span className="text-primary font-mono text-lg font-bold">
          Portfolio
        </span>
        <h1 className="text-4xl font-bold">
          Enjoying every process and here’s the results
        </h1>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(384px,1fr))] gap-6 py-2">
          {portfolios.map((portfolio) => (
            <Link
              key={portfolio.id}
              href={`/portfolio/${portfolio.id}`}
              prefetch
            >
              <Card className="hover:border-primary h-full cursor-pointer transition-all hover:shadow-2xl">
                <CardHeader>
                  <Image
                    src={portfolio.image ?? "/no-image.webp"}
                    alt={portfolio.title}
                    width={500}
                    height={500}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                  <CardTitle>{portfolio.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tag.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-md font-serif text-lg">
                    {portfolio.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </SectionContainer>

      {/* Contact Me */}
      <SectionContainer
        id="contact"
        className="bg-secondary flex flex-col gap-3 border p-4"
      >
        <span className="font-mono text-lg font-bold">Contact me</span>
        <h1 className="text-primary text-2xl font-bold">
          Ready to get started?
        </h1>
        <p className="">
          Feel free to contact me, let’s discuss about your vision!
        </p>
        <Link
          href={`mailto:${me?.email}`}
          className={cn(buttonVariants({ size: "lg" }), "ml-auto")}
        >
          Send Me an Email <Send />
        </Link>
      </SectionContainer>

      {/* Footer */}
      <footer className="flex justify-center bg-black p-5">
        <p className="text-white">
          Made with ❤ by Anjar Dwi Hariadi using NextJS.
        </p>
      </footer>
    </main>
  );
}
