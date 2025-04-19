import type { NextApiRequest, NextApiResponse } from 'next';

const JD_CLIENT_ID = process.env.JD_CLIENT_ID!;
const JD_CLIENT_SECRET = process.env.JD_CLIENT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { code, input, language } = req.body;

  try {
    const response = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: JD_CLIENT_ID,
        clientSecret: JD_CLIENT_SECRET,
        script: code,
        stdin: input,
        language,
        versionIndex: '0',
      }),
    });

    const data = await response.json();
    res.status(200).json({ output: data.output });
  } catch (err: any) {
    res.status(500).json({ error: 'Execution failed', detail: err.message });
  }
}
