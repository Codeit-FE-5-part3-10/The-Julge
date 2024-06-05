import styles from "./Footer.module.scss";
import classNames from "classnames/bind";
import { forwardRef } from "react";
import emailIcon from "public/images/footer-envelope.svg";
import faceBookIcon from "public/images/footer-facebook.svg";
import instagramIcon from "public/images/footer-instagram.svg";
import Image from "next/image";

const cx = classNames.bind(styles);

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className={cx("container")}>
      <div className={cx("items")}>
        <span className={cx("copyright")}>©codeit - 2023</span>
        <div className={cx("links")}>
          <a className={cx("link")}>Privacy Policy</a>
          <a className={cx("link")}>FAQ</a>
        </div>
        <div className={cx("sns")}>
          <a href="" target="_blank" rel="noopener noreferrer">
            <Image src={emailIcon} alt="이메일 연결 로고" />
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={faceBookIcon}
              alt="facebook 페이지로 연결된 facebook 로고"
            />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={instagramIcon}
              alt="instagram 홈페이지로 연결된 instagram 로고"
            />
          </a>
        </div>
      </div>
    </footer>
  );
});
