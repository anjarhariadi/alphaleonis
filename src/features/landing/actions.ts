"use server";

import { db } from "@/server/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

export const getProfileCached = unstable_cache(getProfile, ["profile"], {
  // revalidate: 3600,
  tags: ["profile"],
});

export const getPortfoliosCached = unstable_cache(
  getPortfolios,
  ["portfolios"],
  {
    // revalidate: 60,
    tags: ["portfolios"],
  },
);

export const getExperiencesCached = unstable_cache(
  getExperiences,
  ["experiences"],
  {
    // revalidate: 60,
    tags: ["experiences"],
  },
);

export const getCertificatesCached = unstable_cache(
  getCertificates,
  ["certificates"],
  {
    // revalidate: 60,
    tags: ["certificates"],
  },
);

export const getPortfolioByIdCached = cache(getPortfolioById);

export const revalidateLandingPage = async () => {
  revalidateTag("profile", "max");
  revalidateTag("portfolios", "max");
  revalidateTag("experiences", "max");
  revalidateTag("certificates", "max");
  revalidatePath("/");
};

export async function getProfile() {
  return db.profile.findFirst();
}

export async function getPortfolios() {
  return db.portfolio.findMany({
    where: {
      visible: true,
    },
  });
}

export async function getExperiences() {
  return db.experience.findMany({
    orderBy: {
      index: "asc",
    },
  });
}

export async function getCertificates() {
  return db.certificate.findMany();
}

export async function getPortfolioById(id: number) {
  return db.portfolio.findUnique({
    where: { id },
  });
}
