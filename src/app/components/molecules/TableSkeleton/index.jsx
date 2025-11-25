import { Skeleton } from "@mui/material";
import React from "react";
import classes from "./TableSkeleton.module.css";

function TableSkeleton({ rowsCount = 10, colsCount = 5 }) {
  const rows = Array(rowsCount).fill(0);
  const cols = Array(colsCount).fill(0);

  return (
    <>
      <style>{`
           .tr{
                all:unset;
                display:flex;
            }
            `}</style>
      <div className={` ${classes.tableSkeleton}`}>
        <div className="">
          <table>
            <tbody>
              {rows?.map((item, index) => (
                <tr key={index} className="tr">
                  {cols?.map((item, idx) => (
                    <td
                      key={idx}
                      style={{
                        width: `${100 / colsCount}%`,
                        paddingBlock: "0px",
                        marginBottom: "10px",
                      }}
                    >
                      <Skeleton height={"45px"} variant="rectangular" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TableSkeleton;
