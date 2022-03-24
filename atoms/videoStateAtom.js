import { atom } from 'recoil';

export const videoCurrentTimeState = atom({
  key: "videoCurrentTimeState", 
  default: 0,
})

export const videoTimeState = atom({
  key: "videoTimeState", 
  default: 0,
})

export const lineTimeChartState = atom({
  key: "lineTimeChartState", 
  default: 0,
})