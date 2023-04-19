import { GetServerSideProps } from "next";

import { Fonts, FontsType } from "../utils/database/models";
export default function FontsComponent({
  fonts,
}: {
  fonts: FontsType["dataValues"][];
}) {
  return (
    <div className="container">
      <h2 className="text-lg font-bold">Fuentes disponibles:</h2>
      <ul className="list-disc list-outside">
        {fonts.map((font) => (
          <li key={font.nombre}>{font.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const fonts = await Fonts.findAll({ limit: 15 });

  return {
    props: {
      fonts: fonts.map((font) => font.dataValues),
    },
  };
};
