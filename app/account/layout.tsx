import { PropsWithChildren } from "react";
import SideNavigation from "../_components/SideNavigation";

type LayoutType = PropsWithChildren;

export default function Layout({ children }: LayoutType) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
      <SideNavigation />
      <div className="py-1">{children}</div>
    </div>
  );
}
