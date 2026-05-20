import { cn } from "@helpers/cn";
import React from "react";

import { Icon } from "@primitives/Icon";
import * as icons from "@primitives/Icon/icons/_icons.export";

const IconsPage = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, 200px)",
        gridGap: 30,
        padding: 50,
      }}
    >
      {Object.keys(icons).map((icon) => {
        const iconName: any = icon;
        return (
          <div key={icon}>
            <Icon
              name={iconName}
              className={cn("icon-color-primaryOne mb-2 size-40")}
            />
            <p>{icon}</p>
          </div>
        );
      })}
    </div>
  );
};

export default IconsPage;
