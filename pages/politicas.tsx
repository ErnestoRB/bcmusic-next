export default function Politicas() {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-stone-300">
      <div className="max-w-lg bg-white p-2 md:p-4 shadow-lg rounded">
        <h1 className="text-3xl">Política de privacidad</h1>
        <p>
          Al aceptar nuestra política de privacidad, usted, usuario de la
          aplicación BCMusic, proporciona los siguientes derechos sobre sus
          datos personales a los creadores y desarrolladores de BCMusicApp.
        </p>
        <h2 className="text-xl">¿Que datos se recolectan?</h2>
        <ol className="list-decimal pl-4">
          <li>Nombre y Apellido </li>
          <li>Dirección de correo electrónico </li>
          <li>Fecha de nacimiento </li>
          <li>País de Origen </li>
          <li>Credenciales de servicios de streaming (Spotify)</li>
        </ol>
        <h2 className="text-xl">¿Con que fines se recolectan?</h2>
        <p>
          Los datos antes mencionados se recolectan para poder tener registro
          sobre que tipo de usuario hace uso de la aplicación, y posteriormente
          hacer análisis con esta información.
        </p>
        <h2 className="text-xl">¿Por cuanto tiempo se recolectan?</h2>
        <p>
          {" "}
          Los datos serán recolectados y no tendrán una fecha definida para su
          eliminación.
        </p>
        <h2 className="text-xl">
          ¿A quiénes se proporcionan los datos facilitados?
        </h2>
        <p>
          Los datos, a excepción de las credenciales de servicio de streaming
          serán susceptibles a ser cedidos a terceros únicamente para análisis
          estadísticos.
        </p>
        <h2 className="text-xl">
          Derechos de acceso, modificación y eliminación
        </h2>
        <p>
          Usted, podrá en todo momento visualizar sus datos en el panel de
          usuario. La modificación y eliminación será exclusiva de las
          credenciales de servicios de streaming.
        </p>
      </div>
    </div>
  );
}
