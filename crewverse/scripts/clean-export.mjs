import {rm} from 'node:fs/promises';
// Remove only generated output. This prevents deleted CMS routes surviving
// a local rebuild or a hosting cache restore; source files are never touched.
await rm(new URL('../out/', import.meta.url), {recursive:true, force:true});
