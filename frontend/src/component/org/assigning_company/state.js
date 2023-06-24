import { atom } from "recoil";

export const assigningCompanyOptionSt = atom({
    key: "assigningCompanyOption",
    default: {
        company: [],
        staff: []
    }
});
