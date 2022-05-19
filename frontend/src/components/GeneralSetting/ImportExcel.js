import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Col, Input, FormText } from "reactstrap";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { importSetting, getSettingsList } from "../../actions/getsetAction";

const ImportExcel = (props) => {
    const [backdrop] = useState("static");
    const [selectedFile, setSelectedFile] = useState();
    const [key, setKey] = useState();


    const dispatch = useDispatch();
    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedFile) {
            const formData = new FormData();
            formData.append("name", "file");
            formData.append("file", selectedFile);
            dispatch(importSetting(formData));
            setKey(new Date());
            setTimeout(() => {
                dispatch(getSettingsList(props.page, props.size, props.search, props.sortname, props.direction));
            }, 1000);
        }

    };

    return (
        <>
            <Modal
                isOpen={props.modal}
                toggle={props.toggle}
                size="lg"
                backdrop={backdrop}
                style={{ maxWidth: "900px", width: "100%" }}
            >
                <ModalHeader>Import Excel</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(event) => handleSubmit(event)}>
                        <FormGroup row>
                            <Label for="exampleFile" sm={2}>File</Label>
                            <Col sm={10}>
                                <Input type="file" name="file" id="exampleFile" key={key}
                                    onChange={(event) => setSelectedFile(event.target.files[0])} />
                                <FormText color="muted">
                                    Hanya File Excel Yang Bisa Di Upload
                                </FormText>
                            </Col>
                        </FormGroup>
                        <div className="float-right">
                            <Button color="primary" className="m-2" type="submit">
                                Submit
                            </Button>
                            <Button color="danger" onClick={props.toggle}>
                                Close
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
};

export default connect()(ImportExcel);
