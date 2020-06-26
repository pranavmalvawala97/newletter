import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const Payment = (props) => {
  const [yearly, setYearly] = useState("");
  const [monthly, setMonthly] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [stripeData, setStripeData] = useState(null);
  const queryString = window.location.search;

  const handleSave = () => {
    console.log("clicked", typeof yearly);
    axios
      .post(`${BASE_URL}/payment`, {
        yearly,
        monthly,
      })
      .then((res) => {
        setShowMessage(true);
        setMonthly("");
        setYearly("");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    if (code) {
      axios
        .post(`${BASE_URL}/stripe`, {
          code,
        })
        .then((res) => {
          if (res.data.message === "success") {
            setStripeData({
              accessToken: res.data.access_token,
              refreshToken: res.data.refresh_token,
              userId: res.data.stripe_user_id,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }, [queryString]);

  const STRIPE_URL =
    "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HWuNGovq9VVPHBGXcc6kYMeYljCp02U2&scope=read_write";
  return (
    <div className="container">
      <div className="news-main">
        <div className="News-head">
          <h1>Newslatter Title</h1>
          <p>Which plan would you like to offer?</p>
        </div>
        <div className="news-check">
          <div className="news-check-1">
            <label className="cus-che">
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <span>
              Yearly{" "}
              <input
                type="text"
                name="yearly"
                placeholder="$0"
                value={yearly}
                onChange={(e) => setYearly(e.target.value)}
              />
            </span>
          </div>
          <div className="news-check-2">
            <label className="cus-che">
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <span>
              Monthly{" "}
              <input
                type="text"
                name="monthly"
                placeholder="$0"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
              />
            </span>
          </div>
        </div>
        <div className="main-btn-box">
          <a className="s-btn" href={STRIPE_URL}>
            <span>S</span> Connect with Stripe
          </a>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
        {showMessage && (
          <p style={{ textAlign: "center" }}>Saved successfully!!</p>
        )}
      </div>
      {stripeData && (
        <div>
          <ul>
            <li>access token -{stripeData.accessToken}</li>
            <li>refresh token - {stripeData.refreshToken}</li>
            <li>user id - {stripeData.userId}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Payment;
