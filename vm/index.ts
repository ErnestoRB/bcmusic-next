import { NodeVM } from "vm2";
import { runInNewContext } from "vm";
import { ScriptReturn } from "../utils/authorization/validation/vm";
import { BannerArtist, BannerContext, createBannerContext } from "./context";
import { BannerFont, registerBannerFont } from "./fonts";

export async function executeBanner(
  script: string,
  { width, height }: { width: number; height: number },
  artists: BannerArtist[],
  fonts: BannerFont[] = []
): Promise<Buffer | undefined> {
  if (fonts) {
    fonts.forEach(registerBannerFont);
  }
  const context = createBannerContext(width, height, artists);
  const returned = runInBannerContext(context, script);
  await ScriptReturn.validateAsync(returned, {
    convert: false,
    messages: {
      "custom.promise":
        "El resultado no es una promesa, una funcion que devuelva una promesa, o un buffer!",
    },
  });

  const buffer: Buffer | undefined = await getBufferFromExecution(returned);

  return buffer;
}

export function runInBannerContext(
  context: BannerContext,
  script: string = ""
) {
  return runInNewContext(
    `const vm = new NodeVM({ sandbox: context, wrapper: "none" });
     vm.run(script);`,
    { NodeVM, context, script },
    { timeout: 5000 }
  );
}

/**
 * Unwraps Buffer from function or function that resolves to promise
 * @param returned Lo que regreso la VM
 * @returns Buffer si la ejecucion es valida o undefined si no es valida
 */
export async function getBufferFromExecution(
  returned: any
): Promise<Buffer | undefined> {
  let processed: any = returned;
  if (Buffer.isBuffer(processed)) {
    return processed;
  }
  if (typeof processed === "function") {
    processed = processed();
    if (Buffer.isBuffer(processed)) return processed;
  }
  processed = await processed;
  if (Buffer.isBuffer(processed)) return processed;
  return undefined;
}
