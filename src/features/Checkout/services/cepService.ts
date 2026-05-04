import { viaCepApi } from '@/api/viaCep';

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const cepService = {
  fetchAddress: async (zipCode: string): Promise<ViaCepAddress> => {
    const cleanCep = zipCode.replace(/\D/g, '');
    const { data } = await viaCepApi.get<ViaCepAddress>(`/${cleanCep}/json/`);

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return data;
  }
};
