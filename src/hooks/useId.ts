import useConst from './useConst';

let counter = 0;
const nextId = () => {
  counter = counter + 1;
  return String(counter);
};

export const useId = () => useConst(nextId);
