export function existParams(validParams, params) {
  const paramList = Object.keys(params);
  const isValid = validParams.reduce((cont, validParam) => cont && paramList.includes(validParam), true);

  return isValid;
}