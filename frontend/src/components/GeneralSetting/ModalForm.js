import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Col, Button } from "reactstrap";
import AddForm from "./AddForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    getResponDataSetting: state.getset.getResponDataSetting,
    errorResponDataSetting: state.getset.errorResponDataSetting,
  };
};

const ModalForm = (props) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [backdrop] = useState("static");

  return (
    <>
      <Modal
        isOpen={modal}
        toggle={toggle}
        size="lg"
        backdrop={backdrop}
        style={{ maxWidth: "900px", width: "100%" }}
      >
        <ModalHeader>{props.title}</ModalHeader>
        <ModalBody>
          <AddForm toggle={toggle} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default connect(mapStateToProps, null)(ModalForm);
