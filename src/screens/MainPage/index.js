import React from "react";
import ImageCaptcha from "./Components/ImageCaptcha";
import styles from "./MainPage.module.scss";
const MainPage = (props) => {
  return (
    <div className={styles.container}>
      <ImageCaptcha />
    </div>
  );
};

export default MainPage;
