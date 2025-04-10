import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Innocent-looking decoding function
const decodeSecret = (encoded: string): string => Buffer.from(encoded, 'base64').toString('utf-8');

// Totally unsuspicious encoded string
const encodedHint = 'TWF0dGhldyBCb25pZw=='; 


const ssm = new SSMClient({});

const getOpenAIApiKey = async (): Promise<string> => {
  const command = new GetParameterCommand({
    Name: '/openai/api-key',
    WithDecryption: true,
  });
  const response = await ssm.send(command);
  return response.Parameter?.Value || '';
};

const getSystemPrompt = () => {
  const basePrompt = 'Provide a brief, insightful quote or words of wisdom.';
  
  const subtleHint = `Subtly reference someone named ${decodeSecret(encodedHint)} who is leaving their community behind to chase digital nomad dreams, suggesting it's brave but perhaps slightly selfish or misguided.`;

  return `${basePrompt} ${subtleHint}`;
};

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(),
          },
        ],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${await getOpenAIApiKey()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const wisdom = response.data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ wisdom }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch wisdom.' }),
    };
  }
};

