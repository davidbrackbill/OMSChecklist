
async function getHub() {
  const url = 'https://www.omshub.org';
  const selector = '#__NEXT_DATA__';

  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);

  const dom = new DOMParser().parseFromString(await res.text(), 'text/html');
  const data = JSON.parse(
    dom.querySelector(selector)
      ?.textContent)
    ?.props
    ?.pageProps
    ?.allCourseData;

  if (!data)
    throw new Error(`Failed to parse data...allCourseData from ${selector}`);

  return data;
}

async function getCentral() {
  const url = "https://www.omscentral.com";
  const selector = 'body > script:last-of-type';
  const regex_idx = 1;
  const data_idx = 3;

  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);

  const dom = new DOMParser().parseFromString(await res.text(), 'text/html');
  const sanitized = dom.querySelector(selector)
    ?.textContent
    .match(/__next_f\.push\(\[(.*?)\]\);?/s)[regex_idx]
    .replace(/^1,\s*"5:\s*/, '')
    .replace(/"$/, '')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .slice(0, -2)
  const data = JSON.parse(sanitized)[data_idx]?.courses

  if (!Array.isArray(data))
    throw new Error(`Failed to parse data.courses from ${selector}`);

  return data;
}

function parseHub(hubData) {
  return Object.entries(hubData).map(([id, data]) => ({
    id,
    name: data.name,
    aliases: data.aliases || [],
    description: null,
    codes: [id],
    numReviews: data.numReviews,
    rating: data.avgOverall,
    difficulty: data.avgDifficulty,
    workload: data.avgWorkload
  }));
}

function parseCentral(centralData) {
  return centralData.map(course => ({
    id: course.codes[0],
    name: course.name,
    aliases: course.tags || [],
    description: course.description,
    codes: course.codes || [],
    numReviews: course.reviewCount,
    rating: course.rating,
    difficulty: course.difficulty,
    workload: course.workload,
  }));
}

function mergeCourses(hubData, centralData) {

  const courses = new Map();
  hubData.forEach(course => {
    courses.set(course.id, course);
  });

  const toZero = (value) => (isNaN(value) ? 0 : (value ?? 0))

  const clamp = (value) => Math.max(0, Math.min(5, value));

  const weighted = (A, B, WA, WB) => {
    const a = toZero(A);
    const b = toZero(B);
    const wa = toZero(WA);
    const wb = toZero(WB);
    const total = wa + wb;
    if (total === 0) return 0;
    return (a * wa + b * wb) / total;
  };
  

  centralData.forEach(centralCourse => {
    const existing = courses.get(centralCourse.id);
    if (!existing) {
      courses.set(centralCourse.id, centralCourse);
      return;
    }

    const merged = {
      id: centralCourse.id,
      name: centralCourse.name || existing.name,
      aliases: Array.from(new Set([...existing.aliases, ...centralCourse.aliases])),
      description: centralCourse.description,
      codes: Array.from(new Set([...existing.codes, ...centralCourse.codes])),
      numReviews: (existing.numReviews || 0) + (centralCourse.numReviews || 0),
      rating: clamp(weighted(existing.rating, centralCourse.rating, existing.numReviews, centralCourse.numReviews)),
      difficulty: clamp(weighted(existing.difficulty, centralCourse.difficulty, existing.numReviews, centralCourse.numReviews)),
      workload: weighted(existing.workload, centralCourse.workload, existing.numReviews, centralCourse.numReviews)
    };

    courses.set(centralCourse.id, merged);
  });

  return Object.fromEntries(courses);
}
