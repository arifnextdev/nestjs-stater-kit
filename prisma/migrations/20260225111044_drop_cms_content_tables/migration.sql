/*
  Warnings:

  - You are about to drop the `banners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hero_sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "banners" DROP CONSTRAINT "banners_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "hero_sections" DROP CONSTRAINT "hero_sections_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_updatedBy_fkey";

-- DropTable
DROP TABLE "banners";

-- DropTable
DROP TABLE "hero_sections";

-- DropTable
DROP TABLE "testimonials";
