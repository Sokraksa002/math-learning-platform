import { generateFlashcardsWithGemini, GeminiProviderError } from '../cloudAIGenerator';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

jest.mock('axios');
jest.mock('google-auth-library');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('generateFlashcardsWithGemini - retry/backoff', () => {
  const fakeToken = 'fake-token';

  beforeEach(() => {
    jest.resetAllMocks();

    // Mock GoogleAuth client
    (GoogleAuth as jest.Mock).mockImplementation(() => ({
      getClient: async () => ({ getAccessToken: async () => ({ token: fakeToken }) }),
    }));
  });

  test('retries on 5xx and succeeds', async () => {
    // First two calls -> 500 error, third call -> valid JSON response
    const error500 = { response: { status: 500 }, message: 'server error' };

    const validPayload = JSON.stringify([
      { question: 'Question 1', answer: 'Answer 1' },
      { question: 'Question 2', answer: 'Answer 2' },
    ]);

    const successResponse = {
      data: { candidates: [{ content: { parts: [{ text: validPayload }] } }] },
    };

    mockedAxios.post
      .mockRejectedValueOnce(error500)
      .mockRejectedValueOnce(error500)
      .mockResolvedValueOnce(successResponse as any);

    const content = { blocks: [{ type: 'text', value: 'sample lesson text' }] } as any;

    const res = await generateFlashcardsWithGemini(content);

    expect(res).toHaveLength(2);
    expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    expect(res[0].question).toBe('Question 1');
  });

  test('exhausts retries and throws GeminiProviderError', async () => {
    const error500 = { response: { status: 500 }, message: 'server error' };
    // Fail more times than maxRetries (maxRetries=3 -> 4 attempts total)
    mockedAxios.post
      .mockRejectedValueOnce(error500)
      .mockRejectedValueOnce(error500)
      .mockRejectedValueOnce(error500)
      .mockRejectedValueOnce(error500);

    const content = { blocks: [{ type: 'text', value: 'sample lesson text' }] } as any;

    await expect(generateFlashcardsWithGemini(content)).rejects.toThrow(GeminiProviderError);
    // Expect total attempted calls = maxRetries + 1 = 4
    expect(mockedAxios.post).toHaveBeenCalledTimes(4);
  }, 20_000);
});
