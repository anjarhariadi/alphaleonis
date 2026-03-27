import z from "zod";

export const TAGS = [
  "Artificial Intelligence",
  "Go",
  "Flutter",
  "Android",
  "Data Science",
  "React JS",
  "Supabase",
  "Postgresql",
  "Docker",
  "Leadership",
  "AWS",
  "Linux",
];

export const portfolioSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  brief: z.string().min(1),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
  image: z.string().min(1).optional(),
  tag: z.array(z.string()).min(1, { message: "Pilih minimal satu tag" }),
  visible: z.boolean(),
});

export type PortfolioType = z.infer<typeof portfolioSchema>;
