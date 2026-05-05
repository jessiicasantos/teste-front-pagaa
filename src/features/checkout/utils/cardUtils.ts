export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'unknown';

export const getCardBrand = (number: string): CardBrand => {
  const cleanNumber = number.replace(/\s/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^(40117[89]|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|65003[1-3]|65003[5-9]|65004[0-9]|65005[01]|65040[5-9]|6504[1-3][0-9]|65048[5-9]|65049[0-9]|65050[0-9]|65051[0-9]|65052[0-9]|65053[0-8]|65054[1-9]|6505[5-8][0-9]|65059[0-8]|65070[0-9]|65071[0-8]|65072[0-7]|65090[1-9]|65091[0-9]|650920|65165[2-9]|6516[67][0-9]|65500[0-9]|65501[0-9]|65502[1-9]|65503[0-9]|65504[0-9]|65505[0-8])/.test(cleanNumber)) return 'elo';
  if (/^(606282|3841)/.test(cleanNumber)) return 'hipercard';
  
  return 'unknown';
};
