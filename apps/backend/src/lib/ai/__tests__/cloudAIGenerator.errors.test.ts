import {
  generateFlashcardsWithGemini,
  GeminiAuthError,
  GeminiRateLimitError,
  GeminiParseError,
} from '../cloudAIGenerator';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

jest.mock('axios');
jest.mock('google-auth-library');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('generateFlashcardsWithGemini - error mappings', () => {
  const fakeToken = 'fake-token';

  beforeEach(() => {
    jest.resetAllMocks();
    (GoogleAuth as jest.Mock).mockImplementation(() => ({
      getClient: async () => ({ getAccessToken: async () => ({ token: fakeToken }) }),
    }));
  });

  test('throws GeminiAuthError on 401 status', async () => {
    const err = { response: { status: 401 } };
    mockedAxios.post.mockRejectedValueOnce(err as any);

    await expect(
      generateFlashcardsWithGemini({ blocks: [{ type: 'text', value: 'text' }] } as any)
    ).rejects.toThrow(GeminiAuthError);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  test('throws GeminiAuthError on 403 status', async () => {
    const err = { response: { status: 403 } };
    mockedAxios.post.mockRejectedValueOnce(err as any);

    await expect(
      generateFlashcardsWithGemini({ blocks: [{ type: 'text', value: 'text' }] } as any)
    ).rejects.toThrow(GeminiAuthError);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  test('throws GeminiRateLimitError on 429 status', async () => {
    const err = { response: { status: 429 } };
    mockedAxios.post.mockRejectedValueOnce(err as any);

    await expect(
      generateFlashcardsWithGemini({ blocks: [{ type: 'text', value: 'text' }] } as any)
    ).rejects.toThrow(GeminiRateLimitError);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  test('throws GeminiParseError on malformed JSON response', async () => {
    const successResponse = { data: { candidates: [{ content: { parts: [{ text: 'not a json' }] } }] } };
    mockedAxios.post.mockResolvedValueOnce(successResponse as any);

    await expect(
      generateFlashcardsWithGemini({ blocks: [{ type: 'text', value: 'text' }] } as any)
    ).rejects.toThrow(GeminiParseError);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
