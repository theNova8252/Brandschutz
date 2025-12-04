import Chapter from '../models/chapters.js';
import ChapterSlide from '../models/ChapterSlide.js';
import { chaptersSeedData } from './chaptersData.js';

export async function seedChapters() {
  const existing = await Chapter.count();
  if (existing > 0) {
    console.log('📘 Chapters already exist, skipping seeding.');
    return;
  }

  console.log('📘 Seeding chapters & slides …');

  for (const chapterData of chaptersSeedData) {
    const { slides, ...chapterFields } = chapterData;

    const chapter = await Chapter.create(chapterFields);

    if (slides && slides.length > 0) {
      const slidesWithFk = slides.map((slide, index) => ({
        ...slide,
        chapterId: chapter.id,
        order: slide.order ?? index + 1,
      }));

      await ChapterSlide.bulkCreate(slidesWithFk);
    }
  }

  console.log('✅ Chapters & slides seeded successfully.');
}
