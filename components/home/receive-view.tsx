'use client';

import { useState } from 'react';
import { QrCode, Building2, User, CreditCard } from 'lucide-react';
import QRCode from 'react-qr-code';

interface BankDetails {
    name: string;
    bankName: string;
    accountNumber: string;
}

export function ReceiveView() {
    const [hasDetails, setHasDetails] = useState(false);
    const [bankDetails, setBankDetails] = useState<BankDetails>({
        name: '',
        bankName: '',
        accountNumber: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (bankDetails.name && bankDetails.bankName && bankDetails.accountNumber) {
            setHasDetails(true);
        }
    };

    const handleInputChange = (field: keyof BankDetails, value: string) => {
        setBankDetails(prev => ({ ...prev, [field]: value }));
    };

    // Bank Details Form View
    if (!hasDetails) {
        return (
            <div className="flex flex-col gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold mb-2">Setup Your Receive Details</h3>
                    <p className="text-sm text-muted-foreground">
                        Fill in your bank details to receive money
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name Input */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={bankDetails.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                    className="w-full dark:bg-transparent dark:border dark:text-white rounded-xl bg-gray-100 py-3 pl-10 pr-4 text-sm outline-none ring-0 ring-transparent focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Bank Name Input */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                Bank Name
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Enter bank name"
                                    value={bankDetails.bankName}
                                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                                    required
                                    className="w-full rounded-xl dark:bg-transparent dark:border dark:text-white bg-gray-100 py-3 pl-10 pr-4 text-sm outline-none ring-0 ring-transparent focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Account Number Input */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                Account Number
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Enter account number"
                                    value={bankDetails.accountNumber}
                                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                    required
                                    className="w-full rounded-xl dark:bg-transparent dark:border dark:text-white bg-gray-100 py-3 pl-10 pr-4 text-sm outline-none ring-0 ring-transparent focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Save Button */}

                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 md:w-[50%] dark:text-white mx-auto rounded-xl bg-[#e33e38] py-3 font-semibold text-white hover:opacity-90 transition-opacity mt-2"
                    >
                        Save & Generate QR Code
                    </button>
                </form>
            </div>
        );
    }

    // QR Code Display View
    const qrData = JSON.stringify({
        name: bankDetails.name,
        bank: bankDetails.bankName,
        account: bankDetails.accountNumber,
    });

    return (
        <div className="flex flex-col gap-6 items-center">
            {/* User Name Display */}
            <div className="text-left">

                <p className="text-lg text-muted-foreground mt-1">
                    user name : {bankDetails.name}
                </p>
            </div>

            {/* QR Code */}
            <div className="relative flex items-center justify-center rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
                <QRCode
                    value={qrData}
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                />
            </div>

            {/* Instructions */}
            <div className="w-full rounded-xl  p-4">
                <p className="text-sm text-center text-[#e33e38]">
                    Share this QR code to receive money
                </p>
            </div>

            {/* Edit Button */}
            <button
                onClick={() => setHasDetails(false)}
                className="w-full rounded-xl bg-secondary py-3 font-medium hover:bg-secondary/80 transition-colors"
            >
                Edit Details
            </button>
        </div>
    );
}
