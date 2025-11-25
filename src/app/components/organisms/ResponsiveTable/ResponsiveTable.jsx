"use client";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import Pagination from "@/components/molecules/Pagination/Pagination";
import TableSkeleton from "@/components/molecules/TableSkeleton";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import clsx from "clsx";
import classes from "./ResponsiveTable.module.css";

export default function ResponsiveTable({
  rowClassName = "",
  data = [],
  tableHeader = [],
  loading = false,
  noDataText = "Data not found",
  renderTableHeader = null,
  hasPagination,
  renderItem,
  ...props
}) {
  return (
    <>
      <div className={clsx(classes.tableWrapper)}>
        <table className={clsx(classes.responsiveTable)}>
          <thead className={clsx(classes.tableHeader)}>
            <tr>
              {tableHeader?.map((item, index) => (
                <th
                  key={index}
                  style={{ ...(item?.style && item.style) }}
                  className={clsx(item?.headerClass)}
                >
                  {renderTableHeader
                    ? renderTableHeader({ item, index })
                    : item?.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={classes.tableBody}>
            {loading ? (
              <TableSkeleton rowsCount={RECORDS_LIMIT} colsData={tableHeader} />
            ) : data?.length ? (
              data?.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={clsx(classes.bodyRow, rowClassName)}
                >
                  {tableHeader?.map(
                    ({ key, style, title, renderValue }, colIndex) => (
                      <td key={colIndex} style={{ ...style }}>
                        <div style={{ width: "100%" }}>
                          {renderItem
                            ? renderItem({
                                item: item[key],
                                data: item,
                                colIndex,
                                rowIndex,
                                key,
                                title,
                                renderValue,
                              })
                            : renderValue
                            ? renderValue(item[key], item)
                            : item[key]}
                        </div>
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeader.length}>
                  <NoDataFound text={noDataText} size="small" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasPagination && <Pagination {...props} />}
    </>
  );
}
