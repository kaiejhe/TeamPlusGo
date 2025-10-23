import { toast as sonnerToast } from "vue-sonner";

export type { ToastOptions } from "vue-sonner";

export const toast = sonnerToast;

export const useToast = () => ({ toast });

