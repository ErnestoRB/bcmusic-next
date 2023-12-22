import { UserCard } from "../UserCard";

export function PanelInicio() {
  return (
    <div className="flex flex-col w-full">
      <div className="grid place-items-center">
        <UserCard></UserCard>
      </div>
    </div>
  );
}
