import { expect, describe, it } from "vitest";

import DateUtil from "util/date_util";

describe("timestampToDateTime", () => {
    it("happy case", () => {
        const input = 1659263878;
        const output = DateUtil.timestampToDateTime(input);
        const eput = DateUtil.strToDateTime("2022-07-31T10:37:58");
        expect(output).toStrictEqual(eput);
    });
});

describe("timestampToStr", () => {
    it("happy case", () => {
        const input = 1659263878;
        const output = DateUtil.timestampToStr(input);
        const eput = "2022-07-31T10:37:58";
        expect(output).toStrictEqual(eput);
    });
});

describe("strToDateTime", () => {
    it("happy case", () => {
        const input = "2022-07-31T10:37:58";
        const output = DateUtil.strToDateTime(input);
        const eput = new Date(2022, 6, 31, 10, 37, 58);
        expect(output).toStrictEqual(eput);
    });
    it("fail case", () => {
        const input = "2022-07-31Tabc10:37:58";
        const output = DateUtil.strToDateTime(input);
        const eput = null;
        expect(output).toBe(eput);
    });
});

describe("dateTimeToStr", () => {
    it("happy case", () => {
        const input = DateUtil.strToDateTime("2022-07-31T10:37:58");
        const output = DateUtil.dateTimeToStr(input);
        const eput = "2022-07-31T10:37:58";
        expect(output).toStrictEqual(eput);
    });
    it("fail case", () => {
        const input = "2022-07-31Tabc10:37:58";
        const output = DateUtil.dateTimeToStr(input);
        const eput = "";
        expect(output).toBe(eput);
    });
});
