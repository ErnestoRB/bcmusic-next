export default function logError(message: string | Error): void {
  const now = new Date();
  const prefix = `[Error (${now.getDate()}/${now.getMonth()}/${now.getFullYear()})]:`;
  if (typeof message === "string") {
    console.error(`${prefix} ${message}`);
    return;
  }
  console.error(`${prefix} 
Nombre del error: ${message.name}
Mensaje del error: ${message.message}
${message.stack && `Pila: ${message.stack}`}
    `);
}
