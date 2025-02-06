export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
) {
  const response = await fetch(url, options);
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After") || "1";
    console.log(retryAfter);
    await new Promise((resolve) =>
      setTimeout(resolve, parseInt(retryAfter) * 1000)
    );
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1); // Reintento
    }
  }
  return await response.json();
}
