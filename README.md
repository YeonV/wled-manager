
![state](https://img.shields.io/badge/STATE-alpha-blue.svg?logo=github&logoColor=white) ![version](https://img.shields.io/github/v/release/YeonV/wled-manager?label=VERSION&logo=git&logoColor=white) [![creator](https://img.shields.io/badge/CREATOR-Yeon-blue.svg?logo=github&logoColor=white)](https://github.com/YeonV) [![creator](https://img.shields.io/badge/A.K.A-Blade-darkred.svg?logo=github&logoColor=white)](https://github.com/YeonV)
# WLED Manager 
![mui](https://img.shields.io/badge/Electron-Desktop_App_Wrapper-blue.svg?logo=electron&logoColor=white) ![nextjs](https://img.shields.io/badge/Next.js-framework-blue.svg?logo=next.js&logoColor=white) ![react](https://img.shields.io/badge/React-JS_lib-blue.svg?logo=react&logoColor=white) ![mui](https://img.shields.io/badge/Material_UI-components-blue.svg?logo=material-ui&logoColor=white) 

|| Windows| Mac | Linux|
|:-------:|:-------:|:------------:|:------------:|
|<img src="https://user-images.githubusercontent.com/28861537/134611417-ecf80cd2-bc18-4d4f-8d93-d6908c5807fa.png" alt="drawing" width="100"/>|<img src="https://user-images.githubusercontent.com/28861537/134682663-51bcc275-016b-4a59-8dc9-b6071a6b69c5.png" alt="drawing" width="150"/>|<img src="https://user-images.githubusercontent.com/28861537/134682634-22eae973-3c04-410e-bae5-c5d83e1911e1.png" alt="drawing" width="150"/>|<img src="https://user-images.githubusercontent.com/28861537/134682590-1a0affa6-c31d-4c00-885e-9a6e9c7558d2.png" alt="drawing" width="150"/>

---

## Introducing WebAudio in v0.0.3 (proof of concept)

<img src="https://user-images.githubusercontent.com/28861537/135351170-e7f6f1be-7af6-4183-aee0-10a205255fcc.png" width="300" />

<a href="https://user-images.githubusercontent.com/28861537/135351030-af2c4408-7bb8-4ad4-9bf0-e13e04f8122a.mp4" target="_blank">
  Open Video
</a>

## Attention

All this is still pre-alpha-state. If you want to test it, make sure you set `IP`, `PixelCount`, `Color` and `Frequency-Band (one of the equalizer's bars)` **!before!** you click play. Also stopping and replaying is currently resulting in multiple Senders.
When it hangs, just restart the app.

Everything is done without a state-management-lib.
After I choose one, `IP` and `PixelCount` can be retrieved automatically.

## Development

<details><summary>Click to expand</summary>

  ### Create an App

```
# with npx
$ npx create-nextron-app my-app --example with-typescript-material-ui

# with yarn
$ yarn create nextron-app my-app --example with-typescript-material-ui

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-material-ui
```

### Install Dependencies

```
$ cd my-app

# using yarn or npm
$ yarn (or `npm install`)

# using pnpm
$ pnpm install --shamefully-hoist
```

### Use it

```
# development mode
$ yarn dev (or `npm run dev` or `pnpm run dev`)

# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```
   
</details>

## Special Thanks

[![saltyshiomix](https://img.shields.io/badge/Nextron-saltyshiomix-blue.svg?logo=github&logoColor=white)](https://github.com/saltyshiomix/nextron) 
[![wled-github](https://img.shields.io/badge/WLED-Aircookie-blue.svg?logo=github&logoColor=white)](https://github.com/Aircoookie/WLED)
