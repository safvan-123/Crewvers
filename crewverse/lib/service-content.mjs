/** Fixed route keys/order with safe overrides from the existing Services singleton. */
export function mergeServices(defaults, overrides) {
  return defaults.map(service => {
    const edited = Array.isArray(overrides) ? overrides.find(item => item?.id === service.id) : null;
    if (!edited) return {...service};
    const text = (value, fallback) => typeof value === 'string' && value.trim() ? value.trim() : fallback;
    const roles = Array.isArray(edited.roles) ? edited.roles.filter(role => typeof role === 'string' && role.trim()).map(role => role.trim()) : [];
    const image = edited.image && typeof edited.image.url === 'string' && /^https:\/\/cdn\.sanity\.io\/images\//.test(edited.image.url)
      ? edited.image : null;
    return {...service,
      title: text(edited.title, service.title),
      short: text(edited.short, service.short),
      description: text(edited.description, service.description),
      roles: roles.length ? roles : service.roles,
      image: image?.url || service.image,
      alt: image ? text(image.alt, service.alt) : service.alt,
    };
  });
}

/** The ten existing homepage cards retain their icons, destinations and order. */
export function mergeServicePreviews(defaults, services, overrides) {
  return defaults.map(card => {
    const group = services.find(service => service.id === card.groupId);
    const edited = Array.isArray(overrides) ? overrides.find(item => item?.key === card.key) : null;
    const text = (value, fallback) => typeof value === 'string' && value.trim() ? value.trim() : fallback;
    const image = edited?.image && typeof edited.image.url === 'string' && /^https:\/\/cdn\.sanity\.io\/images\//.test(edited.image.url)
      ? edited.image : null;
    return {...card,
      title: text(edited?.title, card.title),
      short: text(edited?.short, group?.short || ''),
      image: image || card.image,
      alt: image ? text(image.alt, group?.alt || card.title) : group?.alt || card.title,
    };
  });
}
