import * as React from "react";
import { lazy, useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { useLocale } from "ttag";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { localeSt } from "src/states";
import PrivateRoute from "component/common/route/private_route.jsx";
import NotMatch from "component/common/route/not_match";
import ScrollToTop from "component/common/scroll_to_top";
import Waiting from "component/common/waiting";
import Spinner from "component/common/spinner";
import BlankLayout from "component/common/layout/blank";
import MainLayout from "component/common/layout/main";
import WorkLayout from "component/common/layout/work";
import RequestUtil from "util/request_util";
import LocaleUtil from "util/locale_util";

RequestUtil.responseIntercept();
const lazyImport = (Component) => (props) => {
    return (
        <React.Suspense fallback={<Waiting />}>
            <Component {...props} />
        </React.Suspense>
    );
};

const Home = lazyImport(lazy(() => import("component/home")));
const Login = lazyImport(lazy(() => import("component/auth/login")));
const Profile = lazyImport(lazy(() => import("component/account/profile")));
const EmployeeCrud = lazyImport(lazy(() => import("component/account/employee/crud")));
const Group = lazyImport(lazy(() => import("component/role/group")));
const Variable = lazyImport(lazy(() => import("component/config/variable")));
const Admin = lazyImport(lazy(() => import("component/account/admin")));
const Staff = lazyImport(lazy(() => import("component/account/staff")));
const ChatMessage = lazyImport(lazy(() => import("component/support/chat_message")));
const Position = lazyImport(lazy(() => import("component/org/position")));
const Employee = lazyImport(lazy(() => import("component/org/employee")));
const Company = lazyImport(lazy(() => import("component/org/company")));
const SalaryPolicy = lazyImport(lazy(() => import("component/document/salary_policy")));
const SalaryRecord = lazyImport(lazy(() => import("component/document/salary_record")));
const TaxRecord = lazyImport(lazy(() => import("component/document/tax_record")));
const InsuranceRecord = lazyImport(
    lazy(() => import("component/document/insurance_record"))
);
const AssigningCompany = lazyImport(
    lazy(() => import("component/org/assigning_company"))
);
const CompanyDetail = lazyImport(lazy(() => import("component/org/company/detail")));

function Index() {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [locale, setLocale] = useRecoilState(localeSt);
    useLocale(locale);
    useEffect(() => {
        LocaleUtil.fetchLocales().then(() => {
            setDataLoaded(true);
            setLocale(LocaleUtil.setLocale(locale));
        });
    }, []);
    if (!dataLoaded) {
        return <div>Loading...</div>;
    }
    return (
        <div key={locale}>
            <Spinner />
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<BlankLayout />}>
                        <Route path="" element={<Home />} />
                        <Route path="login" element={<Login />} />
                    </Route>
                    <Route path="/app" element={<PrivateRoute />}>
                        <Route path="" element={<MainLayout />}>
                            <Route path="profile" element={<Profile />} />
                            <Route path="account/employee" element={<EmployeeCrud />} />
                            <Route path="role/group" element={<Group />} />
                            <Route path="config/variable" element={<Variable />} />
                            <Route path="account/admin" element={<Admin />} />
                            <Route path="account/staff" element={<Staff />} />
                            <Route
                                path="support/chat-message/:companyUid?"
                                element={<ChatMessage />}
                            />
                            <Route path="org/position" element={<Position />} />
                            <Route path="org/employee" element={<Employee />} />
                            <Route path="org/company" element={<Company />} />
                            <Route
                                path="org/assigning-company"
                                element={<AssigningCompany />}
                            />
                        </Route>
                    </Route>
                    <Route path="/app/work/:id" element={<PrivateRoute />}>
                        <Route path="" element={<WorkLayout />}>
                            <Route path="org/company" element={<CompanyDetail />} />
                            <Route path="org/position" element={<Position />} />
                            <Route path="org/employee" element={<Employee />} />
                            <Route
                                path="document/salary-policy"
                                element={<SalaryPolicy />}
                            />
                            <Route
                                path="document/salary-record"
                                element={<SalaryRecord />}
                            />
                            <Route path="document/tax-record" element={<TaxRecord />} />
                            <Route
                                path="document/insurance-record"
                                element={<InsuranceRecord />}
                            />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotMatch />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

function App() {
    return (
        <RecoilRoot>
            <Index />
        </RecoilRoot>
    );
}

export default App;
