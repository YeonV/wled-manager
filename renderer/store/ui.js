const storeUI = (set, get) => ({

    leftBarOpen: true,
    setLeftBarOpen: (data) => set(() => ({
        leftBarOpen: data
    })),
    
    bottomBarOpen: false,
    setBottomBarOpen: (data) => set(() => ({
        bottomBarOpen: data
    })),


})
export default storeUI
