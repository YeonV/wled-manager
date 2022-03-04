const storeUI = (set, get) => ({
    drawerWidth: 240,
    setDrawerWidth: (width) => set(() => ({
        drawerWidth: width
    })),
    leftBarOpen: true,
    setLeftBarOpen: (data) => set(() => ({
        leftBarOpen: data
    })),
    
    drawerBottomHeight: 350,
    setDrawerBottomHeight: (height) => set(() => ({
        drawerBottomHeight: height
    })),
    bottomBarOpen: false,
    setBottomBarOpen: (data) => set(() => ({
        bottomBarOpen: data
    })),
    virtualView: false,
    setVirtualView: (open) => set(() => ({
        virtualView: open
    })),


})
export default storeUI
