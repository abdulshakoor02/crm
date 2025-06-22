import { create } from 'zustand';

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
  // Add other lead-specific properties
  createdAt: Date;
  updatedAt: Date;
}

interface LeadState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  filters: Record<string, any>; // Example: { status: 'new', assignedTo: 'userId' }

  addLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Lead | null>;
  updateLead: (leadId: string, updates: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Lead | null>;
  deleteLead: (leadId: string) => Promise<boolean>;
  fetchLeads: (params?: Record<string, any>) => Promise<void>;
  setFilters: (newFilters: Record<string, any>) => void;
  clearError: () => void;
}

// Helper function to simulate API calls with delay and potential errors
const simulateApiCall = <T>(data: T, delay = 500, succeed = true): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (succeed) {
        resolve(data);
      } else {
        reject(new Error("Simulated API Error"));
      }
    }, delay);
  });
};

const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  isLoading: false,
  error: null,
  filters: {},

  clearError: () => set({ error: null }),

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    // Optionally, trigger fetchLeads here if filters change
    // get().fetchLeads();
  })),

  fetchLeads: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = { ...get().filters, ...params };
      console.log("Fetching leads with params:", queryParams);
      // Simulate API call
      const mockLeads: Lead[] = [
        { id: 'lead1', companyName: 'Acme Corp', contactPerson: 'John Doe', email: 'john.doe@acme.com', status: 'new', createdAt: new Date(), updatedAt: new Date() },
        { id: 'lead2', companyName: 'Beta Inc', contactPerson: 'Jane Smith', email: 'jane.smith@beta.com', status: 'contacted', createdAt: new Date(), updatedAt: new Date() },
      ];
      // Filter mockLeads based on queryParams if necessary for simulation
      await simulateApiCall(mockLeads, 700);
      set({ leads: mockLeads, isLoading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to fetch leads:", err);
    }
  },

  addLead: async (leadData) => {
    set({ isLoading: true, error: null });
    try {
      const newLead: Lead = {
        ...leadData,
        id: `lead${Date.now()}`, // Simulate ID generation
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await simulateApiCall(newLead);
      set((state) => ({
        leads: [...state.leads, newLead],
        isLoading: false,
      }));
      return newLead;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to add lead:", err);
      return null;
    }
  },

  updateLead: async (leadId, updates) => {
    set({ isLoading: true, error: null });
    try {
      let updatedLead: Lead | null = null;
      set((state) => {
        const newLeads = state.leads.map(lead => {
          if (lead.id === leadId) {
            updatedLead = { ...lead, ...updates, updatedAt: new Date() };
            return updatedLead;
          }
          return lead;
        });
        return { leads: newLeads };
      });
      if (!updatedLead) throw new Error("Lead not found");

      await simulateApiCall(updatedLead); // Simulate API call for update
      set({ isLoading: false });
      return updatedLead;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to update lead:", err);
      return null;
    }
  },

  deleteLead: async (leadId) => {
    set({ isLoading: true, error: null });
    try {
      await simulateApiCall({}, 300); // Simulate API call for deletion
      set((state) => ({
        leads: state.leads.filter(lead => lead.id !== leadId),
        isLoading: false,
      }));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to delete lead:", err);
      return false;
    }
  },
}));

export default useLeadStore;
