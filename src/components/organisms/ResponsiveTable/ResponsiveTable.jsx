"use client";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import Pagination from "@/components/molecules/Pagination";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { imageUrl, mergeClass } from "@/resources/utils/helper";
import Image from "next/image";
import classes from "./ResponsiveTable.module.css";

export default function ResponsiveTable({
  onRowClick = () => {},
  onKeyClick = () => {},
  rowClassName = "",
  data = [],
  tableHeader = [],
  loading = false,
  noDataText = "Data not found",
  renderTableHeader = null,
  pagination = false,
  page,
  totalRecords,
  onPageChange,
  actions = [],
  actionStyles = {},
}) {
  return (
    <>
      <div className={mergeClass(classes.tableWrapper)}>
        <table className={mergeClass(classes.responsiveTable)}>
          <thead className={mergeClass(classes.tableHeader)}>
            <tr>
              {tableHeader?.map((item, index) => (
                <th
                  key={index}
                  style={item.style || {}}
                  className={mergeClass(item?.headerClass)}
                >
                  {renderTableHeader
                    ? renderTableHeader({ item, index })
                    : item?.title}
                </th>
              ))}
              {actions?.length > 0 && (
                <th style={{ ...actionStyles }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody className={classes.tableBody}>
            {loading ? (
              <tr>
                <td colSpan={tableHeader.length + (actions.length ? 1 : 0)}>
                  <SpinnerLoading />
                </td>
              </tr>
            ) : data?.length ? (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={mergeClass(classes.bodyRow, rowClassName)}
                  onClick={() => onRowClick(item, rowIndex)}
                >
                  {tableHeader?.map(
                    ({ key, style, title, renderItem, image }, colIndex) => (
                      <td key={colIndex} style={style || {}}>
                        <div
                          className={image ? classes.imageContainer : ""}
                          style={{ width: "100%" }}
                        >
                          {image ? (
                            <Image
                              src={imageUrl(
                                item[key] ||
                                  "/images/app-images/imageFallback.png"
                              )}
                              alt="image"
                              fill
                            />
                          ) : renderItem ? (
                            renderItem({
                              onClick: () => onKeyClick(item, key),
                              item: item[key],
                              data: item,
                              colIndex,
                              rowIndex,
                              key,
                              title,
                            })
                          ) : (
                            item[key] || "NA"
                          )}
                        </div>
                      </td>
                    )
                  )}
                  {actions?.length > 0 && (
                    <td style={{ ...actionStyles }}>
                      <div className={classes.actionContainer}>
                        {actions.map((action, index) => (
                          <div
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              action?.onClick({ data: item });
                            }}
                          >
                            {action?.renderItem?.({ data: item })}
                          </div>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeader.length + (actions.length ? 1 : 0)}
                  style={{ textAlign: "center" }}
                >
                  <NoDataFound text={noDataText} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalRecords > RECORDS_LIMIT && (
        <Pagination
          currentPage={page || 1}
          totalRecords={totalRecords}
          limit={RECORDS_LIMIT}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
