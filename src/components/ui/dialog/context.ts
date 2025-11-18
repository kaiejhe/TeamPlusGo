import type { Ref } from "vue";
import { inject } from "vue";

export type DialogContext = {
  open: Ref<boolean>;
  setOpen: (value: boolean) => void;
};

export const dialogContextKey = Symbol("ui-dialog-context");

export const useDialogContext = (component: string) => {
  const context = inject<DialogContext | null>(dialogContextKey, null);
  if (!context) {
    throw new Error(`[${component}] must be used within a <Dialog> component.`);
  }
  return context;
};
