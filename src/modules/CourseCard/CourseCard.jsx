import { Link as CourseLink } from "react-router-dom";
import "./CourseCard.css";
import mainImage from "../../images/main.png"

export const CourseCard = ({
  id,
  src,
  title,
  price,
  discountedPrice,
  createdAt,
}) => {
  return (
    <CourseLink to={`/courses/${id}`} className="CourseLink">
      <div className="course-card">
        <div className="image-wrap">
          <img className="course-image" src={mainImage} alt="default" />
          {/* <img className="course-image" src={src} alt={title} /> */}
        </div>
        <div className="course-title">{title}</div>
        <div className="course-price-wrap">
          <div className="course-original-price">{price.toLocaleString()}</div>
          <div className="course-sale-price">
            {discountedPrice.toLocaleString()}원
          </div>
        </div>
        <div className="course-tags">
          <span className="tag">New</span>
          <span className="tag sale">Sale</span>
        </div>
      </div>
    </CourseLink>
  );
};
