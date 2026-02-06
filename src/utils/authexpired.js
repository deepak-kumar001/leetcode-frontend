export function isAuthExpired(result) {
  if (!result?.error) return false;

  return (
    result.error.includes("403") ||
    result.error.toLowerCase().includes("forbidden")
  );
}