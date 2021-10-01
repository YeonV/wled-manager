import create, {GetState, SetState, StateCreator, StoreApi} from 'zustand';
// import { MyState } from "./storeTs";

export interface UiSlice {
    leftBarOpen: Boolean;
    setLeftBarOpen: (data:Boolean) => void;
    bottomBarOpen: Boolean;
    setBottomBarOpen: (data:Boolean) => void;
  }

const storeUI: StateCreator<UiSlice> | StoreApi<UiSlice> = (set, get) => ({

    leftBarOpen: true,
    setLeftBarOpen: (data:Boolean) => set(() => ({
        leftBarOpen: data
    })),
    
    bottomBarOpen: false,
    setBottomBarOpen: (data:Boolean) => set(() => ({
        bottomBarOpen: data
    })),


})
export default storeUI
