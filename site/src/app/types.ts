export type DocGroup =
  | "foundation"
  | "layout"
  | "form"
  | "data"
  | "navigation"
  | "feedback"
  | "overlay"
  | "media"
  | "extensions";
export interface DocExampleMeta {
  id: string;
  title: string;
  description: string;
  file: string;
  wide?: boolean;
}
export interface DocPage {
  id: string;
  name: string;
  title: string;
  group: DocGroup;
  description: string;
  usage: string[];
  examples: DocExampleMeta[];
}
export interface ApiRow {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  fields?: ApiRow[];
}
export interface ApiComponent {
  kind?: "service";
  name: string;
  props: ApiRow[];
  events: ApiRow[];
  slots: ApiRow[];
  exposes: ApiRow[];
  types?: ApiRow[];
}
export type ApiDocuments = Record<string, { components: ApiComponent[] }>;
