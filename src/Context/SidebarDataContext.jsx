import { createContext, useState } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [outcomeNakladnoyDryFruit, setOutcomeNakladnoyDryFruit] = useState(
        []
    );
    const [tableData, setTableData] = useState([]);
    const [nakladnoySidebar, setNakladnoySidebar] = useState(false);
    const [kassaSidebar, setKassaSidebar] = useState(true);
    const [totalSum, setTotalSum] = useState(0);

    const value = {
        nakladnoySidebar,
        kassaSidebar,
        outcomeNakladnoyDryFruit,
        tableData,
        totalSum,
        setTotalSum,
        setTableData,
        setOutcomeNakladnoyDryFruit,
        setKassaSidebar,
        setNakladnoySidebar,
    };
    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};
