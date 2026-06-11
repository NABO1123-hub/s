// api/vote.js

export default async function handler(req, res) {
  // CORS 헤더 설정 (text/plain 방식에서도 명시적으로 설정하는 것이 안전합니다)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight 요청 처리 (브라우저가 보내는 경우)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;

  try {
    // 환경 변수에서 GAS URL 을 가져옵니다
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      return res.status(500).json({ error: 'GOOGLE_SCRIPT_URL is not set in environment variables' });
    }

    // GAS 로 요청 전송
    // 중요: Content-Type 을 text/plain 으로 설정하여 CORS Preflight 우회
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: method,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });

    // 응답을 텍스트로 읽음 (GAS 가 text/plain 으로 응답하므로)
    const data = await response.text();

    // GAS 가 JSON 문자열을 반환하므로, 이를 파싱하여 클라이언트에 전달
    try {
      const jsonData = JSON.parse(data);
      return res.status(response.status).json(jsonData);
    } catch (e) {
      // 파싱 실패 시 원본 텍스트 반환
      return res.status(response.status).json({ data: data });
    }

  } catch (error) {
    console.error('Error forwarding request to GAS:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
