import { useSession } from "next-auth/react";
import Image from "next/image";

export default function UserInfo() {
  const session = useSession();

  return (
    <div className="flex items-center gap-x-1">
      {session.data?.user?.image && (
        <Image
          className="box-content max-w-[64px] inline mx-px border-2 border-white"
          width={32}
          height={32}
          src={session.data.user.image}
          alt="user photo"
        ></Image>
      )}
      <span>
        <b>
          {session.data?.user?.email && !session.data?.user?.name && (
            <>{session.data.user.email}</>
          )}
          {session.data?.user?.name && <>{session.data.user.name}</>}
        </b>
      </span>
    </div>
  );
}
