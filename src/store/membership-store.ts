/**
 * 會費管理狀態管理
 */

import { create } from "zustand";
import type {
  Organization,
  MembershipPlan,
  Application,
  PaymentRecord,
  MembershipStats,
} from "@/types/membership";

// Membership Store State
interface MembershipState {
  // 組織相關
  organizations: Organization[];
  currentOrganization: Organization | null;

  // 申請相關
  applications: Application[];
  currentApplication: Application | null;

  // 會費方案
  plans: MembershipPlan[];
  currentPlan: MembershipPlan | null;

  // 付款記錄
  payments: PaymentRecord[];

  // 統計資料
  stats: MembershipStats | null;

  // Loading states
  loading: {
    organizations: boolean;
    applications: boolean;
    payments: boolean;
    stats: boolean;
  };
}

// Membership Store Actions
interface MembershipActions {
  // 組織操作
  setOrganizations: (organizations: Organization[]) => void;
  setCurrentOrganization: (organization: Organization | null) => void;

  // 申請操作
  setApplications: (applications: Application[]) => void;
  setCurrentApplication: (application: Application | null) => void;
  addApplication: (application: Application) => void;
  updateApplication: (id: number, application: Partial<Application>) => void;

  // 會費方案操作
  setPlans: (plans: MembershipPlan[]) => void;
  setCurrentPlan: (plan: MembershipPlan | null) => void;

  // 付款記錄操作
  setPayments: (payments: PaymentRecord[]) => void;
  addPayment: (payment: PaymentRecord) => void;
  updatePayment: (id: number, payment: Partial<PaymentRecord>) => void;

  // 統計資料操作
  setStats: (stats: MembershipStats | null) => void;

  // Loading 操作
  setLoading: (key: keyof MembershipState["loading"], value: boolean) => void;

  // 重設操作
  reset: () => void;
}

type MembershipStore = MembershipState & MembershipActions;

// 初始狀態
const initialState: MembershipState = {
  organizations: [],
  currentOrganization: null,
  applications: [],
  currentApplication: null,
  plans: [],
  currentPlan: null,
  payments: [],
  stats: null,
  loading: {
    organizations: false,
    applications: false,
    payments: false,
    stats: false,
  },
};

// 建立 Zustand Store
export const useMembershipStore = create<MembershipStore>((set) => ({
  ...initialState,

  // 組織操作
  setOrganizations: (organizations) => set({ organizations }),
  setCurrentOrganization: (currentOrganization) => set({ currentOrganization }),

  // 申請操作
  setApplications: (applications) => set({ applications }),
  setCurrentApplication: (currentApplication) => set({ currentApplication }),
  addApplication: (application) =>
    set((state) => ({
      applications: [...state.applications, application],
    })),
  updateApplication: (id, updatedApplication) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updatedApplication } : app
      ),
    })),

  // 會費方案操作
  setPlans: (plans) => set({ plans }),
  setCurrentPlan: (currentPlan) => set({ currentPlan }),

  // 付款記錄操作
  setPayments: (payments) => set({ payments }),
  addPayment: (payment) =>
    set((state) => ({
      payments: [...state.payments, payment],
    })),
  updatePayment: (id, updatedPayment) =>
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === id ? { ...payment, ...updatedPayment } : payment
      ),
    })),

  // 統計資料操作
  setStats: (stats) => set({ stats }),

  // Loading 操作
  setLoading: (key, value) =>
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: value,
      },
    })),

  // 重設操作
  reset: () => set(initialState),
}));

// Selector 函數，用於從 store 中選取特定資料
export const selectOrganizations = (state: MembershipState) =>
  state.organizations;
export const selectCurrentOrganization = (state: MembershipState) =>
  state.currentOrganization;
export const selectPlans = (state: MembershipState) => state.plans;
export const selectCurrentPlan = (state: MembershipState) => state.currentPlan;
export const selectApplications = (state: MembershipState) =>
  state.applications;
export const selectCurrentApplication = (state: MembershipState) =>
  state.currentApplication;
export const selectPayments = (state: MembershipState) => state.payments;
export const selectStats = (state: MembershipState) => state.stats;
export const selectLoading = (state: MembershipState) => state.loading;
