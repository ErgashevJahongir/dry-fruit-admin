import { Col, Row } from "antd";
import * as React from "react";

export class ComponentToPrint extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { checked: false };
    }

    canvasEl;

    handleCheckboxOnChange = () =>
        this.setState({ checked: !this.state.checked });

    setRef = (ref) => (this.canvasEl = ref);

    render() {
        return (
            <div
                className="relativeCSS"
                style={{
                    position: "absolute",
                    zIndex: 99,
                    top: "0",
                    padding: "30px 40px 0",
                }}
            >
                <style type="text/css" media="print"></style>
                <div className="flash" />
                <div style={{ borderBottom: "1px dashed #000" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr 1fr",
                        }}
                    >
                        <h4>Наименование продукта</h4>
                        <h4>Цена продукта</h4>
                        <h4>Количество</h4>
                        <h4>общая стоимость продукта</h4>
                    </div>
                    {this.props.tableData.map((item) => {
                        console.log(this.props);
                        return (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                                }}
                            >
                                <h4>{item.name}</h4>
                                <h4>{item.productPrice}</h4>
                                <h4>
                                    {item.amount}({item.measurmentId})
                                </h4>
                                <h4>{item.productTotalPrice}</h4>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <h4>Итоговая цена: {this.props.totalInputValue}</h4>
                </div>
            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    return <ComponentToPrint ref={ref} text={props.text} />;
});
