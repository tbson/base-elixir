import * as React from "react";
import { useState, useEffect } from "react";
import EventUtil from "util/event_util";
import Waiting from "component/common/waiting";

export default function Spinner() {
    const [spinning, setSpinning] = useState(false);

    const eventHandler = ({ detail: spinning }) => setSpinning(spinning);

    useEffect(() => {
        EventUtil.event.listen("TOGGLE_SPINNER", eventHandler);
        return () => {
            EventUtil.event.remove("TOGGLE_SPINNER", eventHandler);
        };
    }, []);

    return spinning ? <Waiting /> : null;
}
