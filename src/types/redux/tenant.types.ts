export interface Tenant {
    id: string
    name: string
    phone: string
    email: string
    website: string
    country_id: string
    status: string
  }

  export interface TenantState {
    count: number;
    rows: Tenant[];
    loading: boolean;
    error: string | null;
  }