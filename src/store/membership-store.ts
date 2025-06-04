/**
 * 會費管理狀態管理
 */

import { create } from "zustand";
import type {
  MembershipPlan,
  MembershipApplication,
  PaymentRecord,
  MembershipStats,
} from "@/types/membership";

interface MembershipState {
  // 會費方案
  plans: MembershipPlan[];
  selectedPlan: MembershipPlan | null;

  // 申請記錄
  applications: MembershipApplication[];
  currentApplication: MembershipApplication | null;

  // 付款記錄
  payments: PaymentRecord[];
  currentPayment: PaymentRecord | null;

  // 統計資料
  stats: MembershipStats | null;

  // UI 狀態
  isLoading: boolean;
  error: string | null;

  // 動作
  setPlans: (plans: MembershipPlan[]) => void;
  setSelectedPlan: (plan: MembershipPlan | null) => void;
  addPlan: (plan: MembershipPlan) => void;
  updatePlan: (id: number, plan: Partial<MembershipPlan>) => void;

  setApplications: (applications: MembershipApplication[]) => void;
  setCurrentApplication: (application: MembershipApplication | null) => void;
  addApplication: (application: MembershipApplication) => void;
  updateApplication: (
    id: number,
    application: Partial<MembershipApplication>
  ) => void;

  setPayments: (payments: PaymentRecord[]) => void;
  setCurrentPayment: (payment: PaymentRecord | null) => void;
  addPayment: (payment: PaymentRecord) => void;
  updatePayment: (id: number, payment: Partial<PaymentRecord>) => void;

  setStats: (stats: MembershipStats) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  reset: () => void;
}

const initialState = {
  plans: [],
  selectedPlan: null,
  applications: [],
  currentApplication: null,
  payments: [],
  currentPayment: null,
  stats: null,
  isLoading: false,
  error: null,
};

export const useMembershipStore = create<MembershipState>((set) => ({
  ...initialState,

  // 會費方案相關動作
  setPlans: (plans) => set({ plans }),

  setSelectedPlan: (plan) => set({ selectedPlan: plan }),

  addPlan: (plan) =>
    set((state) => ({
      plans: [...state.plans, plan],
    })),

  updatePlan: (id, planData) =>
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === id ? { ...plan, ...planData } : plan
      ),
    })),

  // 申請記錄相關動作
  setApplications: (applications) => set({ applications }),

  setCurrentApplication: (application) =>
    set({ currentApplication: application }),

  addApplication: (application) =>
    set((state) => ({
      applications: [...state.applications, application],
    })),

  updateApplication: (id, applicationData) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...applicationData } : app
      ),
      currentApplication:
        state.currentApplication?.id === id
          ? { ...state.currentApplication, ...applicationData }
          : state.currentApplication,
    })),

  // 付款記錄相關動作
  setPayments: (payments) => set({ payments }),

  setCurrentPayment: (payment) => set({ currentPayment: payment }),

  addPayment: (payment) =>
    set((state) => ({
      payments: [...state.payments, payment],
    })),

  updatePayment: (id, paymentData) =>
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === id ? { ...payment, ...paymentData } : payment
      ),
      currentPayment:
        state.currentPayment?.id === id
          ? { ...state.currentPayment, ...paymentData }
          : state.currentPayment,
    })),

  // 統計資料相關動作
  setStats: (stats) => set({ stats }),

  // UI 狀態相關動作
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // 重置狀態
  reset: () => set(initialState),
}));

// 選擇器函數
export const selectPlans = (state: MembershipState) => state.plans;
export const selectSelectedPlan = (state: MembershipState) =>
  state.selectedPlan;
export const selectApplications = (state: MembershipState) =>
  state.applications;
export const selectCurrentApplication = (state: MembershipState) =>
  state.currentApplication;
export const selectPayments = (state: MembershipState) => state.payments;
export const selectCurrentPayment = (state: MembershipState) =>
  state.currentPayment;
export const selectStats = (state: MembershipState) => state.stats;
export const selectIsLoading = (state: MembershipState) => state.isLoading;
export const selectError = (state: MembershipState) => state.error;
 