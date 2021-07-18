export default class BadParamError extends Error {
  constructor(param) {
    let message;

    if(Array.isArray(param)) {
      let validParams = param.join(', ');
      message = `Los parametros ingresados son incorrectos, los parametros validos son: ${validParams}`;
    } else {
      message = `Se ingreso el parametro ${param} sin valor asociado`;
    }

    super(message);
  }
} 