import { atom } from "recoil";

export const employeeOptionSt = atom({
    key: "employeeOption",
    default: {
        contractType: {},
        educationLevel: {},
        labourStatus: {},
        gender: {}
    }
});
