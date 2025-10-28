export const formatDateToDDMMYYYY = (input) => {
  if (!input) return '';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Parse string in DD/MM/YYYY to ISO YYYY-MM-DD, returns '' if invalid
export const parseDDMMYYYYToISO = (value) => {
  if (!value) return '';
  const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return '';
  const dd = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const yyyy = parseInt(m[3], 10);
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return '';
  const iso = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  return iso;
};


