import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ IsUpload, percentUpLoaded }) => {
    let percentage = null;
    if (IsUpload === "uploading") {
        percentage = (<Progress
            className="progress__bar"
            percent={percentUpLoaded}
            progress
            indicating
            size="medium" />)
    }
    return (
        <>
            { percentage}
        </>
    )


};

export default ProgressBar;