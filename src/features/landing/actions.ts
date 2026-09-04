"use server";

import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { cached, requestCached, CACHE_TAGS } from "@/lib/cache";

export const getProfileCached = cached(getProfile, "profile");

export const getPortfoliosCached = cached(getPortfolios, "portfolios");

export const getExperiencesCached = cached(getExperiences, "experiences");

export const getCertificatesCached = cached(getCertificates, "certificates");

export const getPortfolioByIdCached = requestCached(getPortfolioById);

export const getCurrentTime = cached(() => Date.now(), "current-time", {
  revalidate: 60 * 60,
});

export const revalidateLandingPage = async () => {
  CACHE_TAGS.forEach((tag) => revalidateTag(tag, "max"));
  revalidatePath("/");
};

export async function getProfile() {
  return db.profile.findFirst({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPortfolios() {
  return db.portfolio.findMany({
    where: {
      visible: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getExperiences() {
  return db.experience.findMany({
    orderBy: {
      index: "asc",
    },
    take: 50,
  });
}

export async function getCertificates() {
  return db.certificate.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function getPortfolioById(id: number) {
  return db.portfolio.findUnique({
    where: { id },
  });
}
