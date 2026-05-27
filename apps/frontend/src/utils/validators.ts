export function isValidUuid(s: any): boolean {
  if (!s || typeof s !== 'string') return false;
  const simple = /^[0-9a-fA-F]{32}$/;
  const hyphen = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return simple.test(s) || hyphen.test(s);
}
