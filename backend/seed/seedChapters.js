// seed/seedChapters.js
import Chapter from '../models/chapters.js';
import ChapterSlide from '../models/ChapterSlide.js';
import UserProgress from '../models/UserProgress.js';
import { chaptersSeedData } from './chaptersData.js';

export const seedChapters = async () => {
  console.log('🌱 Seeding chapters…');

  // Alles löschen – KEIN TRUNCATE, nur normales DELETE
  await ChapterSlide.destroy({ where: {} });
  await UserProgress.destroy({ where: {} });
  await Chapter.destroy({ where: {} });

  // Neu aufbauen
  for (const chap of chaptersSeedData) {
    const chapter = await Chapter.create({
      slug: chap.slug,
      order: chap.order,
      title: chap.title,
      heroImage: chap.heroImage,
      introVideo: chap.introVideo,
    });

    for (const slide of chap.slides) {
      await ChapterSlide.create({
        chapterId: chapter.id,
        type: slide.type,
        order: slide.order,
        title: slide.title,
        body: slide.body,
        imageUrl: slide.imageUrl || null,
        videoUrl: slide.videoUrl || null,
      });
    }
  }

  console.log('✅ Chapters seeded');
};
