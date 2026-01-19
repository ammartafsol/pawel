"use client";
import React, { useState, useEffect, useCallback } from "react";
import classes from "./DocumentManagementTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import { gridFilter } from "@/developementContent/Enums/enum";
import { documentManagementTableHeader } from "@/developementContent/TableHeader/DocumentManagementTableHeader";
import { GoQuestion } from "react-icons/go";
import { Col, Row } from "react-bootstrap";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import DocCard from "@/components/atoms/DocCard/DocCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { mergeClass } from "@/resources/utils/helper";
import useDebounce from "@/resources/hooks/useDebounce";
import useAxios from "@/interceptor/axios-functions";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { Skeleton } from "@mui/material";
import UploadDocumentModal from "@/components/organisms/Modals/UploadDocumentModal/UploadDocumentModal";

const DocumentManagementTemplate = () => {
  const [activeGridFilter, setActiveGridFilter] = useState(gridFilter[0]);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [status, setStatus] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { Get } = useAxios();

  const handleFilterClick = () => {
    // Filter functionality can be implemented here
  };

  const handleUploadDocument = () => {
    setShowUploadModal(true);
  };

  const handleUploadComplete = (files) => {

    getDocumentData({ _status: status, _page: page });
  };

  const filterOptions = [
    {
      label: "All",
      value: "",
      onClick: () => {
        setStatus("");
        setPage(1);
      },
    },
    {
      label: "TM Opposition",
      value: "tm-opposition",
      onClick: () => {
        setStatus("tm-opposition");
        setPage(1);
      },
    },
    {
      label: "Design invalidation",
      value: "design-invalidation",
      onClick: () => {
        setStatus("design-invalidation");
        setPage(1);
      },
    },
    {
      label: "Privacy Violations",
      value: "privacy-violations",
      onClick: () => {
        setStatus("privacy-violations");
        setPage(1);
      },
    },
    {
      label: "Employment Disputes",
      value: "employment-disputes",
      onClick: () => {
        setStatus("employment-disputes");
        setPage(1);
      },
    },
  ];

  const transformDocumentData = useCallback((apiData = []) => {
    return apiData.map((item) => {
      const caseData = item.case || {};
      const client = caseData.client || {};
      const deadlines = Array.isArray(caseData.deadlines)
        ? caseData.deadlines
        : [];
      const lastDeadline =
        deadlines.length > 0 ? deadlines[deadlines.length - 1] : {};

      return {
        id: item._id,
        slug: item.slug,
        clientName: client.fullName || "Unknown Client",
        typeOfCase: caseData.status || "Unknown Type",
        documentName: item.fileName || "Document",
        tradeMarkNo: caseData.trademarkNumber || "-",
        dateUploaded: item.createdAt || null,
        internalDeadline: lastDeadline.deadline || null,
        officeDeadline: lastDeadline.officeActionDeadline || null,
      };
    });
  }, []);

  const getDocumentData = useCallback(
    async ({ _status, _page }) => {
      setLoading("loading");
      const currentPage = _page !== undefined ? _page : page;
      const query = {
        search: debouncedSearch,
        page: currentPage,
        limit: RECORDS_LIMIT,
        status: _status !== undefined ? _status : status,
      };
      const queryString = new URLSearchParams(query).toString();
      const { response } = await Get({
        route: `case-document/all?${queryString}`,
        showAlert: false,
      });
      if (response) {
        const transformed = transformDocumentData(response?.data || []);
        setData(transformed || []);
        setTotalRecords(response.totalRecords || 0);
        if (_page !== undefined) {
          setPage(_page);
        }
      }
      setLoading("");
    },
    [Get, debouncedSearch, page, status, transformDocumentData]
  );

  useEffect(() => {
    getDocumentData({ _status: status, _page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status]);

  return (
    <div className="p24">
      <Wrapper
        headerComponent={
          <>
            <TableHeader
              title="Document Management"
              titleIcon={<GoQuestion color="#D9D9D9" size={24} />}
              searchValue={searchValue}
              onSearchChange={(value) => {
                setPage(1);
                setSearchValue(value);
              }}
              searchPlaceholder="Search..."
              onFilterClick={handleFilterClick}
              filterOptions={filterOptions}
              viewButtonText="Upload Document"
              onClickViewAll={handleUploadDocument}
              gridFilter={gridFilter}
              activeGridFilter={activeGridFilter}
              setActiveGridFilter={setActiveGridFilter}
              gridFilterClassName={classes.gridFilter}
            />
          </>
        }
        contentClassName={classes.contentClassName}
      >
        {activeGridFilter.value === "table" ? (
          <ResponsiveTable
            tableHeader={documentManagementTableHeader}
            data={data}
            loading={loading === "loading"}
            pagination={true}
            page={page}
            totalRecords={totalRecords}
            onPageChange={(newPage) => {
              getDocumentData({ _status: status, _page: newPage });
            }}
          />
        ) : (
          <>
            {loading === "loading" ? (
              <Row className={mergeClass("g-4", classes.docCardRow)}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Col className="col-12 col-md-4" key={`skeleton-${index}`}>
                    <div className={classes.skeletonCard}>
                      <div className={classes.skeletonContent}>
                        <Skeleton
                          variant="rectangular"
                          width={58}
                          height={52}
                          sx={{ borderRadius: "8px" }}
                        />
                        <div className={classes.skeletonDetails}>
                          <Skeleton
                            variant="text"
                            width="80%"
                            height={20}
                            sx={{ marginBottom: "8px" }}
                          />
                          <Skeleton
                            variant="text"
                            width="60%"
                            height={16}
                            sx={{ marginBottom: "12px" }}
                          />
                          <Skeleton
                            variant="text"
                            width="90%"
                            height={14}
                            sx={{ marginBottom: "6px" }}
                          />
                          <Skeleton
                            variant="text"
                            width="85%"
                            height={14}
                            sx={{ marginBottom: "6px" }}
                          />
                          <Skeleton
                            variant="text"
                            width="75%"
                            height={14}
                            sx={{ marginBottom: "6px" }}
                          />
                          <Skeleton
                            variant="text"
                            width="80%"
                            height={14}
                          />
                        </div>
                      </div>
                      <Skeleton
                        variant="circular"
                        width={24}
                        height={24}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <>
                <Row className={mergeClass("g-4", classes.docCardRow)}>
                  {data?.map((item) => (
                    <Col className="col-12 col-md-4" key={item.id}>
                      <DocCard
                        title={item.documentName}
                        dateTime={item.dateUploaded}
                        clientName={item.clientName}
                        trademarkNo={item.tradeMarkNo}
                        caseType={item.typeOfCase}
                        isDetailedVariant={true}
                      />
                    </Col>
                  ))}
                </Row>
                {totalRecords > RECORDS_LIMIT && (
                  <div className={classes.paginationWrapper}>
                    <Pagination
                      currentPage={page || 1}
                      totalRecords={totalRecords}
                      limit={RECORDS_LIMIT}
                      onPageChange={(newPage) => {
                        getDocumentData({ _status: status, _page: newPage });
                      }}
                      totalTextLabel="Documents"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Wrapper>
      <UploadDocumentModal
        show={showUploadModal}
        setShow={setShowUploadModal}
        onUpload={handleUploadComplete}
        getDocumentData
      />
    </div>
  );
};

export default DocumentManagementTemplate;
