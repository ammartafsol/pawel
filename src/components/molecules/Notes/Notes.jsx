"use client";
import React from "react";
import classes from "./Notes.module.css";
import { RxDotsVertical } from "react-icons/rx";
import { usePathname } from "next/navigation";
import Button from "@/components/atoms/Button";
import { MdAddCircle } from "react-icons/md";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import AddNoteModal from "@/components/organisms/Modals/AddNoteModal/AddNoteModal";

const Notes = ({searchValue,setSearchValue,showAddNoteModal,setShowAddNoteModal}) => {
  const pathname = usePathname();
  return (
    <div className={`${classes.notesWrapper}`}>
      <div className={classes.notesContainer}>
        <div className={`${classes.notesHeader} ${pathname.includes('case-management') && classes.gapTop}`}>
          <h4>Notes</h4>
          {
            pathname.includes('case-management')?
            <div className={classes.notesHeaderRight}>
              <Button 
                label="Add a note" 
                className={classes.addNoteButton} 
                leftIcon={<MdAddCircle color="var(--white)" size={20} />}
                onClick={() => setShowAddNoteModal?.(true)}
              />
              <SearchInput value={searchValue} setValue={setSearchValue} inputClass={classes.inputClass} />
            </div>
            :
            <RxDotsVertical cursor={"pointer"} size={24} color="#0D93FF" />


          }
        </div>
        <p>
          Figma ipsum component variant main layer. Boolean plugin project
          comment subtract figjam editor arrange frame team.
        </p>
        <div className={classes.notesFooter}>
            <h6>12/29/2023</h6>
            <p>10:20</p>
        </div>
      </div>
      <AddNoteModal show={showAddNoteModal} setShow={setShowAddNoteModal} />
    </div>
  );
};

export default Notes;
