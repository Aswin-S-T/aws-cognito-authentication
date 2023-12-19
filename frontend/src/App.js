import React, { useState, useEffect } from "react";

import { Amplify } from "aws-amplify";
import { awsExports } from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

function App() {
  const [jwtToken, setJwtToken] = useState("");

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
    } catch (error) {
      console.log("Error fetching JWT token:", error);
    }
  };

  return (
    <div className="screen mt-5">
      <Authenticator
        initialState="signIn"
        components={{
          SignUp: {
            FormFields() {
              return (
                <div className="form">
                  <Authenticator.SignUp.FormFields />

                  <div>
                    <label>First name</label>
                  </div>
                  <input
                    type="text"
                    name="given_name"
                    placeholder="Please enter your first name"
                    className="w-100 p-2"
                  />
                  <div>
                    <label>Last name</label>
                  </div>
                  <input
                    type="text"
                    name="family_name"
                    className="w-100 p-2"
                    placeholder="Please enter your last name"
                  />
                  <div>
                    <label>Email</label>
                  </div>
                  <input
                    type="text"
                    name="email"
                    className="w-100 p-2"
                    placeholder="Please enter a valid email"
                  />
                  <div>
                    <label>Phone Number</label>
                  </div>
                  <input
                    type="text"
                    name="phone_number"
                    className="w-100 p-2"
                    placeholder="Please enter your phone number"
                    // defaultValue="+91"
                  />
                </div>
              );
            },
          },
        }}
        // services={{
        //   async validateCustomSignUp(formData) {
        //     if (!formData.given_name) {
        //       return {
        //         given_name: "First Name is required",
        //       };
        //     }
        //     if (!formData.family_name) {
        //       return {
        //         family_name: "Last Name is required",
        //       };
        //     }
        //     if (!formData.email) {
        //       return {
        //         email: "Email is required",
        //       };
        //     }
        //     // if (!formData.phone_number) {
        //     //   return {
        //     //     phone_number: "Phone Number is required",
        //     //   };
        //     // }

        //     const userPhoneNumber = formData.phone_number;

        //     // Ensure the phone number is not empty
        //     if (!userPhoneNumber) {
        //       return {
        //         phone_number: "Phone Number is required",
        //       };
        //     }

        //     // Concatenate the country code with the user-entered phone number
        //     const fullPhoneNumber = `+91${userPhoneNumber.replace(/^\+1/, "")}`;

        //     console.log(
        //       "CEHECK USER ATTIRBUTES-----------",
        //       formData?.UserAttributes
        //     );

        //     console.log("Modified formData:", formData);
        //   },
        // }}
        services={{
          async validateCustomSignUp(formData) {
            if (!formData.given_name) {
              return {
                given_name: "First Name is required",
              };
            }
            if (!formData.family_name) {
              return {
                family_name: "Last Name is required",
              };
            }
            if (!formData.email) {
              return {
                email: "Email is required",
              };
            }

            const userPhoneNumber = formData.phone_number;

            // Ensure the phone number is not empty
            if (!userPhoneNumber) {
              return {
                phone_number: "Phone Number is required",
              };
            }

            // Concatenate the country code with the user-entered phone number
            const fullPhoneNumber = `+91${userPhoneNumber.replace(/^\+1/, "")}`;

            try {
              // Use Auth.signUp with UserAttributes directly
              const signUpResponse = await Auth.signUp({
                username: formData.email,
                password: formData.password, // Ensure you have the password field in your form
                attributes: {
                  given_name: formData.given_name,
                  family_name: formData.family_name,
                  email: formData.email,
                  phone_number: fullPhoneNumber,
                },
              });

              console.log("Sign-up response:", signUpResponse);
            } catch (error) {
              console.error("Error during sign-up:", error);
              // Handle the error or return an appropriate error message
              return { error: "Error during sign-up" };
            }
          },
        }}
      >
        {({ signOut, user }) => (
          <div className="dashboard">
            <h2>Welcome {user?.attributes?.given_name}</h2>
            <button onClick={signOut} className="m-2">
              Sign out
            </button>
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
