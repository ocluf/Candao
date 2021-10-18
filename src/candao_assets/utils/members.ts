import { Principal } from "@dfinity/principal";
import { Member } from "../declarations/candao/candao.did";

export function resolveMemberPrincipalId(
  members: Member[],
  principal_id: Principal
): string {
  const id = principal_id.toString();
  const m = members.find((m) => m.principal_id.toString() === id);
  if (m) return `${m.name} (${id})`;
  else return id;
}
