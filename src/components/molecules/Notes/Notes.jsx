"use client";
import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import classes from "./Notes.module.css";
import { RxDotsVertical } from "react-icons/rx";
import { usePathname } from "next/navigation";
import Button from "@/components/atoms/Button";
import { MdAddCircle } from "react-icons/md";
import AddNoteModal from "@/components/organisms/Modals/AddNoteModal/AddNoteModal";
import useAxios from "@/interceptor/axios-functions";
import { FiEdit } from "react-icons/fi";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import VisibilityBadge from "@/components/atoms/VisibilityBadge/VisibilityBadge";

const Notes = ({ showAddNoteModal, setShowAddNoteModal, caseNotes = [], slug, onNoteCreated, onNoteUpdated }) => {
  const pathname = usePathname();

  const { Post, Patch } = useAxios();
  const [loading, setLoading] = useState("");
  const [editingNote, setEditingNote] = useState(null);



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

  const handleEditSubmit = async (values) => {
    if (!editingNote?._id) return;
    setLoading("loading");
    const obj = {
      title: values.noteTitle,
      description: values.description,
      permissions: values.permissible || [],
    };
    const { response } = await Patch({
      route: `case-note/update/${editingNote._id}`,
      data: obj,
      showAlert: true,
    });
    if (response?.data && onNoteUpdated) {
      onNoteUpdated(response.data);
      setShowAddNoteModal(false);
      setEditingNote(null);
    }
    setLoading("");
  };

  return (
    <div className={`${classes.notesWrapper}`}>
            {/* Header with Add Note button - only when there are no notes yet */}

      {pathname.includes('case-management') && (
        <div className={`${classes.notesHeader} ${classes.gapTop}`}>
          <h5>Notes</h5>
          {caseNotes.length === 0 && (
            <div className={classes.notesHeaderRight}>
              <Button 
                label="Add a note" 
                className={classes.addNoteButton} 
                leftIcon={<MdAddCircle color="var(--white)" size={20} />}
                onClick={() => setShowAddNoteModal?.(true)}
              />
            </div>
          )}
        </div>
      )}

      {/* Notes List */}
      {caseNotes.length > 0 ? (
        caseNotes.map((note) => {
          const { date, time } = formatNoteDate(note.createdAt);
          return (
            <div key={note._id} className={classes.notesContainer}>
              <div className={classes.notesHeader}>
                <h4>{note.title || "Untitled Note"}</h4>
                {pathname.includes("case-management") ? (
                  <button
                    type="button"
                    className={classes.editIconButton}
                    onClick={() => {
                      setEditingNote(note);
                      setShowAddNoteModal?.(true);
                    }}
                    aria-label="Edit note"
                  >
                    <FiEdit size={20} color="#0D93FF" />
                  </button>
                ) : (
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
        })
      ) : (
        <NoDataFound className={classes.noDataFound} text="No notes found" />
      )}
      <AddNoteModal 
        show={showAddNoteModal}
        loading={loading}
        setShow={(show) => {
          setShowAddNoteModal(show);
          if (!show) setEditingNote(null);
        }}
        handleSubmit={editingNote ? handleEditSubmit : handleSubmit}
        isEditMode={!!editingNote}
        initialData={editingNote ?? undefined}
      />
    </div>
  );
};

Notes.propTypes = {
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
  onNoteUpdated: PropTypes.func,
};

Notes.defaultProps = {
  showAddNoteModal: false,
  caseNotes: [],
  onNoteUpdated: undefined,
};

export default Notes;
