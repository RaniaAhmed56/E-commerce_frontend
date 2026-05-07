/**
 * تنسيق Price بالجنيه الEgyptي
 * الأسعار في database بالجنيه الEgyptي EGPباشرةً — لا يوجد transfer
 */

export function formatPrice(price: number | string): string {
  const val = Math.round(parseFloat(String(price)));
  return val.toLocaleString("ar-EG") + " EGP";
}

export function formatPriceRaw(price: number | string): string {
  return Math.round(parseFloat(String(price))).toLocaleString("ar-EG");
}

/** للتوافق EGPع الكود القديم — لا يحول، يرجع نفس الNumber */
export function toEGP(price: number | string): number {
  return Math.round(parseFloat(String(price)));
}
