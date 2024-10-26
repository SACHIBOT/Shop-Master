import React, { useRef } from "react";

type SaleItem = {
    item: {
        itemName: string;
    };
    quantity: number;
    price: number;
};

type BillGenerationProps = {
    saleItems: SaleItem[];
    total: number;
    cash: number;
    balance: number;
};

const BillGeneration: React.FC<BillGenerationProps> = ({ saleItems, total, cash, balance }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (printRef.current) {
            const printContent = printRef.current.innerHTML;
            const printWindow = window.open("", "_blank", "width=400,height=600");

            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Bill Summary</title>
                            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                        </head>
                        <body class="p-4 text-sm font-sans">
                            ${printContent}
                        </body>
                    </html>
                `);

                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center">
                <div ref={printRef} className="p-4 w-[400px] text-gray-800 bg-white rounded shadow-lg">
                    <div className="space-x-2 items-center justify-center flex">   <h1 className="text-xl font-bold flex items-center justify-center m-4">ShopMaster </h1> <img src="/logo.png" className="h-8" alt="Logo" /> </div>
                    <h1 className="text-lg font-bold m-4">Bill Summary</h1>



                    <div>
                        <div className="grid grid-cols-5 gap-4 m-4 text-sm border-b border-slate-300 py-2">
                            <span className="col-span-2">Item</span> {/* Wider column */}
                            <span className="col-span-1">Price</span>
                            <span className="col-span-1 text-center">QTY</span>
                            <span className="col-span-1 text-end">SubTotal</span>
                        </div>

                        {saleItems?.length > 0 ? (
                            saleItems.map((item, index) => (
                                <div key={index} className="grid grid-cols-5 gap-4 m-4 text-xs border-b border-slate-300 py-2">
                                    <span className="col-span-2">{item.item.itemName}</span> {/* Wider column */}
                                    <span className="col-span-1">{item.price}</span>
                                    <span className="col-span-1 text-center">{item.quantity}</span>
                                    <span className="col-span-1 text-end">{item.price * item.quantity}</span>
                                </div>
                            ))
                        ) : (
                            <p>No items found in the sale</p>
                        )}
                    </div>

                    <div className="m-4 flex justify-between border-b border-slate-300 py-2">
                        <span>Total LKR. :</span>
                        <span className="font-semibold">{total}</span>
                    </div>
                    <div className="m-4 flex justify-between border-b border-slate-300 py-2">
                        <span>Cash LKR. :</span>
                        <span className="font-semibold">{cash}</span>
                    </div>
                    <div className="m-4 flex justify-between border-b border-slate-300 py-2">
                        <span>Balance LKR. :</span>
                        <span className="font-semibold">{balance}</span>
                    </div>
                    <h1 className="font-semibold flex  items-center justify-center">Thank you! Come again!</h1>
                </div>
            </div>
            <button type="button" className="py-2 px-3 m-4  rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={handlePrint}>

                Print Bill Summary
            </button>
        </div>
    );
};

export default BillGeneration;
