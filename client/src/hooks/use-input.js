import { useState } from "react";

const useInput = (validate) => {
  const [inputValue, setInputValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validate(inputValue);
  const hasError = !isValid && isTouched;

  const valueChangeHandler = (event) => {
    setInputValue(event.target.value);
  };

  const onBlurHandler = () => {
    setIsTouched(true);
  };

  return {
    value: inputValue,
    isValid,
    hasError,
    valueChangeHandler,
    onBlurHandler,
  };
};

export default useInput;
