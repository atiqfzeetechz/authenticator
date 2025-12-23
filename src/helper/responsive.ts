import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const hp = (h: number) => {
  const _h = (height * h) / 100;
  return _h;
};

const wp = (w: number) => {
  const _w = (width * w) / 100;
  return _w;
};

export { hp, wp };
