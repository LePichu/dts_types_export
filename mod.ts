import { walk } from "https://deno.land/std@0.171.0/fs/walk.ts";
import { build } from "https://deno.land/x/dnt@0.33.0/mod.ts";

export type Options = {
    /**
     * Used by dnt. Gets removed when done.
     */
    tempFolder?: string,
    source?: string | string[];
    /**
     * Path or url to import map. (Usefull when having bad imports. like css imports or other non valid web imports to point to an empty javascript file)
     */
    importMap?: string;
};

export type Path = string;
export type Content = string;

export async function generate({
    tempFolder = "dts_typing_export",
    source = "./mod.ts",
    importMap
}: Options = {}) {
    await build({
        packageManager: "true",
        test: false,
        skipSourceOutput: true,
        package: {
            name: "dts_typing_export",
            version: "1.0.0"
        },
        compilerOptions: {
            lib: [ "dom", "esnext" ]
        },
        importMap: importMap,
        shims: {},
        outDir: tempFolder,
        entryPoints: typeof source == "string" ? [ source ] : source
    });
    const declarations = new Map<Path, Content>();

    for await (const iterator of walk(`./${tempFolder}/types`)) {
        if (iterator.name.startsWith("_") || !iterator.name.endsWith(".d.ts")) continue;

        const key = iterator.path.replace(`${tempFolder}/types/`, "");

        // I don't know why dnt does this. Sure its a bug. Keep in mind when updating dnt.
        const value = Deno.readTextFileSync(iterator.path)
            .replaceAll(`.js';`, `.d.ts';`)
            .replaceAll(`.js";`, `.d.ts";`);

        declarations.set(key, value);
    }

    await Deno.remove(tempFolder, { recursive: true });

    return declarations;
}