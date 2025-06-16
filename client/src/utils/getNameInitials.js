export function getNameInitials(name, limit = 2) {
  if (!name) return '';

  const words = name.trim().split(/\s+/);
  let initials = words.slice(0, limit).map(word => word[0].toUpperCase());

  return initials.join('');
}