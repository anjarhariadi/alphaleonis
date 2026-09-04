import Link from "next/link";
import Image from "next/image";
import { Download, MoveRight, Send } from "lucide-react";
import {
  getCurrentTime,
  getExperiencesCached,
  getPortfoliosCached,
  getProfileCached,
} from "@/features/landing/actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import SectionContainer from "@/components/section-container";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { myAccount, myTool } from "@/features/landing/contents";
import { ExperienceTimer } from "@/features/landing/components/ExperienceTimer";

export default async function Home() {
  const [me, portfolios, experiences, serverNow] = await Promise.all([
    getProfileCached(),
    getPortfoliosCached(),
    getExperiencesCached(),
    getCurrentTime(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <SectionContainer id="home" className="relative">
        <div className="relative z-10 flex h-full flex-col-reverse items-center gap-8 py-8 md:flex-row">
          <div className="flex flex-[4] flex-col gap-4">
            <h1 className="text-display font-bold md:leading-none">
              <span className="text-primary">Welcome!</span> 🙌, to my home of
              crafting!
            </h1>
            <span className="text-muted-foreground mb-5 font-serif text-xl">
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
              {me?.resume && (
                <Link
                  href={me.resume}
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
              )}
            </div>
          </div>

          <div className="flex-[2] p-3">
            <div className="bg-primary absolute mx-10 my-16 animate-bounce rounded-t-full rounded-l-full p-3">
              <span className="text-3xl">{me?.mood}</span>
            </div>
            <Image
              alt="my image"
              src={me?.image ?? "/me.jpg"}
              width={800}
              height={800}
              priority
              fetchPriority="high"
              sizes="(max-width:768px) 100vw, 50vw"
              className="aspect-square border-2 object-cover p-3"
            />
          </div>
        </div>
        <div className="hero-bg" aria-hidden="true" />
      </SectionContainer>

      {/* My Tools */}
      <SectionContainer id="tools">
        <div className="bg-sidebar flex items-center border px-4 py-3">
          <h2 className="mr-5 text-lg font-bold">Tools</h2>
          <div className="flex flex-wrap items-center gap-3">
            {myTool.map((tool) => (
              <Tooltip key={tool.alt}>
                <TooltipTrigger>
                  <Image
                    width={40}
                    height={40}
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
        <h2 className="text-3xl font-bold">{me?.descTitle}</h2>
        <p className="text-muted-foreground mb-3 text-lg whitespace-pre-wrap">
          {me?.descContent}
        </p>
        <div className="mt-4 flex gap-6">
          {myAccount.map((account) => (
            <Link
              href={account.href}
              aria-label={account.ariaLabel}
              key={account.href}
              className="text-muted-foreground/50 hover:text-primary transition-colors"
            >
              <account.icon />
            </Link>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer>
        <Separator />
      </SectionContainer>

      {/* Experience */}
      <SectionContainer id="experience" className="flex items-center gap-6">
        <h2 className="text-primary text-lg font-bold">Experience</h2>
        <ExperienceTimer serverNow={serverNow} />
        <div>
          {experiences.map((experience, index) => {
            const lastItem = index === experiences.length - 1;
            return (
              <div
                key={`exp-${experience.id}`}
                className="mt-6 flex flex-col md:mt-0 md:flex-row md:gap-6"
              >
                <span className="text-muted-foreground w-42 font-mono text-sm font-light">
                  {experience.period}
                </span>
                <div className="flex flex-1 gap-6">
                  <div className="relative">
                    <div className="bg-background border-primary aspect-square w-3 -translate-x-1 translate-y-1 rounded-full border-2" />
                    <div className="h-full border-l"></div>
                  </div>
                  <div className={cn("space-y-2", lastItem ? "" : "pb-16")}>
                    <h3 className="text-lg font-bold">{experience.company}</h3>
                    <h4 className="text-primary mb-3 font-mono text-sm uppercase">
                      {experience.title}
                    </h4>
                    <p className="whitespace-pre-wrap">
                      {experience.description}
                    </p>
                  </div>
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
        <h2 className="text-3xl font-bold">
          Enjoying every process and here’s the results
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(384px,1fr))] gap-6 py-2">
          {portfolios.map((portfolio) => (
            <Link
              key={portfolio.id}
              href={`/portfolio/${portfolio.id}`}
              prefetch
            >
              <Card className="hover:border-primary h-full cursor-pointer transition-all hover:shadow-2xl">
                <CardHeader className="space-y-2">
                  <Image
                    src={portfolio.image ?? "/no-image.webp"}
                    alt={portfolio.title}
                    width={500}
                    height={500}
                    sizes="(max-width:768px) 100vw, 384px"
                    className="aspect-video w-full rounded-md object-cover"
                  />
                  <h3 className="text-xl leading-none font-semibold">
                    {portfolio.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tag.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-serif text-base md:text-lg">
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
        <h2 className="text-primary text-2xl font-bold">
          Ready to get started?
        </h2>
        <p>Feel free to contact me, let’s discuss about your vision!</p>
        <Link
          href={`mailto:${me?.email}`}
          className={cn(buttonVariants({ size: "lg" }), "ml-auto")}
        >
          Send Me an Email <Send />
        </Link>
      </SectionContainer>
    </>
  );
}
