import { z } from 'zod';
import { validateCPF, parseCurrency } from '../utils/formatters';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
const cardExpiryRegex = /^\d{2}\/\d{2}$/;
const cardNumberRegex = /^(?:\d{4} \d{4} \d{4} \d{4}|\d{4} \d{6} \d{5})$/;

const validateCardExpiry = (expiry: string) => {
  if (!cardExpiryRegex.test(expiry)) return false;
  const [month, year] = expiry.split('/').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  if (month < 1 || month > 12) return false;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
};

export const getCheckoutSchema = (total: number) => z.object({
  fullName: z.string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .refine(val => val.trim().split(' ').length > 1, {
      message: 'Por favor, informe seu nome completo (nome e sobrenome)',
    }),
  email: z.string()
    .min(1, 'O e-mail é obrigatório')
    .email('Por favor, informe um e-mail válido'),
  cpf: z.string()
    .min(1, 'O CPF é obrigatório')
    .regex(cpfRegex, 'CPF incompleto ou inválido')
    .refine(val => validateCPF(val), {
      message: 'CPF inválido',
    }),
  phone: z.string()
    .min(1, 'O telefone é obrigatório')
    .regex(phoneRegex, 'Telefone incompleto ou inválido'),

  paymentMethod: z.enum(['cartao', 'dois-cartoes', 'boleto', 'pix']),
  
  // Card 1
  cardHolder: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  installments: z.string().optional(),
  
  // Card 2 (for dois-cartoes)
  cardHolder2: z.string().optional(),
  cardNumber2: z.string().optional(),
  cardExpiry2: z.string().optional(),
  cardCvv2: z.string().optional(),
  installments2: z.string().optional(),
  
  // Amounts for two cards
  amount1: z.string().optional(),
  amount2: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'cartao' || data.paymentMethod === 'dois-cartoes') {
    // Validate Card 1
    if (!data.cardHolder || data.cardHolder.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O nome do titular é obrigatório',
        path: ['cardHolder'],
      });
    }
    if (!data.cardNumber || !cardNumberRegex.test(data.cardNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número do cartão incompleto ou inválido',
        path: ['cardNumber'],
      });
    }
    if (!data.cardExpiry || !validateCardExpiry(data.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cartão expirado ou data inválida (MM/AA)',
        path: ['cardExpiry'],
      });
    }
    if (!data.cardCvv || data.cardCvv.length < 3 || data.cardCvv.length > 4 || !/^\d+$/.test(data.cardCvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV inválido',
        path: ['cardCvv'],
      });
    }
    if (!data.installments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o número de parcelas',
        path: ['installments'],
      });
    }
  }

  if (data.paymentMethod === 'dois-cartoes') {
    // Validate Card 2
    if (!data.cardHolder2 || data.cardHolder2.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O nome do titular é obrigatório',
        path: ['cardHolder2'],
      });
    }
    if (!data.cardNumber2 || !cardNumberRegex.test(data.cardNumber2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número do cartão incompleto ou inválido',
        path: ['cardNumber2'],
      });
    }
    if (!data.cardExpiry2 || !validateCardExpiry(data.cardExpiry2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cartão expirado ou data inválida (MM/AA)',
        path: ['cardExpiry2'],
      });
    }
    if (!data.cardCvv2 || data.cardCvv2.length < 3 || data.cardCvv2.length > 4 || !/^\d+$/.test(data.cardCvv2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV inválido',
        path: ['cardCvv2'],
      });
    }
    if (!data.installments2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o número de parcelas',
        path: ['installments2'],
      });
    }
    
    // Validate amounts
    const val1 = data.amount1 ? parseCurrency(data.amount1) : 0;
    const val2 = data.amount2 ? parseCurrency(data.amount2) : 0;
    const sum = Number((val1 + val2).toFixed(2));
    const expected = Number(total.toFixed(2));

    if (!data.amount1 || val1 <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Valor deve ser maior que zero',
        path: ['amount1'],
      });
    }
    if (!data.amount2 || val2 <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Valor deve ser maior que zero',
        path: ['amount2'],
      });
    }

    if (sum !== expected) {
      const diff = expected - sum;
      const message = diff > 0 
        ? `A soma não atinge o total. Faltam R$ ${diff.toFixed(2).replace('.', ',')}`
        : `A soma excede o total em R$ ${Math.abs(diff).toFixed(2).replace('.', ',')}`;
      
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['amount1'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['amount2'],
      });
    }
  }
});

export type CheckoutFormData = z.infer<ReturnType<typeof getCheckoutSchema>>;
