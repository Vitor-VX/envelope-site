import { writable } from 'svelte/store';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  quantity: number;
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

export interface PersonData {
  title: string;
  photos: string[];
  message: string;
  musicUrl: string;
  musicName: string;
  sender: string;
  showTimer: boolean;
  startDate: string;
  hasMusic: boolean;
}

export interface CustomerData {
  name: string;
  whatsapp: string;
  email: string;
}

export interface CheckoutState {
  currentStep: number;
  selectedProduct: Product | null;
  selectedExtras: Extra[];
  people: PersonData[];
  customerData: CustomerData;
  totalAmount: number;
  paymentStatus: 'pending' | 'generating' | 'waiting' | 'paid' | 'error';
  pixCode: string;
  pixQrCode: string;
}

const initialState: CheckoutState = {
  currentStep: 0,
  selectedProduct: null,
  selectedExtras: [],
  people: [],
  customerData: {
    name: '',
    whatsapp: '',
    email: '',
  },
  totalAmount: 0,
  paymentStatus: 'pending',
  pixCode: '',
  pixQrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example"
};

export const checkoutStore = writable<CheckoutState>(initialState);

export const setCurrentStep = (step: number) => {
  checkoutStore.update(state => ({
    ...state,
    currentStep: step
  }));
};

export const selectProduct = (product: Product) => {
  checkoutStore.update(state => {
    const people = Array.from({ length: product.quantity }, () => ({
      title: '',
      photos: [],
      message: '',
      musicUrl: '',
      sender: '',
      showTimer: false,
      startDate: '',
      hasMusic: false,
      musicName: ''
    }));

    const extrasTotal = state.selectedExtras.reduce((sum, extra) => sum + (extra.selected ? extra.price : 0), 0);
    return {
      ...state,
      selectedProduct: product,
      people,
      totalAmount: product.price + extrasTotal
    };
  });
};

export const updatePersonData = (index: number, personData: Partial<PersonData>) => {
  checkoutStore.update(state => ({
    ...state,
    people: state.people.map((person, i) =>
      i === index ? { ...person, ...personData } : person
    )
  }));
};

export const updateCustomerData = (customerData: CustomerData) => {
  checkoutStore.update(state => ({
    ...state,
    customerData
  }));
};

export const setPaymentStatus = (status: CheckoutState['paymentStatus']) => {
  checkoutStore.update(state => ({
    ...state,
    paymentStatus: status
  }));
};

export const setPixData = (pixCode: string, pixQrCode: string) => {
  checkoutStore.update(state => ({
    ...state,
    pixCode,
    pixQrCode
  }));
};

export const resetCheckout = () => {
  checkoutStore.set(initialState);
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Envelope do Amor — 2 Anos',
    description: '1 envelope digital válido por 2 anos.',
    price: 18.90,
    oldPrice: 29.90,
    quantity: 1
  },
  {
    id: '2',
    name: 'Envelope do Amor — Vitalício',
    description: '1 envelope digital para sempre.',
    price: 48.90,
    oldPrice: 97.90,
    quantity: 1
  }
];

export const extras: Extra[] = [];

checkoutStore.update(state => ({
  ...state,
  selectedExtras: [...extras]
}));