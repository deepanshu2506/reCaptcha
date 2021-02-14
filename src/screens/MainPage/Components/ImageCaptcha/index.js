import styles from "./styles.module.scss";
import { Button, Fade } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { useEffect, useState } from "react";
import _ from "lodash";
import { get } from "../../../../utils/requests";
import { searchAPI, randomAPI } from "../../../../utils/endpoints";
const categories = [
  "bird",
  "tiger",
  "horse",
  "cat",
  "dog",
  "building",
  "traffic Light",
];
const Header = ({ category, ...props }) => {
  return (
    <div className={styles.header}>
      <h3>Select all squares with</h3>
      <h1> {category}</h1>
      <p>If there are none click done.</p>
    </div>
  );
};

const SelectableImage = ({ url, selected, onSelect, onDeselect }) => {
  return (
    <div
      className={styles.selectableImage}
      onClick={selected ? onDeselect : onSelect}
    >
      <img src={url} alt="img" />
      <Fade in={selected} mountOnEnter unmountOnExit>
        <div className={styles.overlay}>
          <Check style={{ color: "white" }} />
        </div>
      </Fade>
    </div>
  );
};

const Body = ({ children }) => {
  return <div className={styles.captchaBody}>{children}</div>;
};

const Footer = ({ onSubmit }) => {
  return (
    <div className={styles.footer} disableElevation>
      <Button variant="contained" onClick={onSubmit} color="primary">
        Verify
      </Button>
    </div>
  );
};

const ImageCaptcha = (props) => {
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(new Array(9).fill(false));
  useEffect(() => {
    const randomCategoryIndex = _.random(categories.length);
    setCategory(categories[randomCategoryIndex]);
  }, []);

  useEffect(() => {
    const getImages = async (numTrueImages, numFalseImages) => {
      const trueImeagesResponse = get(searchAPI, {
        query: category,
        orientation: "square",
        size: "small",
        per_page: numTrueImages,
      });
      const falseImagesResponse = get(randomAPI, { per_page: numFalseImages });
      try {
        const [
          { photos: trueImages },
          { photos: falseImages },
        ] = await Promise.all([trueImeagesResponse, falseImagesResponse]);
        const trueImageUrls = trueImages.map((image) => ({
          isValid: true,
          src: image.src.small,
        }));
        const falseImageUrls = falseImages.map((image) => ({
          isValid: false,
          src: image.src.small,
        }));
        setImages(_.shuffle([...trueImageUrls, ...falseImageUrls]));
      } catch (err) {
        console.log(err);
      }
    };
    if (category !== "") {
      const numTrueImages = _.random(0, 9);
      const numFalseImages = 9 - numTrueImages;
      getImages(numTrueImages, numFalseImages);
    }
  }, [category]);

  const onSelect = (id) => () => {
    setSelected((prev) => {
      prev[id] = true;
      return [...prev];
    });
  };
  const onDeselect = (id) => () => {
    setSelected((prev) => {
      prev[id] = false;
      return [...prev];
    });
  };
  const onSubmit = () => {
    let isInvalid = false;
    console.log(images, selected);
    for (let i = 0; i < selected.length; i++) {
      if (images[i].isValid !== selected[i]) {
        isInvalid = true;
        break;
      }
    }
    if (isInvalid) {
      alert("Captcha failed");
    } else {
      alert("Captcha passes");
    }
  };
  return (
    <div className={styles.captchaContainer}>
      <Header category={category} />
      <Body>
        {images.map((img, idx) => (
          <SelectableImage
            url={img.src}
            selected={selected[idx]}
            onSelect={onSelect(idx)}
            onDeselect={onDeselect(idx)}
          />
        ))}
      </Body>

      <Footer onSubmit={onSubmit} />
    </div>
  );
};

export default ImageCaptcha;
