import { Github, Linkedin, Mail, Youtube, type LucideIcon } from "lucide-react";
import type { Key } from "react";

interface Tools {
  alt: string;
  image: string;
  ariaLabel?: string;
}

interface Account {
  icon: LucideIcon;
  href: string;
  ariaLabel?: string;
}

interface MenuItem {
  id: Key;
  title: String;
  route: String;
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "Home",
    route: "/#home",
  },
  {
    id: 2,
    title: "About Me",
    route: "/#profile",
  },
  {
    id: 3,
    title: "Services",
    route: "/#tools",
  },
  {
    id: 4,
    title: "Portfolio",
    route: "/#portfolio",
  },
  {
    id: 5,
    title: "Post",
    route: "/blog",
  },
];

export const myAccount: Account[] = [
  {
    icon: Github,
    href: "https://github.com/anjarhariadi",
    ariaLabel: "Anjar's Github",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/anjar2hariadi/",
    ariaLabel: "Anjar's Linkedin",
  },
  {
    icon: Mail,
    href: `mailto:creative.anjar@gmail.com`,
    ariaLabel: "Anjar's Email",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@an.alphaleonis",
    ariaLabel: "Anjar's Youtube",
  },
];

export const myTool: Tools[] = [
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
