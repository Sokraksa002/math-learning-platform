import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface SolveMathBody {
  exercise: string;
}

export async function aiMathSolverRoutes(app: FastifyInstance) {
  app.post(
    '/ai/solve-math',
    async (request: FastifyRequest<{ Body: SolveMathBody }>, reply: FastifyReply) => {
      try {
        const { exercise } = request.body;

        if (!exercise) {
          return reply.status(400).send({ error: 'Exercise content is required' });
        }

        // ដោះស្រាយបញ្ហា MOCK_AI មុនពេលហៅប្រើប្រាស់ Library ពិត
        if (process.env.MOCK_AI === 'true') {
          return reply.send({
            solution: `[MOCK AI] លំហាត់ដែលអ្នកបានបញ្ចូលគឺ៖ "${exercise}". \n\nដំណោះស្រាយគំរូ៖ \\[ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\]`,
          });
        }

        // ✅ ដោះស្រាយកំហុសទី១៖ ប្រើប្រាស់ Dynamic Import ដើម្បីទាញយក ESM Module ក្នុង CommonJS
        const { GoogleGenAI } = await import('@google/genai');

        // ✅ ដោះស្រាយកំហុសទី២៖ ផ្តល់ជូន argument `{ apiKey: ... }` ទៅឱ្យ Constructor
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

        // ហៅទៅកាន់ Gemini 1.5 Flash ដើម្បីដោះស្រាយលំហាត់
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an expert math teacher on a math learning platform. 
          Solve the following user's math exercise with clear, step-by-step guidance.
          Always format all mathematical expressions, variables, formulas, and numbers using LaTeX notation.
          Wrap block equations in \\[ \\] and inline math/variables in \\( \\).
          
          User's Exercise: ${exercise}`,
        });

        return reply.send({ solution: response.text });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({ error: error.message || 'AI Math Solver Service Error' });
      }
    },
  );
}
