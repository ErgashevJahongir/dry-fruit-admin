import { Select } from "antd";
const { Option } = Select;

const CustomSelect = ({
    selectData,
    DValue,
    onChange,
    backValue = "id",
    placeholder = "Tanlang",
    disabled = false,
    value,
}) => {
    const options = selectData.map((item) => (
        <Option value={backValue === "id" ? item.id : item.name} key={item.id}>
            {item.name}
        </Option>
    ));
    return (
        <Select
            // value={value}
            showSearch
            allowClear
            placeholder={placeholder}
            optionFilterProp="children"
            style={{ width: "100%" }}
            defaultValue={DValue}
            onChange={(e) => onChange(e)}
            key={"id"}
            filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
            }
            disabled={disabled}
        >
            {options}
        </Select>
    );
};

export default CustomSelect;
