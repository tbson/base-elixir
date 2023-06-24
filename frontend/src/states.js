import { atom } from "recoil";
import LocaleUtil from "util/locale_util";

export const localeSt = atom({
    key: "locale",
    default: LocaleUtil.getLocale()
});
