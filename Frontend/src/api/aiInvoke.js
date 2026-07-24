const BASE_URL = '/api';

/**
 * POST /api/ai/invoke
 * Handles SSE streaming from the AI.
 */
export async function invokeAI({ message, sandboxID, onChunk, onDone, onError }) {
  try {
    const response = await fetch(`${BASE_URL}/ai/invoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sandboxID }),
    });

    if (!response.ok) {
      throw new Error(`AI Request failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onDone?.();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      
      // SSE usually prefixes with "data: "
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        const cleanedLine = line.replace(/^data: /, '').trim();
        if (cleanedLine === '[DONE]') {
          onDone?.();
          return;
        }
        
        try {
          // If the AI sends JSON objects per line
          const parsed = JSON.parse(cleanedLine);
          onChunk(parsed.message || parsed);
        } catch (e) {
          // If it's just raw text
          onChunk(cleanedLine);
        }
      }
    }
  } catch (err) {
    console.error('[AI] Stream Error:', err);
    onError?.(err.message);
  }
}