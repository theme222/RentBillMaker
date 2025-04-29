import React from "react";

export type ReactState<t> = React.Dispatch<React.SetStateAction<t>>;
export type ReactRef<t> = React.RefObject<t>;
