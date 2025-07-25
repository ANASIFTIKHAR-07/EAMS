import { List } from "@mui/material";
import { useCallback, useState } from "react";
import { connections } from "../../data";
import { ConnectionItem } from "../ConnectionItem";

function ConnectionsList() {
  const [itemsList, setItemsList] = useState(connections);
  const handleFollowToggle = useCallback(
    (record) => {
      const newConnections = itemsList.map((item) => {
        if (record.id === item.id) return { ...record, follow: !item.follow };

        return item;
      });
      setItemsList(newConnections);
    },
    [itemsList]
  );

  return (
    <List disablePadding>
      {itemsList.map((item, index) => (
        <ConnectionItem
          item={item}
          key={index}
          handleFollowToggle={handleFollowToggle}
        />
      ))}
    </List>
  );
}

export { ConnectionsList };
