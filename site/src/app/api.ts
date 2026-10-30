import coreApi from "../generated/api.json";
import alertApi from "../generated/alert-api.json";
import type { ApiDocuments } from "./types";
import { createApiPresentation } from "./api-presentation";
export const apiDocuments = { ...coreApi, ...alertApi } as ApiDocuments;

export const apiPresentation = createApiPresentation(apiDocuments);
