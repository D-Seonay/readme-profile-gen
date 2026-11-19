/** Identifiant court, unique en pratique dans une session (horodatage + aléa). */
export const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
