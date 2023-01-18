import { meses } from "../utils";
import Alert from "./Alert";

export function BannerHistorial({
  banners,
}: {
  banners: { mes: number; cantidad: number }[];
}) {
  if (!banners) {
    return null;
  }

  return (
    <>
      <h2 className="text-xl font-semibold">
        Historial de banners generados ({new Date().getFullYear()})
      </h2>
      {banners.length > 0 && (
        <table className="text-center border border-black">
          <thead className="bg-black text-white ">
            <tr>
              <td>Mes</td>
              <td>Cantidad</td>
            </tr>
          </thead>
          <tbody className="even:bg-stone-50 odd:bg-stone-100 hover:bg-stone-300">
            {banners.map((item) => {
              return (
                <tr key={item.mes}>
                  <td>{meses[item.mes - 1]}</td>
                  <td>
                    <b>{item.cantidad}</b>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {banners.length == 0 && (
        <Alert type="info">Aún no se generan banners.</Alert>
      )}
    </>
  );
}
