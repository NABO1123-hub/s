// api/vote.js

// 환경 변수에서 Google Script URL 을 가져옵니다.
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export default async function handler(req, res) {
  // CORS 헤더 설정 (모든 도메인 허용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS 요청 처리 (브라우저의 Preflight 요청)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;

  try {
    if (method === 'GET') {
      // Google Script 에서 데이터 조회
      if (!GOOGLE_SCRIPT_URL) {
        return res.status(500).json({ error: 'GOOGLE_SCRIPT_URL is not set' });
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      return res.status(200).json(data);
    } 

    else if (method === 'POST') {
      // Google Script 에 데이터 제출
      const body = await req.json();

      if (!GOOGLE_SCRIPT_URL) {
        return res.status(500).json({ error: 'GOOGLE_SCRIPT_URL is not set' });
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: body.name,
          team: body.team,
          scoreHome: body.scoreHome,
          scoreAway: body.scoreAway
        }),
      });

      const data = await response.json();
      return res.status(200).json(data);
    } 

    else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
