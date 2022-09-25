import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { DatePicker, Table, Button, Input, Space, Select } from "antd";
import Highlighter from "react-highlight-words";
import {
    SearchOutlined,
    RedoOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import AddData from "./AddTableData";
import EditData from "./EditTableData";
import { useData } from "../../Hook/UseData";

const { Option } = Select;
const { RangePicker } = DatePicker;
const disabledDate = (current) => {
    return current > moment().endOf("day") && current;
};

const CustomTable = (props) => {
    const {
        getData,
        tableData,
        dateFilter,
        columns,
        current,
        pageSize,
        totalItems,
        getDataBranch,
        setCurrent,
        setPageSize,
        loading,
        timelySelect,
        getDataTimely,
        pageSizeOptions,
        onCreate,
        onEdit,
        onDelete,
    } = props;
    const [selectedRowKeys, setSelectedRowKeys] = useState([[], []]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [dateFilt, setDateFilt] = useState(false);
    const [branchFilt, setBranchFilt] = useState(false);
    const [timelyFilt, setTimelyFilt] = useState(false);
    const [itemValue, setItemValue] = useState(null);
    const [date, setDate] = useState([null, null]);
    const { formData, user, branchData } = useData();

    const onChange = (pageNumber, page) => {
        setPageSize(page);
        setCurrent(pageNumber);
        dateFilt
            ? dateFilter(date, pageNumber - 1, page)
            : branchFilt
            ? getDataBranch(itemValue, pageNumber - 1, page)
            : timelyFilt
            ? getDataTimely(itemValue, pageNumber - 1, page)
            : getData(pageNumber - 1, page);
    };

    const handleChange = (value) => {
        setCurrent(1);
        setBranchFilt(false);
        setDateFilt(false);
        setTimelyFilt(true);
        setItemValue(value);
        getDataTimely(value, 0, pageSize);
    };

    const handleBranchChange = (value) => {
        setCurrent(1);
        setTimelyFilt(false);
        setDateFilt(false);
        setBranchFilt(true);
        setItemValue(value);
        getDataBranch(value, 0, pageSize);
    };

    useEffect(() => {
        getData(current - 1, pageSize);
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex, title) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Qidirish ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Qidirish
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Tozalash
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const onSelectChange = (selectedRowKeys, record) => {
        setSelectedRowKeys([[...selectedRowKeys], [...record]]);
    };

    const handleSelect = (record) => {
        if (!selectedRowKeys[0].includes(record.id)) {
            setSelectedRowKeys((prev) => [
                [...prev[0], record.id],
                [...prev[1], record],
            ]);
        } else {
            setSelectedRowKeys((prev) => {
                const arr = prev[0].filter((key) => key !== record.id);
                const arr1 = prev[1].filter((key) => key.id !== record.id);
                return [[...arr], [...arr1]];
            });
        }
    };

    const rowSelection = {
        selectedRowKeys: selectedRowKeys[0],
        onChange: onSelectChange,
    };

    const arr = columns.map((item) =>
        item.search === true
            ? { ...item, ...getColumnSearchProps(item.dataIndex, item.title) }
            : { ...item }
    );
    arr.map((item) => delete item.search);

    const dataTableColumns = [...arr];

    return (
        <>
            <Space className="buttons" size="middle">
                <Space align="center" size={0}>
                    {user?.roleId === 1 ? (
                        formData?.branchData ? (
                            <Select
                                showSearch
                                placeholder="Filialni tanlang"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children
                                        ?.toLowerCase()
                                        ?.includes(input.toLowerCase())
                                }
                                style={{
                                    width: 120,
                                    marginRight: "10px",
                                }}
                                className="select-add"
                                onChange={handleBranchChange}
                            >
                                {branchData?.map((item) => (
                                    <Option key={item?.id} value={item?.id}>
                                        {item?.name}
                                    </Option>
                                ))}
                            </Select>
                        ) : null
                    ) : null}
                    {formData?.timelyInfo ? (
                        <Select
                            showSearch
                            placeholder="Qidirish turi"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children
                                    ?.toLowerCase()
                                    ?.includes(input.toLowerCase())
                            }
                            style={{
                                width: 120,
                                marginRight: "10px",
                            }}
                            className="select-add"
                            onChange={handleChange}
                        >
                            {timelySelect.map((item) => (
                                <Option key={item.value} value={item.value}>
                                    {item.title}
                                </Option>
                            ))}
                        </Select>
                    ) : null}
                    {formData?.timeFilterInfo ? (
                        <>
                            <RangePicker
                                style={{ marginRight: "10px", width: "220px" }}
                                className="select-add"
                                disabledDate={disabledDate}
                                onChange={(val) =>
                                    val
                                        ? setDate([
                                              val[0]?.toISOString(),
                                              val[1]?.toISOString(),
                                          ])
                                        : null
                                }
                            />
                            <Space
                                align="center"
                                size="middle"
                                className="tazalash"
                            >
                                <Button
                                    className="add-button"
                                    onClick={() => {
                                        setDateFilt(true);
                                        setBranchFilt(false);
                                        setTimelyFilt(false);
                                        dateFilter(date, 0, pageSize);
                                    }}
                                    type="primary"
                                    icon={<SearchOutlined />}
                                >
                                    Qidirish
                                </Button>
                                <Button
                                    className="add-button"
                                    onClick={() => {
                                        setDateFilt(false);
                                        setBranchFilt(false);
                                        setTimelyFilt(false);
                                        setItemValue(null);
                                        getData(0, pageSize);
                                    }}
                                    type="primary"
                                    icon={<RedoOutlined />}
                                >
                                    Tozalash
                                </Button>
                            </Space>
                        </>
                    ) : (
                        <div></div>
                    )}
                </Space>
                <Space align="center" size="middle" className="new-buttons">
                    {formData?.editInfo ? (
                        selectedRowKeys[0]?.length === 1 ? (
                            <EditData
                                selectedRowKeys={{ ...selectedRowKeys[1][0] }}
                                onEdit={onEdit}
                                editData={formData?.editFormData}
                                editModalTitle={formData?.editModalTitle}
                            />
                        ) : null
                    ) : null}
                    {formData?.deleteInfo ? (
                        <Button
                            className="add-button"
                            icon={<DeleteOutlined />}
                            type="primary"
                            danger
                            onClick={() => {
                                onDelete(selectedRowKeys[0]);
                                setSelectedRowKeys([[], []]);
                            }}
                        >
                            O'chirish
                        </Button>
                    ) : null}
                    {formData?.createInfo ? (
                        <AddData
                            onCreate={onCreate}
                            formData={formData?.formData}
                            modalTitle={formData?.modalTitle}
                        />
                    ) : null}
                </Space>
            </Space>
            <Table
                rowSelection={rowSelection}
                loading={loading}
                columns={dataTableColumns}
                dataSource={tableData}
                bordered
                rowKey={"id"}
                scroll={{ x: true }}
                onRow={(record) => ({
                    onClick: () => {
                        handleSelect(record);
                    },
                })}
                pagination={{
                    showSizeChanger: true,
                    total: totalItems,
                    pageSize: pageSize,
                    current: current,
                    pageSizeOptions: pageSizeOptions,
                    onChange: onChange,
                }}
            />
        </>
    );
};

export default CustomTable;
