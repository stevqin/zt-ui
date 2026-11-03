export interface ReleaseSection {
  title: string;
  body: string;
}
export interface ReleaseNote {
  version: string;
  date: string;
  id: string;
  compareUrl?: string;
  summary: string;
  sections: ReleaseSection[];
}

/** Keep Markdown bodies intact; only headings outside fences structure the page. */
export function parseReleaseNotes(source: string): ReleaseNote[] {
  const releases: ReleaseNote[] = [];
  let current: ReleaseNote | undefined;
  let section: ReleaseSection | undefined;
  let fence: { marker: string; length: number } | undefined;
  function append(line: string) {
    if (section) section.body += line + "\n";
    else if (current) current.summary += line + "\n";
  }
  for (const line of source.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      append(line);
      if (
        delimiter &&
        delimiter[1][0] === fence.marker &&
        delimiter[1].length >= fence.length &&
        !delimiter[2].trim()
      )
        fence = undefined;
      continue;
    }
    if (delimiter) {
      fence = { marker: delimiter[1][0], length: delimiter[1].length };
      append(line);
      continue;
    }
    const heading = line.match(
      /^##\s+(?:\[([^\]]+)\]\(([^)]+)\)|([^\s]+))\s+[—–-]\s+(\d{4}-\d{2}-\d{2})\s*$/,
    );
    if (heading) {
      const version = heading[1] ?? heading[3];
      current = {
        version,
        date: heading[4],
        id: `release-${version.replace(/[^\w-]/g, "-")}`,
        compareUrl: heading[2]?.startsWith("https://") ? heading[2] : undefined,
        summary: "",
        sections: [],
      };
      releases.push(current);
      section = undefined;
      continue;
    }
    const category = line.match(/^###\s+(.+?)\s*$/);
    if (category && current) {
      section = { title: category[1], body: "" };
      current.sections.push(section);
    } else append(line);
  }
  return releases;
}
