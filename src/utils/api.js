const CODEFORCES_API = 'https://codeforces.com/api/contest.list';
const LEETCODE_API = 'https://leetcode.com/graphql';
const ATCODER_API = 'https://kenkoooo.com/atcoder/resources/contests.json';

const fetchCodeforcesContests = async () => {
  try {
    const response = await fetch(CODEFORCES_API);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.result.map(contest => ({
        id: contest.id,
        name: contest.name,
        platform: 'Codeforces',
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000).toISOString(),
        durationMinutes: contest.durationSeconds / 60,
        url: `https://codeforces.com/contest/${contest.id}`,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * Math.pow(2, i)); // Exponential backoff
    }
  }
};

const fetchLeetCodeContests = async () => {
  try {
    const query = `
      query {
        contestUpcomingContests {
          title
          titleSlug
          startTime
          duration
        }
        contestPastContests(pageNum: 1, numPerPage: 10) {
          contests {
            title
            titleSlug
            startTime
            duration
          }
        }
      }
    `;

    const data = await fetchWithRetry(
      LEETCODE_API,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
      }
    );

    const upcoming = data.data.contestUpcomingContests || [];
    const past = data.data.contestPastContests?.contests || [];

    const formatContest = (contest, index, platform = 'LeetCode') => ({
      id: `${platform.toLowerCase()}-${contest.titleSlug}-${index}`,
      name: contest.title,
      platform,
      startTime: new Date(contest.startTime * 1000).toISOString(),
      endTime: new Date((contest.startTime + contest.duration) * 1000).toISOString(),
      durationMinutes: contest.duration / 60,
      url: `https://leetcode.com/contest/${contest.titleSlug}`,
    });

    return [
      ...upcoming.map((c, i) => formatContest(c, i)),
      ...past.map((c, i) => formatContest(c, i + upcoming.length)),
    ];
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error);
    return [];
  }
};


const fetchAtCoderContests = async () => {
  try {
    const response = await fetch(ATCODER_API);
    const contests = await response.json();
    
    return contests.map(contest => ({
      id: contest.id,
      name: contest.title,
      platform: 'AtCoder',
      startTime: new Date(contest.start_epoch_second * 1000).toISOString(),
      endTime: new Date((contest.start_epoch_second + contest.duration_second) * 1000).toISOString(),
      durationMinutes: contest.duration_second / 60,
      url: `https://atcoder.jp/contests/${contest.id}`,
    }));
  } catch (error) {
    console.error('Error fetching AtCoder contests:', error);
    return [];
  }
};

let contestCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchAllContests = async () => {
  if (contestCache && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    return contestCache;
  }

  try {
    const [codeforcesContests, leetcodeContests, atcoderContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetCodeContests(),
      fetchAtCoderContests(),
    ]);

    contestCache = [...codeforcesContests, ...leetcodeContests, ...atcoderContests];
    lastFetchTime = Date.now();
    return contestCache;
  } catch (error) {
    console.error('Error fetching contests:', error);
    return contestCache || [];
  }
};

export const getContests = () => {
  return fetchAllContests();
};

export const getUpcomingContests = async () => {
  const now = new Date();
  const contests = await fetchAllContests();
  const upcoming = contests.filter(contest => new Date(contest.startTime) > now);
  return upcoming.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
};

export const getPastContests = async () => {
  const now = new Date();
  const contests = await fetchAllContests();
  const past = contests.filter(contest => new Date(contest.endTime) < now);
  return past.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
};

export const getOngoingContests = async () => {
  const now = new Date();
  const contests = await fetchAllContests();
  const ongoing = contests.filter(
    contest => new Date(contest.startTime) <= now && new Date(contest.endTime) >= now
  );
  return ongoing;
};

export const getPlatformContests = async (platform) => {
  const contests = await fetchAllContests();
  const platformContests = contests.filter(
    contest => contest.platform.toLowerCase() === platform.toLowerCase()
  );
  return platformContests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
};