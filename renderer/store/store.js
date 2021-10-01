import create from 'zustand'
import { devtools, persist } from 'zustand/middleware';
import storeSettings from './settings';
import storeUI from './ui';

const useStore = create(persist(
    devtools((set, get) => ({
        ...storeUI(set, get),
        ...storeSettings(set, get)
    }))))

export default useStore