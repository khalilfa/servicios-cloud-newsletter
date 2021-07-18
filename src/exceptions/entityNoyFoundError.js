export default class EntityNotFoundError extends Error {
  constructor(className, entityId) {
    let message = `No existe ${className} con identificador: ${entityId}`;
    super(message);
  }
} 