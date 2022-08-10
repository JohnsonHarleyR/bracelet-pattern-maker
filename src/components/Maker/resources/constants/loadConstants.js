//#region Helpers

const lowerAlphabet = [
  `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, 
  `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, 
  `u`, `v`, `w`, `x`, `y`, `z`, 
];

const getUpperAlphabet = () => {
  let upperArray = [];
  lowerAlphabet.forEach(a => {
    upperArray.push(a.toUpperCase());
  });
  return upperArray;
}

//#endregion

export const Alphabet = {
  lower: lowerAlphabet,
  upper: getUpperAlphabet(),
};
