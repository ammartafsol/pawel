"use client";
import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import classes from "./Notes.module.css";
import { RxDotsVertical } from "react-icons/rx";
import { usePathname } from "next/navigation";
import Button from "@/components/atoms/Button";
import { MdAddCircle } from "react-icons/md";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import AddNoteModal from "@/components/organisms/Modals/AddNoteModal/AddNoteModal";
import useAxios from "@/interceptor/axios-functions";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import VisibilityBadge from "@/components/atoms/VisibilityBadge/VisibilityBadge";

const Notes = ({searchValue, setSearchValue, showAddNoteModal, setShowAddNoteModal, caseNotes = [], slug, onNoteCreated}) => {
  const pathname = usePathname();
  const { Post } = useAxios();
  const [loading, setLoading] = useState('');
  
  // Filter notes based on search value
  const filteredNotes = useMemo(() => {
    if (!searchValue) return caseNotes;
    const searchLower = searchValue.toLowerCase();
    return caseNotes.filter(note => 
      note.title?.toLowerCase().includes(searchLower) ||
      note.description?.toLowerCase().includes(searchLower)
    );
  }, [caseNotes, searchValue]);

  const formatNoteDate = (dateString) => {
    if (!dateString) return { date: "", time: "" };
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
    return { date: dateStr, time: timeStr };
  };


  const handleSubmit = async (values) => {
    setLoading("loading");
    const obj = {
      title: values.noteTitle,
      description: values.description,
      permissions: values.permissible || [],
    }
    const { response } = await Post({
      route: `case-note/create/${slug}`,
      data: obj,
    });
    if (response) {
      onNoteCreated(response.data);
      setShowAddNoteModal(false);
    }
    setLoading("");
  }

  return (
    <div className={`${classes.notesWrapper}`}>
      {/* Header with Add Note button and Search - shown once */}
      {pathname.includes('case-management') && (
        <div className={`${classes.notesHeader} ${classes.gapTop}`}>
          <h5>Notes</h5>
          <div className={classes.notesHeaderRight}>
            <Button 
              label="Add a note" 
              className={classes.addNoteButton} 
              leftIcon={<MdAddCircle color="var(--white)" size={20} />}
              onClick={() => setShowAddNoteModal?.(true)}
            />
            <SearchInput value={searchValue} setValue={setSearchValue} inputClass={classes.inputClass} />
          </div>
        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <div className={classes.notesList}>
          {filteredNotes.map((note) => {
            const { date, time } = formatNoteDate(note.createdAt);
            return (
              <div key={note._id} className={classes.notesContainer}>
              <div className={classes.notesHeader}>
                <h4>{note.title || "Untitled Note"}</h4>
                {!pathname.includes('case-management') && (
                  <RxDotsVertical cursor={"pointer"} size={24} color="#0D93FF" />
                )}
              </div>
              <p>{note.description || ""}</p>
              <div className={classes.notesFooter}>
                <h6>{date}</h6>
                <p>{time}</p>
                <VisibilityBadge 
                  permissions={note.permissions || []} 
                  className={classes.visibilityBadgesContainer}
                />
              </div>
              </div>
            );
          })}
        </div>
      ) : (
        <NoDataFound className={classes.noDataFound} text="No notes found" />
      )}
      <AddNoteModal 
        show={showAddNoteModal} 
        loading={loading} 
        setShow={(show) => {
          setShowAddNoteModal(show);
          if (!show) {
            // Reset search when modal closes
            setSearchValue("");
          }
        }} 
        handleSubmit={handleSubmit} 
      />
    </div>
  );
};

Notes.propTypes = {
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func.isRequired,
  showAddNoteModal: PropTypes.bool,
  setShowAddNoteModal: PropTypes.func.isRequired,
  caseNotes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      permissions: PropTypes.arrayOf(PropTypes.string),
      createdAt: PropTypes.string,
    })
  ),
  slug: PropTypes.string.isRequired,
  onNoteCreated: PropTypes.func.isRequired,
};

Notes.defaultProps = {
  searchValue: "",
  showAddNoteModal: false,
  caseNotes: [],
};

export default Notes;
