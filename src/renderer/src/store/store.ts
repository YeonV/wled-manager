import { create, StoreApi } from 'zustand'
import storeSettings, { SettingsSlice } from './settings'
import storeUI, { UiSlice } from './ui'

export interface IStore extends UiSlice, SettingsSlice {}

export const useStore = create<IStore>((set, get, api) => ({
  ...storeUI(
    set as unknown as StoreApi<UiSlice>['setState'],
    get as StoreApi<UiSlice>['getState'],
    api as unknown as StoreApi<UiSlice>
  ),
  ...storeSettings(
    set as unknown as StoreApi<SettingsSlice>['setState'],
    get as StoreApi<SettingsSlice>['getState'],
    api as unknown as StoreApi<SettingsSlice>
  )
}))

export default useStore
