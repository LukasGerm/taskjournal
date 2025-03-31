import React, { useEffect, useState } from "react";

type PermissionType = "audio" | "video";

type PermissionValue = "granted" | "blocked";

type Permission = {
  type: PermissionType;
  value: PermissionValue;
};

const BrowserPermissionContext = React.createContext<{
  permissions: Permission[];
}>({
  permissions: [],
});

export const usePermissions = () => {
  return React.useContext(BrowserPermissionContext).permissions;
};

export const BrowserPermissionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(() => {
        setPermissions([
          ...permissions,
          {
            type: "audio",
            value: "granted",
          },
        ]);
      })
      .catch((err) => {
        setPermissions([
          ...permissions,
          {
            type: "audio",
            value: "blocked",
          },
        ]);
        console.error(`you got an error: ${err}`);
      });
  }, []);

  return (
    <BrowserPermissionContext.Provider value={{ permissions }}>
      {children}
    </BrowserPermissionContext.Provider>
  );
};
