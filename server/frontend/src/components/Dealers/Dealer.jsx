import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from "../Header/Header";

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null);

  const { id } = useParams();

  // Corrected URL to point to the working endpoint
  const dealer_url = `https://officialtrac-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/fetchDealer/${id}`;
  const reviews_url = `/djangoapp/reviews/dealer/${id}`;
  const post_review_url = `/postreview/${id}`;

  const getDealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const data = await res.json();
      if (data.status === 200) {
        setDealer(data.dealer);
      } else {
        console.error("Failed to fetch dealer details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching dealer details:", error);
    }
  };

  const getReviews = async () => {
    try {
      const res = await fetch(reviews_url, { method: "GET" });
      const data = await res.json();
      if (data.status === 200) {
        if (data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          setUnreviewed(true);
        }
      } else {
        console.error("Failed to fetch reviews:", data.message);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const sentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return positive_icon;
      case "negative":
        return negative_icon;
      default:
        return neutral_icon;
    }
  };

  useEffect(() => {
    getDealer();
    getReviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review_url}>
          <img
            src={review_icon}
            style={{ width: "10%", marginLeft: "10px", marginTop: "10px" }}
            alt="Post Review"
          />
        </a>
      );
    }
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        {dealer && dealer.full_name ? (
          <>
            <h1 style={{ color: "grey" }}>
              {dealer.full_name} {postReview}
            </h1>
            <h4 style={{ color: "grey" }}>
              {`${dealer.city}, ${dealer.address}, Zip - ${dealer.zip}, ${dealer.state}`}
            </h4>
          </>
        ) : (
          <h1 style={{ color: "grey" }}>Loading...</h1>
        )}
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <p>Loading Reviews...</p>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div className="review_panel" key={review.id}>
              <img
                src={sentimentIcon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model}{" "}
                {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
