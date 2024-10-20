export interface Country {
    id: string;
    name: string;
    code: string;
    currency: string;
    currency_name: string;
  }
  
  export interface CountryState {
    count: number;
    rows: Country[];
    loading: boolean;
    error: string | null;
  }
  