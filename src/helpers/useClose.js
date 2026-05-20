import { useEscHandler } from "@helpers/useEscHandler";
import { useOutsiderAlerter } from "@helpers/useOutsiderAlerter";

// invokes both useEscHandler and useOutsiderAlerter
export const useClose = (ref, doSomething) => {
  useOutsiderAlerter(ref, () => doSomething());
  useEscHandler(() => doSomething());
};
