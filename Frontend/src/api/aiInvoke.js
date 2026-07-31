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
      const errText = await response.text().catch(() => '');
      throw new Error(`AI Request failed (${response.status}): ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Strip the "data: " SSE prefix
      const cleanedLine = trimmed.startsWith('data:')
        ? trimmed.slice(5).trim()
        : trimmed;

      if (cleanedLine === '[DONE]') {
        onDone?.();
        return true; // signal done
      }

      try {
        const parsed = JSON.parse(cleanedLine);

        if (parsed.error) {
          onError?.(parsed.error);
          return;
        }

        // Backend sends { message: "..." } for text chunks
        if (typeof parsed.message === 'string' && parsed.message) {
          onChunk(parsed.message);
        } else if (typeof parsed === 'string') {
          onChunk(parsed);
        }
      } catch {
        // Not JSON — forward as raw text if non-empty
        if (cleanedLine) onChunk(cleanedLine);
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const isDone = processLine(line);
        if (isDone) return;
      }
    }

    // Flush any remaining buffer
    if (buffer.trim()) {
      processLine(buffer.trim());
    }

    onDone?.();
  } catch (err) {
    console.error('[AI] Stream Error:', err);
    onError?.(err.message || 'Stream connection error');
  }
}