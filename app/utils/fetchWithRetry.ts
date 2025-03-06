export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
) {
  const response = await fetch(url, options);
  console.log(response)

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After") || "1";
    await new Promise((resolve) =>
      setTimeout(resolve, parseInt(retryAfter) * 1000)
    );
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1); // Reintento
    }
  }

  // Verificar si la respuesta es JSON antes de parsear
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Unexpected response: ${text}`);
  }
}