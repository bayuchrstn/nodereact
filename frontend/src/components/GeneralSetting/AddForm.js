import React, { useState, useEffect } from "react";
import { FormGroup, Form, Label, Input, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { postSettingCreate, putSettingUpdate } from "../../actions/getsetAction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddForm = (props) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");

  const dispatch = useDispatch();
  const { addSettingResult, getSettingDetail, getResponDataSetting } =
    useSelector((state) => state.getset);

  useEffect(() => {
    if (getSettingDetail) {
      setId(getSettingDetail.id);
      setName(getSettingDetail.name);
      setValue(getSettingDetail.value);
      setDesc(getSettingDetail.desc);
    }
  }, [getSettingDetail, dispatch]);

  useEffect(() => {
    if (getResponDataSetting) {
      setId("");
      setName("");
      setValue("");
      setDesc("");
    }
  }, [getResponDataSetting, dispatch]);

  useEffect(() => {
    if (addSettingResult) {
      setId("");
      setName("");
      setValue("");
      setDesc("");
    }
  }, [addSettingResult, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (id) {
      dispatch(
        putSettingUpdate({ id: id, name: name, value: value, desc: desc })
      );
    } else {
      dispatch(postSettingCreate({ name: name, value: value, desc: desc }));
    }
  };

  return (
    <Form onSubmit={(event) => handleSubmit(event)}>
      <ToastContainer autoClose={1000} />
      <FormGroup>
        <Label for="formName">Name</Label>
        <Input
          type="text"
          name="name"
          value={name}
          id="setting_name"
          placeholder="Input Nama Setting"
          onChange={(event) => setName(event.target.value)}
          required="required"
        />
      </FormGroup>
      <FormGroup>
        <Label for="forValue">Value</Label>
        <Input
          type="text"
          name="value"
          value={value}
          id="setting_value"
          placeholder="Input Value"
          onChange={(event) => setValue(event.target.value)}
          required="required"
        />
      </FormGroup>
      <FormGroup>
        <Label for="forValue">Description</Label>
        <Input
          type="text"
          name="desc"
          value={desc}
          id="setting_desc"
          placeholder="Input Deskripsi"
          onChange={(event) => setDesc(event.target.value)}
        />
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
  );
};

export default AddForm;
