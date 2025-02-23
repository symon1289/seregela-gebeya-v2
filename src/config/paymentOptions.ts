import Tele_Birr from "../assets/payment-option-1.png";
import CBE_Pay from "../assets/payment-option-2.jpg";
import Hello_Cash from "../assets/payment-option-3.jpg";
import CBE_Birr from "../assets/payment-option-4.png";
import CBE_Mobile_Banking from "../assets/payment-option-5.png";
import Awash_Birr from "../assets/payment-option-6.png";
import BOA from "../assets/payment-option-7.png";
import Apollo from "../assets/payment-option-8.png";
import Enat_Bank from "../assets/payment-option-9.png";
import Eth_Switch from "../assets/payment-option-10.png";
import Abay_Bank from "../assets/payment-option-12.jpg";
import Bunna_Bank from "../assets/payment-option-11.png";

export interface PaymentOption {
    id: number;
    name: string;
    image: string;
    sendingName?: string;
    backroundColor?: string;
}

export const paymentOptions: PaymentOption[] = [
    {
        id: 5,
        name: "CBE Mobile Banking",
        image: CBE_Mobile_Banking,
        sendingName: "cbe",
        backroundColor: "bg-[#4E1B57]",
    },
    { id: 1, name: "Telebirr", image: Tele_Birr, sendingName: "telebirr" },
    {
        id: 11,
        name: "Bunna Bank",
        image: Bunna_Bank,
        sendingName: "bunna",
    },
    {
        id: 12,
        name: "Abay Bank",
        image: Abay_Bank,
        sendingName: "abay",
    },
    { id: 2, name: "CBE Pay", image: CBE_Pay, sendingName: "cbe-pay" },
    { id: 3, name: "Hello Cash", image: Hello_Cash, sendingName: "hello-cash" },
    { id: 4, name: "CBE Birr", image: CBE_Birr, sendingName: "cbe-birr" },

    { id: 6, name: "Awash Birr", image: Awash_Birr, sendingName: "awash-birr" },
    {
        id: 7,
        name: "BOA",
        image: BOA,
        sendingName: "boa-cybersource",
        backroundColor: "bg-[#F2AC11]",
    },
    {
        id: 8,
        name: "Apollo",
        image: Apollo,
        sendingName: "apollo",
        backroundColor: "bg-gradient-to-br from-[#570C21] to-[#8E3014]",
    },
    { id: 9, name: "Enat Bank", image: Enat_Bank, sendingName: "enat-bank" },
    {
        id: 10,
        name: "Eth-Switch",
        image: Eth_Switch,
        sendingName: "eth-switch",
    },
];
