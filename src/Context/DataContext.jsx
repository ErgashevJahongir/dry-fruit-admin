import { DatePicker, Input, InputNumber, Radio } from "antd";
import moment from "moment";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../Api/Axios";
import useToken from "../Hook/UseToken";
import CustomSelect from "../Module/Select/Select";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [valueDebt, setValueDebt] = useState(null);
    const [user, setUser] = useState({});
    const [measurementData, setMeasurementData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [dryfruitData, setDryfruitData] = useState([]);
    const [dryfruitWarehouseData, setDryfruitWarehouseData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [qarzValue, setQarzValue] = useState("");
    const { token } = useToken();
    let navigate = useNavigate();

    let location = useLocation();

    const onChangeDebt = (e) => {
        setValueDebt(e.target.value);
    };

    const DryFruitDataFunc = () => {
        return dryfruitData?.map((cat) => {
            const data = categoryData.filter(
                (item) => item.id === cat.categoryId
            );
            const name = data[0]?.name;
            return { ...cat, name: name };
        });
    };

    const DryFruitWerehouseDataFunc = () => {
        return dryfruitWarehouseData?.map((cat) => {
            const data = branchData.filter((item) => item.id === cat.branchId);
            const name = data[0]?.name;
            return { ...cat, name: name };
        });
    };

    const newDryFruitWerehouseData = DryFruitWerehouseDataFunc();

    const newDryFruitData = DryFruitDataFunc();

    const incomeFuelsData = [
        {
            name: "dryFruitWarehouseId",
            label: "Quruq meva kiritilayotgan filial",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq meva kiritilayotgan filial"}
                    selectData={newDryFruitWerehouseData}
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
                <Radio.Group onChange={onChangeDebt}>
                    <Radio value="false"> Yo'q </Radio>
                    <Radio value="true">
                        {" "}
                        <p>Bor</p>
                        {valueDebt === "true" ? (
                            <div style={{ width: "100%", marginLeft: "-20px" }}>
                                Qarizdorlik
                                <InputNumber
                                    value={qarzValue}
                                    placeholder="Qarizdorlik"
                                    onChange={(e) => setQarzValue(e)}
                                    style={{
                                        width: "100%",
                                    }}
                                />
                            </div>
                        ) : null}{" "}
                    </Radio>
                </Radio.Group>
            ),
        },
    ];

    const editIncomeFuelsData = [
        {
            name: "dryFruitWarehouseId",
            label: "Quruq meva kiritilayotgan filial",
            inputSelect: (defaultId = null) => (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq meva kiritilayotgan filial"}
                    selectData={newDryFruitWerehouseData}
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

    const outcomeDryFruitData = [
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
            label: "Sotilish vaqti",
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

    const editOutcomeDryFruitData = [
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
            label: "Sotilish vaqti",
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

    const dryFruitWarehouseData = [
        {
            name: "branchId",
            label: "Filialni",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Filialni tanlang"}
                    selectData={branchData}
                />
            ),
        },
        {
            name: "dryFruitId",
            label: "Quruq mevalar",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Mevani tanlang"}
                    selectData={newDryFruitData}
                />
            ),
        },
        {
            name: "amount",
            label: "Miqdori",
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

    const usersData = [
        {
            name: "fio",
            label: "Ishchi FIO",
            input: <Input />,
        },
        {
            name: "password",
            label: "Ishchi passwordi",
            input: <Input />,
        },
        {
            name: "phoneNumber",
            label: "Ishchi nomeri",
            input: <Input />,
        },
        {
            name: "branchId",
            label: "Filial",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Filialni tanlang"}
                    selectData={branchData}
                />
            ),
        },
        {
            name: "roleId",
            label: "roleId",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq mevani tanlang"}
                    selectData={roleData}
                />
            ),
        },
        {
            name: "block",
            label: "block",
            input: (
                <Radio.Group>
                    <Radio value="false"> Yo'q </Radio>
                    <Radio value="true"> Ha </Radio>
                </Radio.Group>
            ),
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
        getRoleData();
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
                formData: usersData,
                editFormData: usersData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Foydalanuvchini o'zgartirish",
                modalTitle: "Yangi foydalanuvchi qo'shish",
            };
            break;
        }
        case "/outcome-dryfruit": {
            formData = {
                formData: outcomeDryFruitData,
                editFormData: editOutcomeDryFruitData,
                branchData: false,
                timeFilterInfo: false,
                deleteInfo: true,
                createInfo: true,
                editInfo: true,
                timelyInfo: false,
                editModalTitle: "Sotilgan quruq mevani o'zgartirish",
                modalTitle: "Sotilgan quruq mevani qo'shish",
            };
            break;
        }
        case "/warehouse-dryfruit": {
            formData = {
                formData: dryFruitWarehouseData,
                editFormData: dryFruitWarehouseData,
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
        newDryFruitWerehouseData,
        newDryFruitData,
        user,
        roleData,
        setUser,
        qarzValue,
    };

    return (
        <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
};
