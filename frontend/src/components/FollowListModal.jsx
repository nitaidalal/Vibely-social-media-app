import { createPortal } from "react-dom";
import { FaUserLarge } from "react-icons/fa6";
import { LuX } from "react-icons/lu";
import Follow from "./Resuable/Follow";
import { useEffect } from "react";

const FollowListModal = ({ isOpen, onClose, type, users = [] }) => {
  const title = type === "followers" ? "Followers" : "Following";

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-bg shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-bold text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
            aria-label={`Close ${title.toLowerCase()} modal`}
          >
            <LuX className="text-xl" />
          </button>
        </div>

        <div className="max-h-[min(70vh,28rem)] overflow-y-auto">
          {users.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-text-secondary">
              No {title.toLowerCase()} yet.
            </p>
          )}

          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-700">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUserLarge className="text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">{user.name}</p>
                <p className="truncate text-xs text-text-secondary">@{user.username}</p>
              </div>
              <Follow userId={user._id} />
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default FollowListModal;
