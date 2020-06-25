import React, { useState, useEffect, useRef } from "react";
import uploadImg from "../images/file-upload.png";
import { useHistory } from "react-router-dom";
import axios from "axios";

const NewletterForm = () => {
  const [mainImage, setMainImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sampleText, setSampletext] = useState("");
  const [buttonState, setButtonState] = useState(true);
  const [imageInText, setImageInText] = useState(null);
  const [resMainImage, setResMainImage] = useState("");
  const [resTextImage, setResTextImage] = useState("");
  const [addText, setAddText] = useState("");

  const sampleInput = useRef(null);
  const history = useHistory();

  const submit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:9000/create", {
        image: resMainImage,
        title,
        description,
        sampleText: sampleText,
      })
      .then((res) => {
        if (res.data.message === "success") {
          history.push({
            pathname: "/pay",
            state: { title, description, mainImage, sampleText },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (title && description && sampleText && mainImage) {
      setButtonState(false);
      return;
    }
    setButtonState(true);
    return;
  }, [mainImage, title, description, sampleText]);

  const uploadImage = (image) => {
    if (image) {
      const data = new FormData();
      data.append("file", image);

      axios
        .post("http://localhost:9000/image-upload", data)
        .then((res) => {
          setResMainImage(res.data.path);
        })
        .catch((err) => console.log(err));

      setMainImage(image);
    }
  };

  const uploadImageInText = (image) => {
    if (image) {
      const data = new FormData();
      data.append("file", image);

      axios
        .post("http://localhost:9000/image-upload", data)
        .then((res) => {
          setResTextImage(res.data.path);
          setAddText(res.data.path);
        })
        .catch((err) => console.log(err));
      setImageInText(image);
    }
    console.log(imageInText);
  };

  const handleAddToText = () => {
    if (resTextImage) {
      let newString = sampleText + resTextImage + " ";
      setSampletext(newString);
      sampleInput.current.focus();
      setResTextImage("");
      setAddText("");
      return;
    }

    let newString = sampleText + addText + " ";
    setSampletext(newString);
    setAddText("");
    sampleInput.current.focus();
  };

  let btnStyle = {};
  if (buttonState) {
    btnStyle = {
      cursor: "default",
      background: "#cccccc",
      color: "#666666",
    };
  }
  let imgStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "25px",
  };

  return (
    <form onSubmit={submit} encType="multipart/form-data">
      <div className="img-upload">
        {resMainImage ? (
          <img src={resMainImage} alt="upload button" style={imgStyle} />
        ) : (
          <label className="file">
            <img src={uploadImg} alt="upload button" />
            <input
              type="file"
              id="file"
              aria-label="File browser example"
              accept="image/x-png,image/jpeg"
              onChange={(event) => uploadImage(event.target.files[0])}
              required
            />
          </label>
        )}
      </div>
      <div className="news-form">
        <div className="input-text">
          <input
            type="text"
            name="text"
            placeholder="Title"
            minLength="1"
            maxLength="50"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
      </div>
      <textarea
        className="des"
        placeholder="Description"
        minLength="1"
        maxLength="250"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      ></textarea>
      <div className="up-box">
        <div className="icon-box">
          <button type="button">
            <label className="file">
              <i className="fa fa-picture-o" aria-hidden="true"></i>
              <input
                type="file"
                id="file"
                aria-label="File browser example"
                accept="image/x-png,image/jpeg,image/gif"
                onChange={(event) => uploadImageInText(event.target.files[0])}
              />
            </label>
          </button>
          <button>
            <i className="fa fa-link" aria-hidden="true"></i>
          </button>
        </div>
        <div className="upload-box">
          <input
            type="text"
            name="text"
            placeholder="Enter link..."
            value={addText}
            onChange={(event) => setAddText(event.target.value)}
          />
          <button
            type="button"
            onClick={handleAddToText}
            style={{ cursor: "pointer" }}
          >
            Add
          </button>
        </div>
      </div>
      <textarea
        className="text-area"
        placeholder="Enter sample text message.."
        ref={sampleInput}
        value={sampleText}
        onChange={(event) => setSampletext(event.target.value)}
        required
      ></textarea>

      <button
        className="create-btn"
        type="submit"
        disabled={buttonState}
        style={btnStyle}
      >
        Create
      </button>
    </form>
  );
};

export default NewletterForm;
