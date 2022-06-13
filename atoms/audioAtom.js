const { atom } = require("recoil");


export const audioState = atom({
    key: 'audioState', // unique ID (with respect to other atoms/selectors)
    default:{}, // default value (aka initial value)
  });