const SUBJECTS = {
  1: {
    name: "Математика",
    topics: [
      { chapter_id: "1", name: "Алгебра", link: "/topic/math-algebra" },
      { chapter_id: "2", name: "Геометрія", link: "/topic/math-geometry" },
      { chapter_id: "3", name: "Тригонометрія", link: "/topic/math-trig" },
      { chapter_id: "4", name: "Статистика", link: "/topic/math-stats" },
    ],
  },
  2: {
    name: "Українська мова",
    topics: [
      { chapter_id: "1", name: "Фонетика", link: "/topic/ukr-phonetics" },
      { chapter_id: "2", name: "Морфологія", link: "/topic/ukr-morphology" },
      { chapter_id: "3", name: "Синтаксис", link: "/topic/ukr-syntax" },
      { chapter_id: "4", name: "Лексикологія", link: "/topic/ukr-lexicology" },
      { chapter_id: "5", name: "Правопис", link: "/topic/ukr-spelling" },
    ],
  },
  3: {
    name: "Історія",
    topics: [
      {
        chapter_id: "1",
        name: "Стародавній світ",
        link: "/topic/hist-ancient",
      },
      { chapter_id: "2", name: "Середньовіччя", link: "/topic/hist-medieval" },
      { chapter_id: "3", name: "Новий час", link: "/topic/hist-modern" },
      {
        chapter_id: "4",
        name: "Новітня історія",
        link: "/topic/hist-contemporary",
      },
      { chapter_id: "5", name: "Історія України", link: "/topic/hist-ukraine" },
      { chapter_id: "6", name: "Світові війни", link: "/topic/hist-wars" },
    ],
  },
  4: {
    name: "Англійська мова",
    topics: [
      { chapter_id: "1", name: "Grammar", link: "/topic/eng-grammar" },
      { chapter_id: "2", name: "Vocabulary", link: "/topic/eng-vocabulary" },
      { chapter_id: "3", name: "Reading", link: "/topic/eng-reading" },
      { chapter_id: "4", name: "Writing", link: "/topic/eng-writing" },
    ],
  },
};

export default SUBJECTS;
