/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { StateCreator } from 'zustand'

export interface UiSlice {
  drawerWidth: number
  setDrawerWidth: (width: number) => void
  leftBarOpen: boolean
  setLeftBarOpen: (data: boolean) => void
  drawerBottomHeight: number
  setDrawerBottomHeight: (height: number) => void
  bottomBarOpen: boolean
  setBottomBarOpen: (data: boolean) => void
  virtualView: boolean
  setVirtualView: (open: boolean) => void
}

const storeUI: StateCreator<UiSlice> = (set) => ({
  drawerWidth: 240,
  setDrawerWidth: (width) =>
    set(() => ({
      drawerWidth: width
    })),
  leftBarOpen: true,
  setLeftBarOpen: (data: boolean) =>
    set(() => ({
      leftBarOpen: data
    })),
  drawerBottomHeight: 350,
  setDrawerBottomHeight: (height) =>
    set(() => ({
      drawerBottomHeight: height
    })),
  bottomBarOpen: false,
  setBottomBarOpen: (data: boolean) =>
    set(() => ({
      bottomBarOpen: data
    })),
  virtualView: false,
  setVirtualView: (open) =>
    set(() => ({
      virtualView: open
    }))
})

export default storeUI
