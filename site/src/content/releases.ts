import changelog from "../../../CHANGELOG.md?raw";
import { parseReleaseNotes } from "../app/changelog";

/** The changelog is the single source for release content and navigation. */
export const releases = parseReleaseNotes(changelog);
