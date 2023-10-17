import formidable from "formidable";

const parser = formidable();
export const parse = (req: Parameters<typeof parser.parse>[0]) =>
  new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (res, rej) => {
      parser.parse(req, (err, fields, files) => {
        if (err) {
          rej(err);
          return;
        }
        res({ fields, files });
      });
    }
  );
