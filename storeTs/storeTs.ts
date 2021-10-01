import create, {GetState, SetState, StateCreator, StoreApi} from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import storeSettings, {SettingsSlice} from './settingsTs';
import storeUI, {UiSlice} from './uiTs';

// export type MyState = UiSlice & SettingsSlice;

// type StateFromFunctions<T extends [...any]> = T extends [infer F, ...(infer R)]
//   ? F extends (...args: any) => object
//     ? StateFromFunctions<R> & ReturnType<F>
//     : unknown
//   : unknown;


// export type State = StateFromFunctions<[
//   typeof storeUI,
//   typeof storeSettings
// ]>;

// const useStore = create<State>((set, get) => ({
//         ...storeUI(set, get),
//         ...storeSettings(set, get)
//     }))

interface IStore extends UiSlice, SettingsSlice {}

export const useStore = create<IStore>((set, get, api) => ({
  ...storeUI(
    set as unknown as SetState<UiSlice>,
    get as GetState<UiSlice>,
    api as unknown as StoreApi<UiSlice>,
  ),
  ...storeSettings(
    set as unknown as SetState<SettingsSlice>,
    get as GetState<SettingsSlice>,
    api as unknown as StoreApi<SettingsSlice>,
  ),
}));

export default useStore