import { useForm } from "react-hook-form";
import { BannerRecordModel } from "../utils/database/models";
import { perserveStatus, stringIsAValidUrl } from "../utils";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Alert from "./Alert";

export default function BannerForm({
  banner = undefined,
  redirectOnCreate = true,
  redirectOnUpdate = true,
}: {
  banner?: BannerRecordModel["dataValues"];
  redirectOnCreate?: boolean;
  redirectOnUpdate?: boolean;
}) {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const { push, back } = useRouter();

  return (
    <form
      className="flex flex-col gap-y-4"
      onSubmit={handleSubmit((values) => {
        fetch("/api/banner", {
          method: banner ? "PATCH" : "POST",
          body: JSON.stringify({ id: banner?.id, ...values }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(perserveStatus)
          .then((response) => {
            console.log(response);
            toast(response.json.message, {
              type: response.ok ? "success" : "error",
            });
            if (redirectOnCreate && response.ok && response.json.id) {
              push("/code/" + response.json.id);
            }
            if (banner && redirectOnUpdate && response.ok) {
              back();
            }
          });
      })}
    >
      <label htmlFor="name" className="text-2xl">
        Nombre del banner<b>*</b>
      </label>
      <input
        type="text"
        placeholder="Nombre del banner"
        {...register("name", { required: true, value: banner?.name })}
      />
      {errors.name && <Alert>El nombre es obligatorio</Alert>}
      <label htmlFor="description" className="text-xl">
        Descripción del banner
      </label>
      <input
        type="text"
        placeholder="Descripción del banner"
        {...register("description", { value: banner?.description })}
      />
      <label htmlFor="exampleUrl" className="text-xl">
        URL de imágen de ejemplo
      </label>
      <input
        type="text"
        placeholder="URL de imágen de ejemplo"
        {...register("exampleUrl", {
          required: false,
          value: banner?.exampleUrl,
          /// @ts-ignore
          validate: (value: string, formValues: any) =>
            !value || stringIsAValidUrl(value),
        })}
      />

      {errors.exampleUrl && <Alert>Existen errores en el URL!</Alert>}
      <label htmlFor="width" className="text-xl">
        Ancho del banner (px)<b>*</b>
      </label>
      <input
        type="number"
        placeholder="Ancho del banner"
        {...register("width", {
          max: 3000,
          min: 1000,
          required: true,
          value: banner?.width,
        })}
      />
      {errors.width?.type === "required" && (
        <Alert>El ancho es obligatorio</Alert>
      )}
      {errors.width?.type === "min" && (
        <Alert>El ancho mínimo es de 1000px </Alert>
      )}
      {errors.width?.type === "max" && (
        <Alert>El ancho máximo es de 3000px</Alert>
      )}
      <label htmlFor="height" className="text-xl">
        Alto del banner (px)<b>*</b>
      </label>
      <input
        type="number"
        placeholder="Alto del banner"
        {...register("height", {
          max: 3000,
          min: 1000,
          required: true,
          value: banner?.height,
        })}
      />
      {errors.height?.type === "required" && (
        <Alert>El alto es obligatorio</Alert>
      )}
      {errors.height?.type === "min" && (
        <Alert>El alto mínimo es de 1000px </Alert>
      )}
      {errors.height?.type === "max" && (
        <Alert>El alto máximo es de 3000px</Alert>
      )}
      <label htmlFor="minItems" className="text-xl">
        Artistas mínimos para generar el banner<b>*</b>
      </label>
      <input
        type="number"
        placeholder="Minimo de registros"
        {...register("minItems", {
          max: 10,
          min: 1,
          required: true,
          value: banner?.minItems,
        })}
      />
      {errors.minItems?.type === "required" && (
        <Alert>El número de registros es obligatorio</Alert>
      )}
      {errors.minItems?.type === "min" && (
        <Alert>El número de registros mínimo es de una entrada </Alert>
      )}
      {errors.minItems?.type === "max" && (
        <Alert>El número de registros máximo es de 10 entradas</Alert>
      )}
      <span>
        <b>* Campos obligatorios</b>
      </span>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {`${banner ? "Editar" : "Crear"}`}
      </button>
    </form>
  );
}
