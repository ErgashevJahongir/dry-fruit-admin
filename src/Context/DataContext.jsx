import { DatePicker, Input, InputNumber, Radio } from "antd";
import moment from "moment";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../Api/Axios";
import useToken from "../Hook/UseToken";
import CustomSelect from "../Module/Select/Select";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [measurementData, setMeasurementData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [dryfruitData, setDryfruitData] = useState([]);
    const [dryfruitWarehouseData, setDryfruitWarehouseData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const { token } = useToken();
    let navigate = useNavigate();
    let location = useLocation();

    const DryFruitDataFunc = () => {
        return dryfruitData?.map((cat) => {
            const data = categoryData.filter(
                (item) => item.id === cat.categoryId
            );
            const name = data[0]?.name;
            return { ...cat, name: name };
        });
    };

    const newDryFruitData = DryFruitDataFunc();

    const incomeFuelsData = [
        {
            name: "dryFruitWarehouseId",
            label: "Quruq meva turi",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq mevani skladdan tanlang"}
                    selectData={dryfruitWarehouseData}
                />
            ),
        },
        {
            name: "dryFruitId",
            label: "Quruq meva nomi",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq mevani tanlang"}
                    selectData={newDryFruitData}
                />
            ),
        },
        {
            name: "measurementId",
            label: "Quruq meva o'lchovi",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq meva o'lchovi"}
                    selectData={measurementData}
                />
            ),
        },
        {
            name: "amount",
            label: "Quruq meva miqdori",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "price",
            label: "Quruq meva narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "date",
            label: "Kelish vaqti",
            input: (
                <DatePicker
                    style={{ width: "100%" }}
                    value={moment().format()}
                />
            ),
        },
        {
            name: "debt",
            label: "Qarzdorlik",
            input: (
                <Radio.Group>
                    <Radio value="false"> Yo'q </Radio>
                    <Radio value="true"> Bor </Radio>
                </Radio.Group>
            ),
        },
    ];

    const editIncomeFuelsData = [
        {
            name: "dryFruitWarehouseId",
            label: "Yoqilg'i turi",
            inputSelect: (defaultId = null) => (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq mevani skladdan tanlang"}
                    selectData={dryfruitWarehouseData}
                    DValue={defaultId}
                />
            ),
        },
        {
            name: "dryFruitId",
            label: "Quruq meva nomi",
            inputSelect: (defaultId = null) => (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq mevani tanlang"}
                    selectData={newDryFruitData}
                    DValue={defaultId}
                />
            ),
        },
        {
            name: "measurementId",
            label: "Quruq meva o'lchovi",
            inputSelect: (defaultId = null) => (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq meva o'lchovi"}
                    selectData={measurementData}
                    DValue={defaultId}
                />
            ),
        },
        {
            name: "amount",
            label: "Quruq meva miqdori",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "price",
            label: "Quruq meva narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "date",
            label: "Kelish vaqti",
            input: <Input />,
        },
        {
            name: "debt",
            label: "Qarzdorlik",
            input: (
                <Radio.Group>
                    <Radio value="false"> Yo'q </Radio>
                    <Radio value="true"> Bor </Radio>
                </Radio.Group>
            ),
        },
    ];

    const othersData = [
        {
            name: "name",
            label: "Nomi",
            input: <Input />,
        },
    ];

    const othersBranchData = [
        {
            name: "name",
            label: "Nomi",
            input: <Input />,
        },
        {
            name: "main",
            label: "Bu filial asosiymi",
            input: (
                <Radio.Group>
                    <Radio value="false"> Yo'q </Radio>
                    <Radio value="true"> Ha </Radio>
                </Radio.Group>
            ),
        },
    ];

    const editOthersBranchData = [
        {
            name: "name",
            label: "Nomi",
            input: <Input />,
        },
        {
            name: "main",
            label: "Bu filial asosiymi",
            inputSelect: (defaultId = null) => {
                const str = defaultId?.toString();
                return (
                    <Radio.Group defaultValue={str}>
                        <Radio value="false"> Yo'q </Radio>
                        <Radio value="true"> Ha </Radio>
                    </Radio.Group>
                );
            },
        },
    ];

    const dryFruitData = [
        {
            name: "categoryId",
            label: "Kategoriyani tanlang",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Kategoriyani tanlang"}
                    selectData={categoryData}
                />
            ),
        },
        {
            name: "incomePrice",
            label: "Kelish narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "outcomePrice",
            label: "Sotilish narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
    ];

    const editdryFruitData = [
        {
            name: "categoryId",
            label: "Kategoriyani tanlang",
            inputSelect: (defaultId = null) => {
                return (
                    <CustomSelect
                        DValue={defaultId}
                        backValue={"id"}
                        placeholder={"Kategoriyani tanlang"}
                        selectData={categoryData}
                    />
                );
            },
        },
        {
            name: "incomePrice",
            label: "Kelish narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "outcomePrice",
            label: "Sotilish narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
    ];

    const clientsData = [
        {
            name: "fio",
            label: "Klient FIO",
            input: <Input />,
        },
        {
            name: "phoneNumber",
            label: "Klient nomeri",
            input: <Input />,
        },
        {
            name: "address",
            label: "Klient addressi",
            input: <Input />,
        },
    ];

    const workersData = [
        {
            name: "fio",
            label: "Ishchi FIO",
            input: <Input />,
        },
        {
            name: "phoneNumber",
            label: "Ishchi nomeri",
            input: <Input />,
        },
    ];

    const outcomeDryfruitData = [
        {
            name: "categoryId",
            label: "Kategoriyani tanlang",
            inputSelect: (defaultId = null) => {
                return (
                    <CustomSelect
                        DValue={defaultId}
                        backValue={"id"}
                        placeholder={"Kategoriyani tanlang"}
                        selectData={categoryData}
                    />
                );
            },
        },
        {
            name: "incomePrice",
            label: "Kelish narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "outcomePrice",
            label: "Sotilish narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "debt",
            label: "Qarzdorlik",
            inputSelect: (defaultId = null) => {
                return (
                    <CustomSelect
                        DValue={defaultId}
                        backValue={"id"}
                        placeholder={"Kategoriyani tanlang"}
                        selectData={categoryData}
                    />
                );
            },
        },
    ];

    const dryFruitWarehouse = [
        {
            name: "name",
            label: "Meva nomi",
            input: <Input />,
        },
        {
            name: "id",
            label: "Meva id",
            input: <Input />,
        },
    ];

    const indebtFormData = [
        {
            name: "incomeDryFruitId",
            label: "Qarzga olingan mahsulot",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq mevani tanlang"}
                    selectData={newDryFruitData}
                />
            ),
        },
        {
            name: "borrowAmount",
            label: "Qarz miqdori",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "given",
            label: "Qarz uzilganmi",
            input: (
                <Radio.Group>
                    <Radio value="false"> Yo'q </Radio>
                    <Radio value="true"> Ha </Radio>
                </Radio.Group>
            ),
        },
    ];

    const editIndebtFormData = [
        {
            name: "incomeDryFruitId",
            label: "Qarzga olingan mahsulot",
            inputSelect: (defaultId = null) => {
                return (
                    <CustomSelect
                        backValue={"id"}
                        placeholder={"Quruq mevani tanlang"}
                        selectData={newDryFruitData}
                        DValue={defaultId}
                    />
                );
            },
        },
        {
            name: "borrowAmount",
            label: "Qarz miqdori",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "given",
            label: "Qarz uzilganmi",
            inputSelect: (defaultId = null) => {
                const str = defaultId?.toString();
                return (
                    <Radio.Group defaultValue={str}>
                        <Radio value="false"> Yo'q </Radio>
                        <Radio value="true"> Ha </Radio>
                    </Radio.Group>
                );
            },
        },
    ];

    const outdebtFormData = [
        {
            name: "outcomeDryFruitId",
            label: "Qarzga olingan mahsulot",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq mevani tanlang"}
                    selectData={newDryFruitData}
                />
            ),
        },
        {
            name: "borrowAmount",
            label: "Qarz miqdori",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "given",
            label: "Qarz uzilganmi",
            input: (
                <Radio.Group>
                    <Radio value="false"> Yo'q </Radio>
                    <Radio value="true"> Ha </Radio>
                </Radio.Group>
            ),
        },
    ];
    const editOutdebtFormData = [
        {
            name: "incomeDryFruitId",
            label: "Qarzga olingan mahsulot",
            inputSelect: (defaultId = null) => {
                return (
                    <CustomSelect
                        backValue={"id"}
                        placeholder={"Quruq mevani tanlang"}
                        selectData={newDryFruitData}
                        DValue={defaultId}
                    />
                );
            },
        },
        {
            name: "borrowAmount",
            label: "Qarz miqdori",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "given",
            label: "Qarz uzilganmi",
            inputSelect: (defaultId = null) => {
                const str = defaultId?.toString();
                return (
                    <Radio.Group defaultValue={str}>
                        <Radio value="false"> Yo'q </Radio>
                        <Radio value="true"> Ha </Radio>
                    </Radio.Group>
                );
            },
        },
    ];

    const getMeasurementData = () => {
        instance
            .get("api/dry/fruit/measurement/all")
            .then((data) => {
                setMeasurementData(data.data.data);
            })
            .catch((err) => console.error(err));
    };

    const getCategoryData = () => {
        instance
            .get("api/dry/fruit/category")
            .then((data) => {
                setCategoryData(data.data.data);
            })
            .catch((err) => console.error(err));
    };

    const getDryfruitData = () => {
        instance
            .get("api/dry/fruit/dryFruit/getAll")
            .then((data) => {
                setDryfruitData(data.data.data);
            })
            .catch((err) => console.error(err));
    };

    const getDryfruitWarehouseData = () => {
        instance
            .get("api/dry/fruit/dryFruitWarehouse/getAll")
            .then((data) => {
                setDryfruitWarehouseData(data.data.data);
            })
            .catch((err) => console.error(err));
    };

    const getBranchData = () => {
        instance
            .get("api/dry/fruit/api/dry/fruit/branch")
            .then((data) => {
                setBranchData(data.data.data);
            })
            .catch((err) => console.error(err));
    };

    const getRoleData = () => {
        instance
            .get("api/dry/fruit/role/getAll")
            .then((data) => {
                setRoleData(data.data.data);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        getRoleData();
        getMeasurementData();
        getCategoryData();
        getBranchData();
        getDryfruitData();
        getDryfruitWarehouseData();
    }, []);

    let formData = {};

    switch (location.pathname) {
        case "/others": {
            formData = {
                formData: othersData,
                editFormData: othersData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "O'zgartirish",
                modalTitle: "Yangi qo'shish",
            };
            break;
        }
        case "/branchs": {
            formData = {
                formData: othersBranchData,
                editFormData: editOthersBranchData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Filialni o'zgartirish",
                modalTitle: "Yangi filial qo'shish",
            };
            break;
        }
        case "/dryfruit": {
            formData = {
                formData: dryFruitData,
                editFormData: editdryFruitData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Quruq mevanini o'zgartirish",
                modalTitle: "Quruq meva qo'shish",
            };
            break;
        }
        case "/income-dryfruit": {
            formData = {
                formData: incomeFuelsData,
                editFormData: editIncomeFuelsData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Kelgan quruq mevani o'zgartirish",
                modalTitle: "Kelgan quruq mevani qo'shish",
            };
            break;
        }
        case "/clients": {
            formData = {
                formData: clientsData,
                editFormData: clientsData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Klientni o'zgartirish",
                modalTitle: "Yangi klient qo'shish",
            };
            break;
        }
        case "/indebts": {
            formData = {
                formData: indebtFormData,
                editFormData: editIndebtFormData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Ichki qarzni o'zgartirish",
                modalTitle: "Ichki qarz qo'shish",
            };
            break;
        }
        case "/worker": {
            formData = {
                formData: workersData,
                editFormData: workersData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Ishchini o'zgartirish",
                modalTitle: "Yangi ishchi qo'shish",
            };
            break;
        }
        case "/users": {
            formData = {
                formData: workersData,
                editFormData: workersData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Ishchini o'zgartirish",
                modalTitle: "Yangi ishchi qo'shish",
            };
            break;
        }
        case "/outcome-dryfruit": {
            formData = {
                formData: outcomeDryfruitData,
                editFormData: outcomeDryfruitData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Ishchini o'zgartirish",
                modalTitle: "Yangi ishchi qo'shish",
            };
            break;
        }
        case "/warehouse-dryfruit": {
            formData = {
                formData: dryFruitWarehouse,
                editFormData: dryFruitWarehouse,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Mevani o'zgartirish",
                modalTitle: "Yangi meva qo'shish",
            };
            break;
        }
        default: {
            formData = { ...formData };
        }
    }

    const value = {
        formData,
        getMeasurementData,
        measurementData,
        getCategoryData,
        categoryData,
        getBranchData,
        branchData,
        setDryfruitWarehouseData,
        dryfruitWarehouseData,
        newDryFruitData,
        user,
        roleData,
        setUser,
    };

    return (
        <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
};
