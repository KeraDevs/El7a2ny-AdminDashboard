import { Command, CommandInput } from "@/components/ui/command";

export default function MiniSearchBar() {
  return (
    <Command className="rounded-lg border shadow-md w-100">
      <CommandInput placeholder="Search for a User..." />
    </Command>
  );
}
