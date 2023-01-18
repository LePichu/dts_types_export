# dts_types_export

A prototype for generating dts files from Deno.

By current implmentation this will create a temp folder while using dnt.

## Usage

```ts
import * as dts_typing_export from "https://deno.land/x/dts_types_export/mod.ts";

const data = await dts_typing_export.generate();

console.log(data);
```
