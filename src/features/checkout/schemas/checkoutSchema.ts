import { z } from 'zod';
import { validateCPF } from '../utils/formatters';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
const zipCodeRegex = /^\d{5}-\d{3}$/;
const cardExpiryRegex = /^\d{2}\/\d{2}$/;
const cardNumberRegex = /^\d{4} \d{4} \d{4} \d{4}$/;

export const checkoutSchema = z.object({
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
  zipCode: z.string()
    .min(1, 'O CEP é obrigatório')
    .regex(zipCodeRegex, 'CEP incompleto ou inválido'),
  city: z.string()
    .min(2, 'A cidade é obrigatória'),
  address: z.string()
    .min(3, 'O endereço é obrigatório'),
  number: z.string()
    .min(1, 'O número é obrigatório'),
  complement: z.string().optional().or(z.literal('')),
  cardHolder: z.string()
    .min(3, 'O nome do titular é obrigatório')
    .transform(val => val.toUpperCase()),
  cardNumber: z.string()
    .min(1, 'O número do cartão é obrigatório')
    .regex(cardNumberRegex, 'Número do cartão incompleto ou inválido'),
  cardExpiry: z.string()
    .min(1, 'A validade é obrigatória')
    .regex(cardExpiryRegex, 'Formato inválido (MM/AA)')
    .refine((val) => {
      if (!cardExpiryRegex.test(val)) return false;
      const [month, year] = val.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (month < 1 || month > 12) return false;
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      
      return true;
    }, 'Cartão expirado ou data inválida'),
  cardCvv: z.string()
    .min(3, 'O CVV deve ter 3 ou 4 dígitos')
    .max(4, 'O CVV deve ter 3 ou 4 dígitos')
    .regex(/^\d+$/, 'O CVV deve conter apenas números'),
  installments: z.string()
    .min(1, 'Selecione o número de parcelas'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
