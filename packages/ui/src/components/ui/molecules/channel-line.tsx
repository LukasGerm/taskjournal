import { TrashIcon } from "@heroicons/react/16/solid";
import { Link } from "@tanstack/react-router";

interface ChannelLineProps {
  id: string;
  name: string;
  activeUsers: string[];
  onDelete: () => void;
  onDoubleClick: () => void;
}

export const ChannelLine = (props: ChannelLineProps) => {
  const { id, name, onDelete, onDoubleClick, activeUsers } = props;

  return (
    <>
      <Link
        to={`/app/$channel`}
        params={{ channel: id }}
        className="flex items-center justify-between group"
        onDoubleClick={onDoubleClick}
      >
        <span className="hover cursor-pointer">{name}</span>

        <TrashIcon
          onClick={onDelete}
          className="w-6 opacity-0 group-hover:opacity-100 cursor-pointer"
        />
      </Link>
      {activeUsers.map((user) => (
        <UserLine key={user} user={user} />
      ))}
    </>
  );
};

const UserLine = (props: { user: string }) => {
  return (
    <div className="text-gray-500 text-xs flex  gap-2">
      <div className="w-4 h-4 rounded-full bg-blue-500" />
      {props.user}
    </div>
  );
};
