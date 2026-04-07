import { useState } from "react";
import { isEyesClosed } from "../utils/blink.utils";

export const useBlinkDetection = () => {
  const [blink, setBlink] = useState(false);
  const [eyesClosed, setEyesClosed] = useState(false);

  const detect = (left?: number, right?: number) => {
    if (isEyesClosed(left, right)) {
      if (!eyesClosed) {
        setBlink(true);
        setEyesClosed(true);
      }
    } else {
      setEyesClosed(false);
      setBlink(false);
    }
  };

  return { blink, detect };
};
