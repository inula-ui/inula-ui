import { isArray } from 'lodash';
import { createStore } from 'openinula';

export type Control = string | number;
export type ControlMode = 'one' | 'all';

const ACLStore = createStore({
  id: 'ACL',
  state: {
    full: false,
    controls: [] as Control[],
  },
  actions: {
    setFull(state, full) {
      state.full = full;
    },
    set(state, controls) {
      state.controls = controls;
    },
    add(state, control) {
      state.controls = Array.from(new Set(state.controls.concat(isArray(control) ? control : [control])));
    },
    remove(state, control) {
      const controls = new Set(state.controls);
      for (const v of isArray(control) ? control : [control]) {
        controls.delete(v);
      }
      state.controls = Array.from(controls);
    },
  },
});

export function useACL() {
  const store = ACLStore();

  return {
    full: store.full,
    controls: store.controls,
    setFull: (full: boolean) => {
      store.setFull(full);
    },
    set: (controls: Control[]) => {
      store.set(controls);
    },
    add: (control: Control | Control[]) => {
      store.add(control);
    },
    remove: (control: Control | Control[]) => {
      store.remove(control);
    },
    can: (control: Control | Control[], mode: ControlMode = 'one'): boolean => {
      if (store.full) {
        return true;
      }

      const arr = isArray(control) ? control : [control];

      let n = 0;
      for (const v of arr) {
        if (store.controls.includes(v)) {
          n += 1;
        }
      }

      if (n > 0 && (mode === 'one' || (mode === 'all' && n === arr.length))) {
        return true;
      }
      return false;
    },
  };
}
