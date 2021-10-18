import { Principal } from "@dfinity/principal";
import { Member } from "../declarations/candao/candao.did";

export function shortenPrincipalId(id: string): string {
  return `${id.slice(0, 12)}…${id.slice(-4)}`;
}

export function resolveMemberPrincipalId(
  members: Member[],
  principal_id: Principal
): string {
  const id = principal_id.toString();
  const m = members.find((m) => m.principal_id.toString() === id);
  if (m && m.name) return `${m.name} (${shortenPrincipalId(id)})`;
  else return shortenPrincipalId(id);
}
