export function getBearerToken(header: string | undefined) {
  if (header == null) return null;

  const parts = header.split(" ");
  if (parts.length !== 2) return null;

  const [scheme, token] = parts;
  if (scheme !== "Bearer") return null;

  return token;
}

export function isAdmin(header: string | undefined) {
  const token = getBearerToken(header);
  if (token == null) return false;
  if (token !== process.env.ADMIN_KEY) return false;
  return true;
}
