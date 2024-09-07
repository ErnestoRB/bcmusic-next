import { useMemo, useState } from "react";
import { meses, shortDateFormat } from "../utils";
import fetcher from "../utils/swr";
import Alert from "./Alert";
import useSWR from "swr";
import { Loading } from "./Loading";
import { Spinner } from "./Spinner";

interface BannerHistory {
  id: string;
  date: string;
  banner: { name: string } | null;
}

export function BannerHistorial() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const params = useMemo(
    () =>
      new URLSearchParams({ month: month.toString(), year: year.toString() }),
    [month, year]
  );

  const { data, error, isLoading } = useSWR(
    `/api/banners/history?${params.toString()}`,
    fetcher
  );

  return (
    <>
      <form className="flex flex-col gap-1 py-8 text-black dark:text-white">
        <div className="flex flex-col w-max">
          <div className="flex gap-2 items-center flex-1">
            <label htmlFor="mes">Mes</label>
            <select
              className="text-black dark:text-black flex-1"
              name="mes"
              id="mes"
              value={month}
              onChange={(e) => {
                setMonth(Number(e.target.value));
              }}
            >
              {meses.map((mes, index) => (
                <option key={mes} value={index + 1}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-center flex-1">
            <label htmlFor="year">Año</label>
            <input
              className="text-black dark:text-black"
              type="number"
              name="year"
              id="yaer"
              min={0}
              value={year}
              onChange={(e) => {
                setYear(Number(e.target.value));
              }}
            />
          </div>
        </div>
      </form>
      {isLoading && (
        <div className="w-full flex-col flex items-center">
          <Spinner></Spinner>
          Cargando...
        </div>
      )}
      {!isLoading && error && (
        <Alert type="error">Error al obtener el historial de banners</Alert>
      )}
      {data && (data.data as BannerHistory[]) && (
        <>
          {(data.data as BannerHistory[]).length > 0 && (
            <table className="text-center border border-black">
              <thead className="bg-black text-white ">
                <tr>
                  <td>Fecha</td>
                  <td>Banner</td>
                </tr>
              </thead>
              <tbody className="even:bg-stone-50 odd:bg-stone-100 hover:bg-stone-300">
                {(data.data as BannerHistory[]).map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{shortDateFormat(new Date(item.date))}</td>
                      <td>
                        {item.banner && item.banner.name}
                        {!item.banner && (
                          <b>No hay información de este banner </b>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {(data.data as BannerHistory[]).length > 0 && (
            <p>
              Se han generado <b>{(data.data as BannerHistory[]).length}</b>{" "}
              banners en este mes
            </p>
          )}

          {(data.data as BannerHistory[]).length == 0 && (
            <Alert type="info">Aún no se generan banners este mes.</Alert>
          )}
        </>
      )}
    </>
  );
}
