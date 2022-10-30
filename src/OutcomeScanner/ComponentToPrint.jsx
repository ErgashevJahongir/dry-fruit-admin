import moment from "moment";
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
                    zIndex: -99,
                    top: "0",
                    padding: "30px 40px 0",
                }}
            >
                <style type="text/css" media="print"></style>
                <div className="flash" />
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <h2 style={{ fontWeight: 600 }}>№1 Сухофрукты</h2>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}
                >
                    <p>Дата : </p>
                    <p>{moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}</p>
                </div>
                <div
                    style={{
                        borderBottom: "1px dashed #000",
                        borderTop: "1px dashed #000",
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr 1fr",
                            marginBottom: 10,
                            marginTop: 20,
                        }}
                    >
                        <h4 style={{ fontWeight: 600 }}>
                            Наименование продукта
                        </h4>
                        <h4 style={{ fontWeight: 600 }}>Цена продукта</h4>
                        <h4 style={{ fontWeight: 600 }}>Количество</h4>
                        <h4 style={{ fontWeight: 600 }}>
                            общая стоимость продукта
                        </h4>
                    </div>
                    {this.props.tableData.map((item) => {
                        return (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                                    marginBottom: 10,
                                }}
                            >
                                <h4>{item.name}</h4>
                                <h4>{item.productPrice}</h4>
                                <h4>
                                    {item.amount}({item.measurment})
                                </h4>
                                <h4>{item.productTotalPrice}</h4>
                            </div>
                        );
                    })}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "end",
                        marginBottom: 15,
                    }}
                >
                    <h3 style={{ fontWeight: 600 }}>
                        Итоговая цена: {this.props.totalInputValue}
                    </h3>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <h3 style={{ fontWeight: 600 }}>Спасибо за покупку</h3>
                </div>
            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    return <ComponentToPrint ref={ref} text={props.text} />;
});
