import { useSession } from "next-auth/react";
import Alert from "./Alert";
import { Spinner } from "./Spinner";

export function UserCard() {
  const session = useSession();

  return (
    <div className="w-full max-w-sm max-h-40  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 py-4">
      <div className="flex flex-col items-center">
        {session.status === "authenticated" && (
          <>
            {session.data.user.image ? (
              <img
                className="w-12 h-12 mb-3 rounded-full shadow-lg"
                src={session.data.user.image}
                alt="Bonnie image"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full bg-black shadow-lg
          "
              ></div>
            )}
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {session.data.user.name ?? session.data.user.email}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {session.data.user.name && session.data.user.email
                ? session.data.user.email
                : ""}
            </span>
          </>
        )}
        {session.status == "unauthenticated" && (
          <Alert inline type="error">
            Sesión no iniciada!
          </Alert>
        )}
        {session.status == "loading" && <Spinner />}
      </div>
    </div>
  );
}
