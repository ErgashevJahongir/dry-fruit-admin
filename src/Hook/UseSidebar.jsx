import { useContext } from "react";
import { SidebarContext } from "../Context/SidebarDataContext";

export function useSidebar() {
    return useContext(SidebarContext);
}
