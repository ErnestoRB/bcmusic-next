export default function EmailSent() {
  return (
    <div className="flex flex-col w-full justify-center items-center bg-stone-300">
      <div className="flex flex-col justify-center items-center p-4 border bg-white border-stone-600 rounded shadow-sm">
        <h1>Consulta tu correo</h1>
        <p>
          Hemos enviado un enlace para iniciar sesión a tu bandeja de entrada.
        </p>
        <small className="text-stone-600">
          Si no lo encuentras, busca en la bandeja de correo no deseado.
        </small>
      </div>
    </div>
  );
}
