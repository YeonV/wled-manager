

export const MenuFile = {
    label: 'File',
    submenu: [
        {
            label: 'Exit',
            click: () => console.log('exit'),
        },
    ],
}


export const MenuTools = {
    label: 'Tools',
    submenu: [
        {
            label: 'Testing checkbox',
            type: 'checkbox',
            checked: true,
        },
        {
            type: 'separator',
        },
        {
            label: 'Testing submenu',
            submenu: [
                {
                    label: 'Submenu &item 1',
                    accelerator: 'Ctrl+T',
                },
            ],
        },
        {
            type: 'separator',
        },
        {
            label: 'Settings',
            click: () => console.log('Click on settings'),
        },
    ],
}



export const template = () => {
    const isMac = process.platform === 'darwin'

    return ([
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: "WLED Manager",
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Author',
                    sublabel: 'YeonV',
                    // icon: nativeImage.createFromPath(('images/github32.png')).resize({ width: 16 }),
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://github.com/YeonV')
                    }
                }
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Settings',
                    sublabel: 'not yet',
                    click: async () => {
                        //   const { shell } = require('electron')
                        //   await shell.openExternal('https://github.com/YeonV')
                        alert("Coming soon...")
                    }
                }
            ]
        }
    ])
}
